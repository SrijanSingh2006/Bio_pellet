import React, { useState } from "react";
import axios from "axios";
import { FaSeedling, FaTractor, FaCloudSunRain, FaWallet, FaTimes, FaCheckCircle } from "react-icons/fa";

const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Gujarat",
  "Haryana", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu",
  "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const CROPS = [
  "Rice / Paddy Straw", "Wheat Straw", "Sugarcane Bagasse", "Cotton Stalks",
  "Maize Cobs", "Groundnut Shells", "Mustard Stalks", "Other"
];

const FeatureCard = ({ icon, title, description, color }) => (
  <div className="relative group p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden cursor-pointer border border-gray-100 dark:border-gray-700 transform hover:-translate-y-2 transition-all duration-300">
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-10 rounded-bl-full transition-transform duration-500 group-hover:scale-110`}></div>
    <div className={`inline-flex p-4 rounded-2xl text-white bg-gradient-to-br ${color} shadow-lg mb-6`}>
      <span className="text-2xl">{icon}</span>
    </div>
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-teal-400 transition-colors">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
  </div>
);

const FarmerFeatures = () => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', state: '', village: '', cropType: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await axios.post('http://localhost:5005/api/farmers', form);
      setSuccess(true);
      setForm({ name: '', phone: '', state: '', village: '', cropType: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => { setShowModal(false); setSuccess(false); setError(''); };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-down">
          <h2 className="text-base text-green-500 font-semibold tracking-wide uppercase">Empowering Agriculture</h2>
          <p className="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Farmer-Centric <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-400">Features</span>
          </p>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
            Dedicated tools directly supporting our farmers to convert agricultural waste into valuable bio-pellets seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16" data-aos="fade-up">
          <FeatureCard
            icon={<FaSeedling />} title="Biomass Collection Scheduling"
            description="Easily schedule collection of agricultural residue right from your farm. Avoid stubble burning and turn crop waste into an additional source of income."
            color="from-green-400 to-green-600"
          />
          <FeatureCard
            icon={<FaWallet />} title="Instant Payment Integration"
            description="Receive immediate settlements for your biomass directly in your bank account or digital wallet. Transparent pricing based on weight and moisture content."
            color="from-teal-400 to-teal-600"
          />
          <FeatureCard
            icon={<FaTractor />} title="Equipment Rental Subsidies"
            description="Access our network of subsidized farming equipment to help harvest and bundle biomass efficiently before our pickup teams arrive."
            color="from-emerald-400 to-emerald-600"
          />
          <FeatureCard
            icon={<FaCloudSunRain />} title="Weather Insights & Planning"
            description="Get localized weather reports to optimally plan harvesting and ensure your biomass remains dry, giving you the best possible rates."
            color="from-cyan-400 to-cyan-600"
          />
        </div>

        <div className="mt-4 bg-gradient-to-r from-green-600 to-teal-500 rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden" data-aos="zoom-in">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-black opacity-10"></div>
          <h2 className="text-3xl font-bold text-white mb-4 relative z-10">Ready to join our Farmer Network?</h2>
          <p className="text-green-50 text-lg mb-8 max-w-2xl mx-auto relative z-10">
            Get registered today and start earning from what you used to discard. Join thousands of farmers contributing to a greener future.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="relative z-10 bg-white text-green-600 font-bold py-3 px-10 rounded-full shadow-lg hover:bg-gray-50 hover:scale-105 transition-all duration-300"
          >
            Register as a Farmer
          </button>
        </div>
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md relative p-8">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>

            {success ? (
              <div className="text-center py-8">
                <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Registration Successful!</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Welcome to the EcoShield Farmer Network! Our team will contact you shortly.
                </p>
                <button
                  onClick={closeModal}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">🌱 Farmer Registration</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Fill in your details to join our network.</p>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-4 text-sm">
                    ⚠️ {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Full Name *</label>
                    <input
                      name="name" value={form.name} onChange={handleChange} required
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Phone Number *</label>
                    <input
                      name="phone" value={form.phone} onChange={handleChange} required
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">State *</label>
                    <select
                      name="state" value={form.state} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      <option value="">-- Select your state --</option>
                      {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Village / District *</label>
                    <input
                      name="village" value={form.village} onChange={handleChange} required
                      placeholder="e.g. Alipur, Ludhiana"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Main Crop Type *</label>
                    <select
                      name="cropType" value={form.cropType} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      <option value="">-- Select crop type --</option>
                      {CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Registering...
                      </>
                    ) : 'Submit Registration'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerFeatures;
