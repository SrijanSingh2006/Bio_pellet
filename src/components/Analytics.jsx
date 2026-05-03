import React, { useEffect, useRef, useState } from "react";
import { FaChartLine, FaLeaf, FaMoneyBillWave, FaMapMarkedAlt, FaTree, FaSmog, FaBrain } from "react-icons/fa";
import * as tf from '@tensorflow/tfjs';
import plantsData from "../data/plantsData.json";

// Animated counter hook
function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

// ── ML Demand Forecaster ──────────────────────────────────────────────────────
// Seasonal demand pattern: Kharif harvest peaks Oct-Dec, Rabi peaks Mar-Apr
const HISTORICAL = [40, 55, 48, 62, 70, 85, 78, 95, 110, 130, 120, 105]; // Jan–Dec

async function trainForecastModel() {
  // Build training pairs: month_sin, month_cos → demand_norm (encode seasonality)
  const xs = [], ys = [];
  for (let year = 0; year < 5; year++) {
    HISTORICAL.forEach((val, m) => {
      const noise = 0.88 + Math.random() * 0.24;
      xs.push([Math.sin(2 * Math.PI * m / 12), Math.cos(2 * Math.PI * m / 12), m / 11]);
      ys.push([(val * noise) / 150]);
    });
  }
  const model = tf.sequential({
    layers: [
      tf.layers.dense({ inputShape: [3], units: 16, activation: 'relu' }),
      tf.layers.dense({ units: 8, activation: 'relu' }),
      tf.layers.dense({ units: 1, activation: 'sigmoid' }),
    ],
  });
  model.compile({ optimizer: tf.train.adam(0.01), loss: 'meanSquaredError' });
  const xT = tf.tensor2d(xs), yT = tf.tensor2d(ys);
  await model.fit(xT, yT, { epochs: 120, batchSize: 16, verbose: 0 });
  xT.dispose(); yT.dispose();
  return model;
}

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const NEXT_6_MONTHS = Array.from({ length: 6 }, (_, i) => {
  const d = new Date();
  d.setMonth(d.getMonth() + i);
  return { label: MONTH_LABELS[d.getMonth()], idx: d.getMonth() };
});

function DemandForecast() {
  const [forecasts, setForecasts] = useState([]);
  const [training, setTraining]   = useState(true);
  const [selState, setSelState]   = useState('All India');

  const STATE_BOOST = { Punjab: 1.35, Haryana: 1.25, 'Tamil Nadu': 1.1, Maharashtra: 1.12, Gujarat: 1.08 };

  useEffect(() => {
    (async () => {
      const model = await trainForecastModel();
      const boost = STATE_BOOST[selState] ?? 1.0;
      const preds = await Promise.all(
        NEXT_6_MONTHS.map(async ({ idx }) => {
          const inp = tf.tensor2d([[Math.sin(2 * Math.PI * idx / 12), Math.cos(2 * Math.PI * idx / 12), idx / 11]]);
          const out = model.predict(inp);
          const val = (await out.data())[0] * 150 * boost;
          inp.dispose(); out.dispose();
          return Math.round(val);
        })
      );
      model.dispose();
      setForecasts(preds);
      setTraining(false);
    })();
  }, [selState]);

  const maxVal = Math.max(...forecasts, 80);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 mt-8" data-aos="fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
        <div>
          <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
            <FaBrain className="text-purple-500" /> ML Demand Forecast
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Next 6 months — TF.js seasonal time-series model</p>
        </div>
        <select
          value={selState}
          onChange={e => { setSelState(e.target.value); setTraining(true); }}
          className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          {['All India','Punjab','Haryana','Tamil Nadu','Maharashtra','Gujarat'].map(s =>
            <option key={s}>{s}</option>
          )}
        </select>
      </div>
      {training ? (
        <div className="flex items-center justify-center gap-3 py-12 text-purple-500">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Training forecast model…</span>
        </div>
      ) : (
        <div>
          <div className="flex items-end gap-2 h-44 mt-6">
            {forecasts.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end group">
                <span className="text-[10px] text-purple-500 font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {val}t
                </span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-purple-600 to-pink-400 opacity-85 group-hover:opacity-100 transition-all duration-300 relative"
                  style={{ height: `${(val / maxVal) * 100}%` }}
                >
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-white/40 rounded" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2 px-0.5">
            {NEXT_6_MONTHS.map(m => <span key={m.label}>{m.label}</span>)}
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            📈 Peak demand expected: {NEXT_6_MONTHS[forecasts.indexOf(Math.max(...forecasts))]?.label} — plan accordingly
          </p>
        </div>
      )}
    </div>
  );
}

// Count plants per state for real data
const stateCounts = plantsData.reduce((acc, plant) => {
  const state = plant.state || (plant.address?.split(',').slice(-2, -1)[0]?.trim()) || 'Unknown';
  acc[state] = (acc[state] || 0) + 1;
  return acc;
}, {});

const topStates = Object.entries(stateCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);

const maxCount = topStates[0]?.[1] || 1;

const StatCard = ({ icon, title, value, suffix = '', change, color }) => {
  const count = useCountUp(value);
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className={`text-3xl ${color} p-4 rounded-xl bg-opacity-10`}>
          {icon}
        </div>
        <div className="text-right">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
            {count.toLocaleString()}{suffix}
          </p>
          <p className="text-sm text-green-500 mt-2 font-medium">+{change}% from last month</p>
        </div>
      </div>
    </div>
  );
};

const Analytics = () => {
  const totalPlants = plantsData.length;
  const totalStates = Object.keys(stateCounts).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-400">
            Bio-Pellet Analytics Dashboard
          </h1>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Monitor supply chain metrics, production rates, and environmental impact in real-time.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" data-aos="fade-up">
          <StatCard
            icon={<FaLeaf />} title="Total Plants in DB" value={totalPlants} change="12.5"
            color="text-green-500 bg-green-100 dark:bg-green-900/30"
          />
          <StatCard
            icon={<FaMapMarkedAlt />} title="States Covered" value={totalStates} change="3.0"
            color="text-blue-500 bg-blue-100 dark:bg-blue-900/30"
          />
          <StatCard
            icon={<FaMoneyBillWave />} title="Revenue Gen. (₹L)" value={42} suffix="L" change="15.3"
            color="text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30"
          />
          <StatCard
            icon={<FaChartLine />} title="Pellets Produced (t)" value={1840} suffix="t" change="8.2"
            color="text-purple-500 bg-purple-100 dark:bg-purple-900/30"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Production Bar Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700" data-aos="fade-right">
            <h3 className="text-xl font-bold mb-1 dark:text-white">Monthly Production Trend (tonnes)</h3>
            <p className="text-xs text-gray-400 mb-4">Biomass processed across all registered plants</p>
            <div className="h-56 flex items-end space-x-2 w-full mt-4">
              {[40, 60, 45, 80, 65, 90, 75, 100, 85, 95, 110, 120].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end items-center group">
                  <span className="text-[10px] text-gray-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {height}t
                  </span>
                  <div
                    className="w-full bg-gradient-to-t from-green-600 to-teal-400 rounded-t opacity-80 group-hover:opacity-100 transition-all duration-300"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium px-1">
              {['J','F','M','A','M','J','J','A','S','O','N','D'].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>

          {/* State Distribution — REAL DATA */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700" data-aos="fade-left">
            <h3 className="text-xl font-bold mb-1 dark:text-white">Plants by State</h3>
            <p className="text-xs text-gray-400 mb-4">Top 5 states by plant count</p>
            <div className="space-y-4">
              {topStates.map(([state, count], i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1 dark:text-gray-300 font-medium">
                    <span>{state}</span>
                    <span className="text-green-500 font-bold">{count} plants</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-green-400 to-teal-500 h-2.5 rounded-full transition-all duration-700"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Eco Impact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-aos="fade-up">
          <div className="bg-gradient-to-br from-green-600 to-teal-500 rounded-2xl p-8 text-white shadow-xl">
            <FaTree className="text-5xl mb-4 opacity-80" />
            <h3 className="text-2xl font-bold mb-2">Trees Equivalent Saved</h3>
            <p className="text-5xl font-extrabold mb-2">12,400</p>
            <p className="text-green-100 text-sm">
              Each tonne of bio-pellets saves approximately 3 trees from deforestation annually.
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 text-white shadow-xl">
            <FaSmog className="text-5xl mb-4 opacity-80 text-gray-400" />
            <h3 className="text-2xl font-bold mb-2">CO₂ Emissions Avoided</h3>
            <p className="text-5xl font-extrabold mb-2">3,680t</p>
            <p className="text-gray-400 text-sm">
              Replacing coal with bio-pellets avoids ~2 tonnes of CO₂ per tonne of pellets consumed.
            </p>
          </div>
        </div>

        {/* ML Demand Forecast */}
        <DemandForecast />
      </div>
    </div>
  );
};

export default Analytics;
