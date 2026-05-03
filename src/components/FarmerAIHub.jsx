import React, { useState } from 'react';
import { FaCamera, FaTractor, FaCloudSunRain, FaSeedling, FaBrain } from 'react-icons/fa';
import QualityAnalyzer from './ml/QualityAnalyzer';
import EquipmentCluster from './ml/EquipmentCluster';
import SpoilageRisk from './ml/SpoilageRisk';
import SoilOptimizer from './ml/SoilOptimizer';

const TABS = [
  {
    id: 'quality',
    label: 'AI Quality Analyzer',
    icon: <FaCamera />,
    color: 'blue',
    description: 'Use your camera to grade biomass quality instantly.',
    component: <QualityAnalyzer />,
  },
  {
    id: 'baler',
    label: 'Uber for Balers',
    icon: <FaTractor />,
    color: 'orange',
    description: 'Group with nearby farmers to share equipment costs.',
    component: <EquipmentCluster />,
  },
  {
    id: 'spoilage',
    label: 'Spoilage Risk',
    icon: <FaCloudSunRain />,
    color: 'cyan',
    description: '7-day weather risk forecast for your harvest.',
    component: <SpoilageRisk />,
  },
  {
    id: 'soil',
    label: 'Soil Health',
    icon: <FaSeedling />,
    color: 'lime',
    description: 'Optimize profits vs fertilizer replacement costs.',
    component: <SoilOptimizer />,
  },
];

const COLOR_MAP = {
  blue:   { active: 'bg-blue-600 text-white shadow-blue-200',  hover: 'hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700',  icon: 'text-blue-500',  border: 'border-blue-500' },
  orange: { active: 'bg-orange-500 text-white shadow-orange-200', hover: 'hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600', icon: 'text-orange-500', border: 'border-orange-500' },
  cyan:   { active: 'bg-cyan-600 text-white shadow-cyan-200', hover: 'hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:text-cyan-700', icon: 'text-cyan-500',  border: 'border-cyan-500' },
  lime:   { active: 'bg-lime-600 text-white shadow-lime-200', hover: 'hover:bg-lime-50 dark:hover:bg-lime-900/20 hover:text-lime-700', icon: 'text-lime-500',  border: 'border-lime-500' },
};

const FarmerAIHub = () => {
  const [activeTab, setActiveTab] = useState('quality');
  const active = TABS.find(t => t.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-24 pb-16 px-4 transition-colors duration-200">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10" data-aos="fade-down">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold px-4 py-2 rounded-full mb-4 shadow-sm border border-blue-200 dark:border-blue-800">
            <FaBrain className="text-sm" /> Smart Farming Tools
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-lime-500 mb-4">
            Farmer AI Suite
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base max-w-2xl mx-auto leading-relaxed">
            State-of-the-art Machine Learning tools built exclusively for farmers.
            Use Computer Vision, Clustering, and Predictive AI to protect your crops, save money, and boost profits.
          </p>
        </div>

        {/* Desktop Layout: Sidebar + Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Navigation Sidebar */}
          <div className="lg:w-1/3 flex flex-col gap-3" data-aos="fade-right">
            {TABS.map(tab => {
              const c = COLOR_MAP[tab.color];
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all duration-300 shadow-sm flex items-start gap-4 ${
                    isActive
                      ? `${c.active} border-transparent shadow-xl transform scale-[1.02]`
                      : `bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 ${c.hover}`
                  }`}
                >
                  <div className={`text-3xl mt-1 ${isActive ? 'text-white' : c.icon}`}>{tab.icon}</div>
                  <div>
                    <p className={`font-bold text-lg mb-1 ${isActive ? 'text-white' : 'text-gray-800 dark:text-white'}`}>
                      {tab.label}
                    </p>
                    <p className={`text-sm leading-relaxed ${isActive ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
                      {tab.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Tab Content Area */}
          <div className="lg:w-2/3" data-aos="fade-left">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl border border-gray-100 dark:border-gray-700 shadow-2xl p-6 sm:p-8 h-full">
              {active?.component}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FarmerAIHub;
