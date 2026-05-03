import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCogs, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const PredictiveMaintenance = () => {
  // Simulate live sensor readings
  const [sensors, setSensors] = useState({
    vibration: 50,
    temperature: 70,
    current: 120
  });
  
  const [result, setResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrediction = async (currentSensors) => {
    try {
      const res = await axios.post('http://localhost:5006/api/ml/predict-maintenance', currentSensors);
      if (res.data.success) {
        setResult(res.data);
      } else {
        setError(res.data.error);
      }
    } catch (err) {
      setError("Failed to connect to Python ML Backend.");
    }
  };

  // Simulates a sudden anomaly spike (machine jam)
  const triggerAnomaly = () => {
    setSensors({
      vibration: 85, // Huge spike
      temperature: 95, // Overheating
      current: 160 // Motor struggling
    });
  };

  const resetSensors = () => {
    setSensors({
      vibration: 50,
      temperature: 70,
      current: 120
    });
  };

  useEffect(() => {
    fetchPrediction(sensors);
  }, [sensors]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl flex items-center justify-center text-2xl">
          <FaCogs />
        </div>
        <div>
          <h3 className="text-xl font-bold dark:text-white">Predictive Maintenance</h3>
          <p className="text-xs text-gray-500">Isolation Forest Anomaly Detection</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
        Simulates live IoT sensor data from a bio-pelletizing machine. Our <b>Isolation Forest</b> model (Unsupervised ML) detects multidimensional anomalies to predict machine breakdown <i>before</i> it happens.
      </p>

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-600">
            <p className="text-xs text-gray-500 uppercase font-bold">Vibration (Hz)</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{sensors.vibration}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-600">
            <p className="text-xs text-gray-500 uppercase font-bold">Temp (°C)</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{sensors.temperature}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-600">
            <p className="text-xs text-gray-500 uppercase font-bold">Current (A)</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{sensors.current}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={resetSensors}
            className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 rounded-xl transition-colors text-sm"
          >
            Reset to Normal
          </button>
          <button 
            onClick={triggerAnomaly}
            className="flex-1 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/40 text-red-700 dark:text-red-400 font-bold py-2 rounded-xl transition-colors text-sm border border-red-200 dark:border-red-800 flex items-center justify-center gap-2"
          >
            <FaExclamationTriangle /> Trigger Anomaly
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {result && (
        <div className={`mt-4 p-5 rounded-xl border ${result.anomaly_detected ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'}`}>
          <div className="flex items-center gap-3 mb-2">
            {result.anomaly_detected ? (
              <FaExclamationTriangle className="text-red-500 text-2xl" />
            ) : (
              <FaCheckCircle className="text-green-500 text-2xl" />
            )}
            <h4 className={`font-bold text-lg ${result.anomaly_detected ? 'text-red-600' : 'text-green-600'}`}>
              {result.anomaly_detected ? 'CRITICAL ANOMALY DETECTED' : 'System Operating Normally'}
            </h4>
          </div>
          
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {result.anomaly_detected 
              ? 'Isolation Forest model flagged severe deviation from nominal operating parameters. Immediate maintenance required.' 
              : 'All sensor readings match the expected baseline distribution.'}
          </p>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full transition-all duration-500 ${result.risk_score > 70 ? 'bg-red-500' : result.risk_score > 30 ? 'bg-yellow-500' : 'bg-green-500'}`} 
              style={{ width: `${result.risk_score}%` }}
            ></div>
          </div>
          <p className="text-xs text-right mt-1 text-gray-500 font-medium">Risk Score: {result.risk_score}%</p>
        </div>
      )}
    </div>
  );
};

export default PredictiveMaintenance;
