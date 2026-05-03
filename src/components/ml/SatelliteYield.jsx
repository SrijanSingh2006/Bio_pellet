import React, { useState } from 'react';
import axios from 'axios';
import { FaSatellite, FaSatelliteDish } from 'react-icons/fa';

const SatelliteYield = () => {
  const [ndvi, setNdvi] = useState(0.5);
  const [soil, setSoil] = useState(5);
  const [rain, setRain] = useState(150);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrediction = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('http://localhost:5006/api/ml/predict-yield', {
        ndvi,
        soil_quality: soil,
        rainfall_mm: rain
      });
      if (res.data.success) {
        setResult(res.data.yield_tonnes);
      } else {
        setError(res.data.error);
      }
    } catch (err) {
      setError("Failed to connect to Python ML Backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl flex items-center justify-center text-2xl">
          <FaSatellite />
        </div>
        <div>
          <h3 className="text-xl font-bold dark:text-white">Satellite NDVI Biomass Estimator</h3>
          <p className="text-xs text-gray-500">Python Random Forest Regressor</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
        Simulates fetching satellite <b>Normalized Difference Vegetation Index (NDVI)</b> data, cross-referenced with soil and rainfall, to predict exact farm biomass yield.
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
            NDVI (Vegetation Density): <span className="text-green-600 font-bold">{ndvi.toFixed(2)}</span>
          </label>
          <input 
            type="range" min={0.2} max={0.9} step={0.01} value={ndvi} 
            onChange={(e) => setNdvi(Number(e.target.value))}
            className="w-full accent-green-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>Sparse</span><span>Dense Canopy</span></div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
            Soil Quality Index: <span className="text-green-600 font-bold">{soil}/10</span>
          </label>
          <input 
            type="range" min={1} max={10} value={soil} 
            onChange={(e) => setSoil(Number(e.target.value))}
            className="w-full accent-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
            Rainfall (mm): <span className="text-green-600 font-bold">{rain} mm</span>
          </label>
          <input 
            type="range" min={50} max={400} value={rain} 
            onChange={(e) => setRain(Number(e.target.value))}
            className="w-full accent-green-600"
          />
        </div>

        <button
          onClick={fetchPrediction}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          {loading ? (
            <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Querying Python Backend...</>
          ) : (
            <><FaSatelliteDish /> Request ML Prediction</>
          )}
        </button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {result && (
          <div className="mt-4 p-5 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 text-center">
            <p className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-1">Predicted Yield</p>
            <p className="text-4xl font-black text-green-600">{result} <span className="text-lg">t/ha</span></p>
            <p className="text-xs text-gray-500 mt-2">Predicted by <b>scikit-learn</b> Random Forest model</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SatelliteYield;
