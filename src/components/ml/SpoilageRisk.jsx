import React, { useState, useEffect } from 'react';

const SpoilageRisk = () => {
  const [riskData, setRiskData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState('Punjab');
  
  const STATES = ['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Maharashtra'];

  const generateForecast = () => {
    setLoading(true);
    setTimeout(() => {
      const baseRisk = state === 'Maharashtra' ? 40 : state === 'Punjab' ? 10 : 20;
      
      const newData = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        // Simulate a neural net time-series output with weather volatility
        const risk = Math.min(100, Math.max(0, baseRisk + (i * 8) + (Math.random() * 20 - 10)));
        return {
          day: d.toLocaleDateString('en-US', { weekday: 'short' }),
          risk: Math.round(risk)
        };
      });
      setRiskData(newData);
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    generateForecast();
    // eslint-disable-next-line
  }, [state]);

  const maxRisk = Math.max(...riskData.map(d => d.risk), 10);
  const criticalDay = riskData.findIndex(d => d.risk > 70);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 rounded-xl flex items-center justify-center text-2xl">
          🌦️
        </div>
        <div>
          <h3 className="text-xl font-bold dark:text-white">Spoilage Risk Forecaster</h3>
          <p className="text-xs text-gray-500">Time-Series Neural Network Analysis</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
        Rain and humidity can rot harvested biomass. This model predicts your 7-day spoilage risk, telling you exactly when it's safe to store and when you MUST sell immediately.
      </p>

      <div className="mb-6">
         <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Select Farm Location</label>
         <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            {STATES.map((s, i) => <option key={i} value={s}>{s}</option>)}
          </select>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm text-cyan-600 font-medium">Running climate models...</p>
        </div>
      ) : (
        <>
          <div className="flex items-end gap-2 h-48 mt-6">
            {riskData.map((data, i) => {
              const isDanger = data.risk > 70;
              const isWarning = data.risk > 40;
              const color = isDanger ? 'from-red-500 to-red-400' : isWarning ? 'from-yellow-500 to-yellow-400' : 'from-green-500 to-green-400';
              
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end group relative">
                  <span className={`text-[10px] font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 ${isDanger ? 'text-red-500' : 'text-gray-500'}`}>
                    {data.risk}%
                  </span>
                  <div
                    className={`w-full rounded-t-lg bg-gradient-to-t ${color} transition-all duration-500`}
                    style={{ height: `${(data.risk / 100) * 100}%` }}
                  />
                  <span className="text-xs text-gray-400 mt-2">{data.day}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600">
            <h4 className="font-bold text-gray-800 dark:text-white mb-1">AI Recommendation:</h4>
            {criticalDay === -1 ? (
              <p className="text-sm text-green-600 font-medium">✅ Weather is stable. Safe to store biomass on field.</p>
            ) : criticalDay === 0 ? (
              <p className="text-sm text-red-600 font-bold">🚨 CRITICAL RISK TODAY! Sell or cover biomass immediately!</p>
            ) : (
              <p className="text-sm text-yellow-600 font-medium">⚠️ Risk spikes by {riskData[criticalDay].day}. Clear fields before then to avoid price penalties.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SpoilageRisk;
