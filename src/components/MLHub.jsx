import React, { useState } from 'react';
import { FaBrain, FaSeedling, FaMoneyBillWave, FaRobot, FaNetworkWired, FaBolt, FaLock } from 'react-icons/fa';
import BiomassPredictor from './ml/BiomassPredictor';
import PriceEstimator from './ml/PriceEstimator';
import PlantRecommender from './ml/PlantRecommender';

const TABS = [
  {
    id: 'biomass',
    label: 'Yield Predictor',
    icon: <FaSeedling />,
    color: 'green',
    description: 'Predict how much biomass your farm can produce',
    component: <BiomassPredictor />,
  },
  {
    id: 'price',
    label: 'Price Estimator',
    icon: <FaMoneyBillWave />,
    color: 'yellow',
    description: 'Get a fair market price estimate for your biomass',
    component: <PriceEstimator />,
  },
  {
    id: 'recommend',
    label: 'Plant Recommender',
    icon: <FaRobot />,
    color: 'purple',
    description: 'AI picks the best bio-pellet plants for your crop & location',
    component: <PlantRecommender />,
  },
];

const COLOR_MAP = {
  green:  { active: 'bg-green-600 text-white shadow-green-200',  hover: 'hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700',  icon: 'text-green-500',  border: 'border-green-500' },
  yellow: { active: 'bg-yellow-500 text-white shadow-yellow-200', hover: 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-600', icon: 'text-yellow-500', border: 'border-yellow-500' },
  purple: { active: 'bg-purple-600 text-white shadow-purple-200', hover: 'hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700', icon: 'text-purple-500',  border: 'border-purple-500' },
};

const MLHub = () => {
  const [activeTab, setActiveTab] = useState('biomass');
  const active = TABS.find(t => t.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-6 pb-16 px-4 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10" data-aos="fade-down">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold px-4 py-2 rounded-full mb-4">
            <FaBrain className="text-sm" /> Powered by TensorFlow.js — runs 100% in your browser
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-teal-400 to-purple-500 mb-3">
            AI & ML Hub
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base max-w-xl mx-auto">
            Three intelligent tools to help farmers and industries make smarter decisions with bio-pellets.
            All models train and run locally — no internet required after first load.
          </p>
        </div>

        {/* Tab Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8" data-aos="fade-up">
          {TABS.map(tab => {
            const c = COLOR_MAP[tab.color];
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 shadow-sm ${
                  isActive
                    ? `${c.active} border-transparent shadow-lg`
                    : `bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 ${c.hover}`
                }`}
              >
                <div className={`text-2xl mb-2 ${isActive ? 'text-white' : c.icon}`}>{tab.icon}</div>
                <p className={`font-bold text-sm mb-1 ${isActive ? 'text-white' : ''}`}>{tab.label}</p>
                <p className={`text-xs leading-relaxed ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                  {tab.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Tab Content */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-6 sm:p-8" data-aos="fade-up">
          {active?.component}
        </div>

        {/* Info Footer */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center" data-aos="fade-up">
          {[
            { icon: <FaNetworkWired className="text-purple-500" />, title: 'Neural Networks', desc: 'Biomass & Price models use TF.js deep learning trained on 500+ synthetic samples' },
            { icon: <FaBolt className="text-yellow-500" />, title: 'Instant Inference', desc: 'Once trained, predictions happen in milliseconds — all in your browser' },
            { icon: <FaLock className="text-green-500" />, title: 'Privacy First', desc: 'Your data never leaves your device — no cloud processing' },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="text-3xl mb-2 flex justify-center">{item.icon}</div>
              <p className="font-bold text-gray-700 dark:text-white text-sm mb-1">{item.title}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MLHub;
