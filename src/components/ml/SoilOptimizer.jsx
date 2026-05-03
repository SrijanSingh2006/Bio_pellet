import React, { useState } from 'react';

const SoilOptimizer = () => {
  const [sellPercentage, setSellPercentage] = useState(100);
  const [acres, setAcres] = useState(10);
  
  // Baseline economics for 1 acre of Rice Straw
  const YIELD_PER_ACRE = 2.5; // tonnes
  const PRICE_PER_TONNE = 1200; // INR
  
  // Fertilizer replacement cost if 100% removed
  // Removing straw removes N, P, K. 
  // Replacing it with chemical fertilizers costs approx INR 1500 per acre
  const MAX_FERTILIZER_COST_PER_ACRE = 1500;

  // Calculations
  const totalBiomass = acres * YIELD_PER_ACRE;
  const soldBiomass = totalBiomass * (sellPercentage / 100);
  
  // Income
  const grossIncome = soldBiomass * PRICE_PER_TONNE;
  
  // Soil degradation cost (regression logic simplified)
  // If you sell 0%, fertilizer cost is 0. If you sell 100%, it's MAX.
  // Actually, soil health drops non-linearly. We'll simulate a slight curve.
  const degradationFactor = Math.pow(sellPercentage / 100, 1.5); 
  const fertilizerCost = acres * MAX_FERTILIZER_COST_PER_ACRE * degradationFactor;
  
  const netProfit = grossIncome - fertilizerCost;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-lime-100 dark:bg-lime-900/30 text-lime-600 rounded-xl flex items-center justify-center text-2xl">
          🌱
        </div>
        <div>
          <h3 className="text-xl font-bold dark:text-white">Soil Health & Fertilizer Optimizer</h3>
          <p className="text-xs text-gray-500">Economic Regression Trade-off Model</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
        Selling 100% of your crop residue strips the soil of vital nutrients (N-P-K), forcing you to buy expensive chemical fertilizers next season. This model finds your optimal financial balance.
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
            Farm Size: <span className="text-lime-600 font-bold">{acres} Acres</span>
          </label>
          <input 
            type="range" 
            min={1} 
            max={50} 
            value={acres} 
            onChange={(e) => setAcres(Number(e.target.value))}
            className="w-full accent-lime-500"
          />
        </div>

        <div className="p-4 bg-lime-50 dark:bg-lime-900/10 rounded-xl border border-lime-200 dark:border-lime-800">
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
            Percentage of Residue to Sell: <span className="text-lime-600 font-bold">{sellPercentage}%</span>
          </label>
          <input 
            type="range" 
            min={0} 
            max={100} 
            step={5}
            value={sellPercentage} 
            onChange={(e) => setSellPercentage(Number(e.target.value))}
            className="w-full accent-lime-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span className="w-1/3 text-left">Leave all on field<br/>(Best Soil)</span>
            <span className="w-1/3 text-center">Balance</span>
            <span className="w-1/3 text-right">Sell everything<br/>(High Fertilizer Cost)</span>
          </div>
        </div>

        {/* Trade-off Visualizer */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Gross Income</p>
            <p className="text-2xl font-black text-green-600">₹{Math.round(grossIncome).toLocaleString()}</p>
            <p className="text-[10px] text-gray-400 mt-1">From selling {soldBiomass.toFixed(1)}t</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Fertilizer Cost</p>
            <p className="text-2xl font-black text-red-500">-₹{Math.round(fertilizerCost).toLocaleString()}</p>
            <p className="text-[10px] text-gray-400 mt-1">To replace lost nutrients</p>
          </div>
        </div>

        <div className={`p-5 rounded-2xl text-center border-2 ${sellPercentage > 80 ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800' : 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'}`}>
          <p className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-1">True Net Profit</p>
          <p className={`text-4xl font-black ${sellPercentage > 80 ? 'text-orange-600' : 'text-green-600'}`}>
            ₹{Math.round(netProfit).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {sellPercentage > 80 
              ? "⚠️ Selling too much harms long-term profitability. Try reducing to 70%."
              : "✅ Good balance between immediate income and soil preservation."}
          </p>
        </div>

      </div>
    </div>
  );
};

export default SoilOptimizer;
