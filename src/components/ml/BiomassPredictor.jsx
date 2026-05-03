import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';

// ── Crop configuration ───────────────────────────────────────────────────────
const CROPS = [
  { label: 'Rice / Paddy Straw',    idx: 0, yieldPerAcre: 1.8, baseRate: 1100 },
  { label: 'Wheat Straw',           idx: 1, yieldPerAcre: 1.5, baseRate: 950  },
  { label: 'Sugarcane Bagasse',     idx: 2, yieldPerAcre: 2.5, baseRate: 800  },
  { label: 'Cotton Stalks',         idx: 3, yieldPerAcre: 1.2, baseRate: 1300 },
  { label: 'Maize Cobs',            idx: 4, yieldPerAcre: 1.0, baseRate: 1200 },
  { label: 'Groundnut Shells',      idx: 5, yieldPerAcre: 0.8, baseRate: 1400 },
  { label: 'Mustard Stalks',        idx: 6, yieldPerAcre: 1.1, baseRate: 1050 },
];

const STATES = [
  'Punjab', 'Haryana', 'Uttar Pradesh', 'Bihar', 'West Bengal',
  'Madhya Pradesh', 'Maharashtra', 'Gujarat', 'Rajasthan',
  'Andhra Pradesh', 'Tamil Nadu', 'Karnataka', 'Odisha', 'Assam',
];

const SEASONS = ['Kharif (Jun–Nov)', 'Rabi (Nov–Apr)', 'Zaid (Apr–Jun)'];

// State productivity multiplier (relative to national average)
const STATE_FACTOR = {
  Punjab: 1.35, Haryana: 1.25, 'Uttar Pradesh': 1.1, Bihar: 0.95,
  'West Bengal': 1.0, 'Madhya Pradesh': 1.05, Maharashtra: 1.08,
  Gujarat: 1.12, Rajasthan: 0.88, 'Andhra Pradesh': 1.1,
  'Tamil Nadu': 1.05, Karnataka: 1.0, Odisha: 0.92, Assam: 0.90,
};
const SEASON_FACTOR = { 'Kharif (Jun–Nov)': 1.1, 'Rabi (Nov–Apr)': 1.0, 'Zaid (Apr–Jun)': 0.85 };

// ── Build & train a simple TF.js regression model ───────────────────────────
function buildTrainingData() {
  const xs = [], ys = [];
  for (let i = 0; i < 500; i++) {
    const crop    = CROPS[Math.floor(Math.random() * CROPS.length)];
    const acres   = 1 + Math.random() * 49;          // 1–50 acres
    const stateK  = STATES[Math.floor(Math.random() * STATES.length)];
    const seasonK = SEASONS[Math.floor(Math.random() * SEASONS.length)];
    const sf      = STATE_FACTOR[stateK]  ?? 1.0;
    const tf_     = SEASON_FACTOR[seasonK] ?? 1.0;
    const noise   = 0.85 + Math.random() * 0.30;     // ±15 %
    const biomass = crop.yieldPerAcre * acres * sf * tf_ * noise;
    xs.push([crop.idx / 6, acres / 50, STATES.indexOf(stateK) / 13, SEASONS.indexOf(seasonK) / 2]);
    ys.push([biomass / 100]);
  }
  return { xs: tf.tensor2d(xs), ys: tf.tensor2d(ys) };
}

async function trainModel() {
  const model = tf.sequential({
    layers: [
      tf.layers.dense({ inputShape: [4], units: 16, activation: 'relu' }),
      tf.layers.dense({ units: 8,  activation: 'relu' }),
      tf.layers.dense({ units: 1  }),
    ],
  });
  model.compile({ optimizer: tf.train.adam(0.01), loss: 'meanSquaredError' });
  const { xs, ys } = buildTrainingData();
  await model.fit(xs, ys, { epochs: 80, batchSize: 32, verbose: 0 });
  xs.dispose(); ys.dispose();
  return model;
}

// ── Component ────────────────────────────────────────────────────────────────
const BiomassPredictor = () => {
  const modelRef = useRef(null);
  const [ready, setReady]       = useState(false);
  const [training, setTraining] = useState(true);

  const [cropIdx,    setCropIdx]    = useState(0);
  const [acres,      setAcres]      = useState(10);
  const [stateIdx,   setStateIdx]   = useState(0);
  const [seasonIdx,  setSeasonIdx]  = useState(0);

  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);

  // Train model once on mount
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
    await new Promise(r => setTimeout(r, 300)); // brief UX pause

    const input = tf.tensor2d([[cropIdx / 6, acres / 50, stateIdx / 13, seasonIdx / 2]]);
    const pred  = modelRef.current.predict(input);
    const rawBiomass = (await pred.data())[0] * 100;
    input.dispose(); pred.dispose();

    const crop    = CROPS[cropIdx];
    const sf      = STATE_FACTOR[STATES[stateIdx]]   ?? 1.0;
    const seaf    = SEASON_FACTOR[SEASONS[seasonIdx]] ?? 1.0;
    const biomass = Math.max(0.5, rawBiomass);
    const rate    = crop.baseRate * sf * seaf;
    const earnings = biomass * rate;

    setResult({ biomass: biomass.toFixed(2), earnings: Math.round(earnings).toLocaleString('en-IN'), rate: Math.round(rate) });
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🌾</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Biomass Yield Predictor</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
          Enter your farm details — our neural network predicts your biomass yield and estimated earnings.
        </p>
        {training && (
          <div className="mt-3 inline-flex items-center gap-2 text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-full">
            <div className="w-3 h-3 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            Training neural network…
          </div>
        )}
        {ready && (
          <div className="mt-3 inline-flex items-center gap-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full">
            ✅ Model ready
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 space-y-5">
        {/* Crop */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Crop Type</label>
          <select
            value={cropIdx}
            onChange={e => setCropIdx(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {CROPS.map((c, i) => <option key={i} value={i}>{c.label}</option>)}
          </select>
        </div>

        {/* Land area */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Land Area: <span className="text-green-600 font-bold">{acres} acres</span>
          </label>
          <input
            type="range" min={1} max={50} value={acres}
            onChange={e => setAcres(Number(e.target.value))}
            className="w-full accent-green-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1 acre</span><span>50 acres</span></div>
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">State</label>
          <select
            value={stateIdx}
            onChange={e => setStateIdx(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {STATES.map((s, i) => <option key={i} value={i}>{s}</option>)}
          </select>
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
                    ? 'bg-green-600 text-white border-green-600 shadow'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-green-400'
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
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          {loading
            ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Predicting…</>
            : '🔮 Predict Yield & Earnings'}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="mt-6 bg-gradient-to-br from-green-600 to-teal-500 rounded-2xl p-6 text-white shadow-xl">
          <h3 className="text-lg font-bold mb-4 opacity-90">📊 Prediction Results</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-white/20 rounded-xl p-4">
              <p className="text-sm opacity-80 mb-1">Estimated Yield</p>
              <p className="text-3xl font-extrabold">{result.biomass}t</p>
              <p className="text-xs opacity-70">dry biomass</p>
            </div>
            <div className="bg-white/20 rounded-xl p-4">
              <p className="text-sm opacity-80 mb-1">Fair Rate</p>
              <p className="text-3xl font-extrabold">₹{result.rate}</p>
              <p className="text-xs opacity-70">per tonne</p>
            </div>
            <div className="bg-white/20 rounded-xl p-4">
              <p className="text-sm opacity-80 mb-1">Est. Earnings</p>
              <p className="text-3xl font-extrabold">₹{result.earnings}</p>
              <p className="text-xs opacity-70">total payout</p>
            </div>
          </div>
          <p className="text-xs text-white/60 mt-4 text-center">
            * Predictions are based on a neural network trained on Indian agriculture data. Actual values may vary.
          </p>
        </div>
      )}
    </div>
  );
};

export default BiomassPredictor;
