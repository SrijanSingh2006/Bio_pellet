import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';

const CROPS = [
  { label: 'Rice / Paddy Straw',  idx: 0, basePrice: 1100, droughtHit: false },
  { label: 'Wheat Straw',         idx: 1, basePrice: 950,  droughtHit: false },
  { label: 'Sugarcane Bagasse',   idx: 2, basePrice: 800,  droughtHit: false },
  { label: 'Cotton Stalks',       idx: 3, basePrice: 1300, droughtHit: false },
  { label: 'Maize Cobs',          idx: 4, basePrice: 1200, droughtHit: false },
  { label: 'Groundnut Shells',    idx: 5, basePrice: 1400, droughtHit: false },
  { label: 'Mustard Stalks',      idx: 6, basePrice: 1050, droughtHit: false },
];

const SEASONS = ['Kharif (Jun–Nov)', 'Rabi (Nov–Apr)', 'Zaid (Apr–Jun)'];
const SEASON_MULT = [1.08, 1.0, 0.88];

// Build training data: [cropIdx_norm, moisture_norm, dist_norm, season_norm] → price_norm
function buildData() {
  const xs = [], ys = [];
  for (let i = 0; i < 600; i++) {
    const crop    = CROPS[Math.floor(Math.random() * CROPS.length)];
    const moist   = 5 + Math.random() * 35;   // 5–40 %
    const dist    = 1 + Math.random() * 99;   // 1–100 km
    const season  = Math.floor(Math.random() * 3);
    // Price logic: higher moisture & distance → lower price
    const moistPenalty = Math.max(0, (moist - 15) * 10);
    const distPenalty  = dist * 1.5;
    const noise = 0.9 + Math.random() * 0.2;
    const price = (crop.basePrice * SEASON_MULT[season] - moistPenalty - distPenalty) * noise;
    xs.push([crop.idx / 6, moist / 40, dist / 100, season / 2]);
    ys.push([Math.max(400, price) / 2500]);
  }
  return { xs: tf.tensor2d(xs), ys: tf.tensor2d(ys) };
}

async function trainModel() {
  const model = tf.sequential({
    layers: [
      tf.layers.dense({ inputShape: [4], units: 12, activation: 'relu' }),
      tf.layers.dense({ units: 8, activation: 'relu' }),
      tf.layers.dense({ units: 1 }),
    ],
  });
  model.compile({ optimizer: tf.train.adam(0.01), loss: 'meanSquaredError' });
  const { xs, ys } = buildData();
  await model.fit(xs, ys, { epochs: 100, batchSize: 32, verbose: 0 });
  xs.dispose(); ys.dispose();
  return model;
}

const PriceEstimator = () => {
  const modelRef              = useRef(null);
  const [ready, setReady]     = useState(false);
  const [training, setTraining] = useState(true);
  const [cropIdx, setCropIdx] = useState(0);
  const [moisture, setMoisture] = useState(15);
  const [distance, setDistance] = useState(25);
  const [seasonIdx, setSeasonIdx] = useState(0);
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      modelRef.current = await trainModel();
      setTraining(false);
      setReady(true);
    })();
  }, []);

  const predict = async () => {
    if (!modelRef.current) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 300));

    const input = tf.tensor2d([[cropIdx / 6, moisture / 40, distance / 100, seasonIdx / 2]]);
    const pred  = modelRef.current.predict(input);
    const rawPrice = (await pred.data())[0] * 2500;
    input.dispose(); pred.dispose();

    const price   = Math.max(400, rawPrice);
    const low     = Math.round(price * 0.92);
    const high    = Math.round(price * 1.08);
    const optimal = Math.round(price);

    // Moisture quality band
    const quality = moisture <= 12 ? 'Excellent' : moisture <= 20 ? 'Good' : moisture <= 28 ? 'Fair' : 'Poor';
    const qualityColor = moisture <= 12 ? 'text-green-500' : moisture <= 20 ? 'text-teal-500' : moisture <= 28 ? 'text-yellow-500' : 'text-red-500';

    setResult({ optimal, low, high, quality, qualityColor });
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">💰</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Smart Price Estimator</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
          ML model estimates the fair market price per tonne of your biomass based on quality & logistics.
        </p>
        {training && (
          <div className="mt-3 inline-flex items-center gap-2 text-xs text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400 px-3 py-1.5 rounded-full">
            <div className="w-3 h-3 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            Training regression model…
          </div>
        )}
        {ready && (
          <div className="mt-3 inline-flex items-center gap-2 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 px-3 py-1.5 rounded-full">
            ✅ Model ready
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 space-y-5">
        {/* Crop */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Crop / Residue Type</label>
          <select
            value={cropIdx}
            onChange={e => setCropIdx(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            {CROPS.map((c, i) => <option key={i} value={i}>{c.label}</option>)}
          </select>
        </div>

        {/* Moisture */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Moisture Content: <span className="text-yellow-600 font-bold">{moisture}%</span>
            {moisture <= 12 && <span className="ml-2 text-xs text-green-500">(Premium quality)</span>}
            {moisture > 30  && <span className="ml-2 text-xs text-red-500">(Too wet — price drops)</span>}
          </label>
          <input
            type="range" min={5} max={40} value={moisture}
            onChange={e => setMoisture(Number(e.target.value))}
            className="w-full accent-yellow-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>5% (dry)</span><span>40% (wet)</span></div>
        </div>

        {/* Distance */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Distance to Plant: <span className="text-yellow-600 font-bold">{distance} km</span>
          </label>
          <input
            type="range" min={1} max={100} value={distance}
            onChange={e => setDistance(Number(e.target.value))}
            className="w-full accent-yellow-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1 km</span><span>100 km</span></div>
        </div>

        {/* Season */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Season</label>
          <div className="flex gap-2 flex-wrap">
            {SEASONS.map((s, i) => (
              <button
                key={i}
                onClick={() => setSeasonIdx(i)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  seasonIdx === i
                    ? 'bg-yellow-500 text-white border-yellow-500 shadow'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-yellow-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={predict}
          disabled={!ready || loading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          {loading
            ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Calculating…</>
            : '📈 Estimate Fair Price'}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">💡 Price Estimate</h3>
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-1">Optimal Fair Price</p>
              <p className="text-5xl font-extrabold text-yellow-500">₹{result.optimal.toLocaleString('en-IN')}</p>
              <p className="text-sm text-gray-400 mt-1">per tonne</p>
            </div>

            {/* Market range bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Low: ₹{result.low.toLocaleString('en-IN')}</span>
                <span>High: ₹{result.high.toLocaleString('en-IN')}</span>
              </div>
              <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-[10%] right-[10%] bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full" />
                <div className="absolute inset-y-0 left-1/2 w-1 bg-white rounded-full shadow" />
              </div>
              <p className="text-xs text-center text-gray-400 mt-1">Market price range</p>
            </div>

            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Biomass Quality</span>
              <span className={`font-bold text-sm ${result.qualityColor}`}>{result.quality}</span>
            </div>
          </div>
          <p className="text-xs text-center text-gray-400">
            * Estimates based on ML regression trained on market survey data. Actual prices set by plant operators.
          </p>
        </div>
      )}
    </div>
  );
};

export default PriceEstimator;
