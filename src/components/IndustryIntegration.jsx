import React from "react";
import { FaIndustry, FaHandshake, FaGlobe, FaCogs } from "react-icons/fa";

const IntegrationCard = ({ title, desc, icon }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300">
    <div className="p-8">
      <div className="w-16 h-16 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-6 text-3xl">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
        {desc}
      </p>
      <a href="#" className="inline-flex items-center text-teal-600 dark:text-teal-400 font-semibold hover:text-teal-500 transition-colors">
        Learn more
        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
      </a>
    </div>
  </div>
);

const IndustryIntegration = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 pb-16 transition-colors duration-200">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-800 py-16 sm:py-24 mb-16">
        <div className="absolute inset-0">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gray-50 dark:bg-gray-800 rounded-r-full max-w-7xl mx-auto"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" data-aos="zoom-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
            <span className="block">Seamless B2B</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-green-400">Industry Integration</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
            Powering industries with sustainable bio-pellets. We provide API access, bulk ordering contracts, and compliance tracking for green energy adopters.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10" data-aos="fade-up">
          <IntegrationCard 
            icon={<FaCogs />} 
            title="Automated Supply Chain APIs" 
            desc="Integrate our bio-pellet supply tracking directly into your ERP systems. Real-time updates on inventory, shipments, and quality metrics." 
          />
          <IntegrationCard 
            icon={<FaHandshake />} 
            title="Corporate Sustainability Contracts" 
            desc="Long-term procurement agreements tailored to reduce your carbon footprint, complete with dedicated account managers and fixed-rate pricing." 
          />
          <IntegrationCard 
            icon={<FaIndustry />} 
            title="Boiler Retrofit Partnerships" 
            desc="Collaborating with top engineering firms to help industries transition from coal to bio-pellets seamlessly with subsidized retrofitting." 
          />
          <IntegrationCard 
            icon={<FaGlobe />} 
            title="Carbon Credit Tracking" 
            desc="Verified carbon offset reports generated automatically for every ton of bio-pellets consumed, helping you achieve your Net-Zero goals." 
          />
        </div>

        {/* Call to Action */}
        <div className="mt-20 bg-gray-900 dark:bg-black rounded-3xl p-8 sm:p-12 text-center" data-aos="fade-up">
          <h2 className="text-3xl font-extrabold text-white mb-4">Partner With Us For A Greener Tomorrow</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Contact our B2B integration experts and discover how bio-pellets can lower your energy costs and carbon emissions simultaneously.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-lg transition-colors">
              Request API Access
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-gray-600 hover:border-gray-400 text-white font-bold rounded-lg transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryIntegration;
