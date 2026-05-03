import React, { useState } from 'react';
import { FaSatellite, FaCogs, FaChartLine, FaServer, FaLink } from 'react-icons/fa';
import SatelliteYield from './ml/SatelliteYield';
import PredictiveMaintenance from './ml/PredictiveMaintenance';
import PriceForecaster from './ml/PriceForecaster';
import CarbonLedger from './CarbonLedger';

const TABS = [
  {
    id: 'satellite',
    label: 'Satellite Yield Estimator',
    icon: <FaSatellite />,
    color: 'green',
    description: 'Predict exact farm biomass yield using simulated Satellite NDVI data.',
    component: <SatelliteYield />,
  },
  {
    id: 'maintenance',
    label: 'Predictive Maintenance',
    icon: <FaCogs />,
    color: 'red',
    description: 'Detect anomalies in pelletizer machines before they break.',
    component: <PredictiveMaintenance />,
  },
  {
    id: 'forecaster',
    label: 'Market Price Forecast',
    icon: <FaChartLine />,
    color: 'purple',
    description: 'Predict dynamic biomass prices using time-series regression.',
    component: <PriceForecaster />,
  },
  {
    id: 'ledger',
    label: 'Carbon Smart Ledger',
    icon: <FaLink />,
    color: 'emerald',
    description: 'Immutable simulated blockchain tracking verified CO2 offsets.',
    component: <CarbonLedger />,
  },
];

const COLOR_MAP = {
  green:  { active: 'bg-green-600 text-white shadow-green-200',  hover: 'hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700',  icon: 'text-green-500',  border: 'border-green-500' },
  red:    { active: 'bg-red-600 text-white shadow-red-200',    hover: 'hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700',    icon: 'text-red-500',    border: 'border-red-500' },
  purple: { active: 'bg-purple-600 text-white shadow-purple-200', hover: 'hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700', icon: 'text-purple-500', border: 'border-purple-500' },
  emerald: { active: 'bg-emerald-600 text-white shadow-emerald-200', hover: 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700', icon: 'text-emerald-500', border: 'border-emerald-500' },
};

const EnterpriseMLHub = () => {
  const [activeTab, setActiveTab] = useState('satellite');
  const active = TABS.find(t => t.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-gray-100 pt-24 pb-16 px-4 transition-colors duration-200">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10" data-aos="fade-down">
          <div className="inline-flex items-center gap-2 bg-blue-900/50 text-blue-400 text-xs font-semibold px-4 py-2 rounded-full mb-4 shadow-sm border border-blue-800">
            <FaServer className="text-sm" /> Connected to Enterprise Backend
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 mb-4">
            Enterprise ML Architecture
          </h1>
          <p className="text-gray-400 text-base max-w-2xl mx-auto leading-relaxed">
            These models are not running in your browser. They are served via a dedicated Python backend using industry-standard libraries like <b>scikit-learn</b> and <b>pandas</b>, solving heavy-duty industrial problems.
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
                      : `bg-gray-800 border-gray-700 text-gray-300 ${c.hover}`
                  }`}
                >
                  <div className={`text-3xl mt-1 ${isActive ? 'text-white' : c.icon}`}>{tab.icon}</div>
                  <div>
                    <p className={`font-bold text-lg mb-1 ${isActive ? 'text-white' : 'text-gray-100'}`}>
                      {tab.label}
                    </p>
                    <p className={`text-sm leading-relaxed ${isActive ? 'text-white/90' : 'text-gray-400'}`}>
                      {tab.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Tab Content Area */}
          <div className="lg:w-2/3" data-aos="fade-left">
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-2xl p-6 sm:p-8 h-full text-gray-800 dark:text-gray-100">
              {active?.component}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EnterpriseMLHub;
