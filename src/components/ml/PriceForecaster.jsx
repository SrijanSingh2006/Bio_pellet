import React, { useState } from 'react';
import axios from 'axios';
import { FaChartLine } from 'react-icons/fa';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const PriceForecaster = () => {
  const [month, setMonth] = useState(1);
  const [diesel, setDiesel] = useState(90);
  const [demand, setDemand] = useState(50);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrediction = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${import.meta.env.VITE_ML_BACKEND_URL}/api/ml/predict-price`, {
        month,
        diesel_price: diesel,
        demand
      });
      if (res.data.success) {
        setResult(res.data.predicted_price_inr);
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
        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl flex items-center justify-center text-2xl">
          <FaChartLine />
        </div>
        <div>
          <h3 className="text-xl font-bold dark:text-white">Dynamic Market Price Forecasting</h3>
          <p className="text-xs text-gray-500">Python Random Forest Regressor</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
        Biomass prices are highly volatile. This model analyzes seasonality, macroeconomic factors (diesel cost), and regional demand to forecast the fair market price of biomass.
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
            Target Month: <span className="text-purple-600 font-bold">{MONTHS[month - 1]}</span>
          </label>
          <input 
            type="range" min={1} max={12} value={month} 
            onChange={(e) => setMonth(Number(e.target.value))}
            className="w-full accent-purple-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
            Diesel Price (Transport Cost): <span className="text-purple-600 font-bold">₹{diesel}/L</span>
          </label>
          <input 
            type="range" min={80} max={120} value={diesel} 
            onChange={(e) => setDiesel(Number(e.target.value))}
            className="w-full accent-purple-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
            Regional Demand Index: <span className="text-purple-600 font-bold">{demand}/100</span>
          </label>
          <input 
            type="range" min={10} max={100} value={demand} 
            onChange={(e) => setDemand(Number(e.target.value))}
            className="w-full accent-purple-600"
          />
        </div>

        <button
          onClick={fetchPrediction}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          {loading ? (
            <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Querying Python Backend...</>
          ) : (
            <><FaChartLine /> Forecast Price</>
          )}
        </button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {result && (
          <div className="mt-4 p-5 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 text-center flex flex-col items-center">
            <p className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-1">Forecasted Fair Price</p>
            <p className="text-4xl font-black text-purple-600">₹{Math.round(result).toLocaleString()} <span className="text-lg">/ tonne</span></p>
            <p className="text-xs text-gray-500 mt-2">Predicted by <b>scikit-learn</b> Time-Series model</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceForecaster;
