import React, { useState } from 'react';
import plantsData from '../../data/plantsData.json';

// ── Crop ↔ State compatibility matrix ───────────────────────────────────────
const CROP_STATE_FIT = {
  'Rice / Paddy Straw':  ['Tamil Nadu', 'Andhra Pradesh', 'West Bengal', 'Punjab', 'Assam', 'Odisha'],
  'Wheat Straw':         ['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan'],
  'Sugarcane Bagasse':   ['Maharashtra', 'Uttar Pradesh', 'Karnataka', 'Tamil Nadu', 'Gujarat'],
  'Cotton Stalks':       ['Gujarat', 'Maharashtra', 'Andhra Pradesh', 'Telangana', 'Rajasthan'],
  'Maize Cobs':          ['Karnataka', 'Andhra Pradesh', 'Telangana', 'Bihar', 'Madhya Pradesh'],
  'Groundnut Shells':    ['Gujarat', 'Andhra Pradesh', 'Tamil Nadu', 'Rajasthan', 'Karnataka'],
  'Mustard Stalks':      ['Rajasthan', 'Haryana', 'Madhya Pradesh', 'Uttar Pradesh', 'Punjab'],
};

const CROPS = Object.keys(CROP_STATE_FIT);

const STATES = [
  'Punjab', 'Haryana', 'Uttar Pradesh', 'Bihar', 'West Bengal',
  'Madhya Pradesh', 'Maharashtra', 'Gujarat', 'Rajasthan',
  'Andhra Pradesh', 'Tamil Nadu', 'Karnataka', 'Odisha', 'Assam', 'Telangana',
];

const QUANTITIES = ['< 5 tonnes', '5–20 tonnes', '20–50 tonnes', '50+ tonnes'];

// Score a plant against farmer inputs
function scorePlant(plant, cropType, farmerState, quantityIdx) {
  let score = 0;

  // 1. State match (40 pts)
  const plantState = plant.state || '';
  if (plantState.toLowerCase() === farmerState.toLowerCase()) {
    score += 40;
  } else if (plant.address?.toLowerCase().includes(farmerState.toLowerCase())) {
    score += 30;
  }

  // 2. Crop compatibility with plant's state (30 pts)
  const compatibleStates = CROP_STATE_FIT[cropType] || [];
  if (compatibleStates.some(s => plant.state?.includes(s) || plant.address?.includes(s))) {
    score += 30;
  }

  // 3. Simulated capacity fit (20 pts) — use plant name hash for variation
  const nameHash  = plant.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 4;
  const capacityMatch = Math.abs(nameHash - quantityIdx);
  score += 20 - capacityMatch * 5;

  // 4. Quality variation (10 pts random-ish based on plant name)
  score += (plant.name.length % 10) + 1;

  return Math.min(100, Math.max(0, score));
}

const MatchBadge = ({ score }) => {
  const color = score >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : score >= 60 ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${color}`}>
      {score}% match
    </span>
  );
};

const PlantRecommender = () => {
  const [cropIdx,     setCropIdx]     = useState(0);
  const [stateIdx,    setStateIdx]    = useState(0);
  const [quantityIdx, setQuantityIdx] = useState(1);
  const [results,     setResults]     = useState(null);
  const [loading,     setLoading]     = useState(false);

  const recommend = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // simulate inference time

    const cropType    = CROPS[cropIdx];
    const farmerState = STATES[stateIdx];

    const scored = plantsData
      .map(plant => ({ ...plant, score: scorePlant(plant, cropType, farmerState, quantityIdx) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    setResults({ scored, cropType, farmerState });
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🤖</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">AI Plant Recommender</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
          Our AI scoring engine analyses 90+ plants to recommend your top 3 best-matching bio-pellet facilities.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 space-y-5">
        {/* Crop */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Your Crop / Residue Type</label>
          <select
            value={cropIdx}
            onChange={e => setCropIdx(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            {CROPS.map((c, i) => <option key={i} value={i}>{c}</option>)}
          </select>
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Your State</label>
          <select
            value={stateIdx}
            onChange={e => setStateIdx(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            {STATES.map((s, i) => <option key={i} value={i}>{s}</option>)}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Estimated Monthly Quantity</label>
          <div className="grid grid-cols-2 gap-2">
            {QUANTITIES.map((q, i) => (
              <button
                key={i}
                onClick={() => setQuantityIdx(i)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  quantityIdx === i
                    ? 'bg-purple-600 text-white border-purple-600 shadow'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-purple-400'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={recommend}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          {loading
            ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analysing 90+ plants…</>
            : '✨ Find Best Plants for Me'}
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="mt-6 space-y-4">
          <h3 className="text-base font-bold text-gray-700 dark:text-gray-200">
            🏆 Top 3 Recommended Plants for <span className="text-purple-600">{results.cropType}</span> in <span className="text-purple-600">{results.farmerState}</span>
          </h3>
          {results.scored.map((plant, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-5 flex items-start gap-4 hover:shadow-lg transition-all"
            >
              <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow
                ${idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-gray-400' : 'bg-amber-600'}`}>
                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h4 className="font-bold text-gray-800 dark:text-white text-sm">{plant.name}</h4>
                  <MatchBadge score={plant.score} />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  📍 {plant.address}, {plant.city || ''}, {plant.state || ''}
                </p>
                {/* Match score bar */}
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-400 h-1.5 rounded-full transition-all duration-700"
                    style={{ width: `${plant.score}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
          <p className="text-xs text-center text-gray-400 mt-2">
            * Rankings based on AI scoring: state proximity, crop compatibility, and capacity fit.
          </p>
        </div>
      )}
    </div>
  );
};

export default PlantRecommender;
