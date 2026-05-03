import React, { useState, useEffect } from 'react';

// --- Simple K-Means implementation in JS ---
const kMeans = (data, k, maxIterations = 10) => {
  // 1. Initialize random centroids
  let centroids = data.sort(() => 0.5 - Math.random()).slice(0, k).map(d => ({ ...d }));
  let clusters = new Array(k).fill(0).map(() => []);

  for (let iter = 0; iter < maxIterations; iter++) {
    clusters = new Array(k).fill(0).map(() => []);
    
    // 2. Assign points to nearest centroid
    data.forEach(point => {
      let minDist = Infinity;
      let clusterIndex = 0;
      centroids.forEach((centroid, i) => {
        const dist = Math.sqrt(Math.pow(point.x - centroid.x, 2) + Math.pow(point.y - centroid.y, 2));
        if (dist < minDist) {
          minDist = dist;
          clusterIndex = i;
        }
      });
      clusters[clusterIndex].push(point);
    });

    // 3. Recalculate centroids
    centroids = clusters.map((cluster) => {
      if (cluster.length === 0) return { x: Math.random() * 100, y: Math.random() * 100 }; // fallback
      const sum = cluster.reduce((acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y }), { x: 0, y: 0 });
      return { x: sum.x / cluster.length, y: sum.y / cluster.length };
    });
  }
  return { clusters, centroids };
};

// Generate synthetic farmer locations
const generateFarmers = (count) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * 100, // 0 to 100 representing relative GPS
    y: Math.random() * 100,
    acres: Math.floor(Math.random() * 20) + 5
  }));
};

const COLORS = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
const TEXT_COLORS = ['text-red-500', 'text-blue-500', 'text-green-500', 'text-yellow-500', 'text-purple-500'];

const EquipmentCluster = () => {
  const [farmers, setFarmers] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [centroids, setCentroids] = useState([]);
  const [k, setK] = useState(3);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setFarmers(generateFarmers(40));
  }, []);

  const runClustering = () => {
    setRunning(true);
    setTimeout(() => {
      const result = kMeans(farmers, k);
      setClusters(result.clusters);
      setCentroids(result.centroids);
      setRunning(false);
    }, 500); // UI delay
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-xl flex items-center justify-center text-2xl">
          🚜
        </div>
        <div>
          <h3 className="text-xl font-bold dark:text-white">"Uber for Balers"</h3>
          <p className="text-xs text-gray-500">Unsupervised ML: K-Means Clustering</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
        Baling machines are expensive. This algorithm groups nearby farmers who need equipment at the same time into "Sharing Hubs", cutting rental and transport costs by up to 80%.
      </p>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
          Number of Balers Available: <span className="text-orange-600 font-bold">{k}</span>
        </label>
        <input 
          type="range" 
          min={2} 
          max={5} 
          value={k} 
          onChange={(e) => setK(Number(e.target.value))}
          className="w-full accent-orange-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>2 Machines</span>
          <span>5 Machines</span>
        </div>
      </div>

      <button
        onClick={runClustering}
        disabled={running}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mb-8"
      >
        {running ? (
          <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Optimizing Routes...</>
        ) : (
          '🗺️ Group Farmers & Route Equipment'
        )}
      </button>

      {/* Visual Map */}
      <div className="relative w-full aspect-square bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 overflow-hidden shadow-inner">
        {clusters.length === 0 ? (
          // Unclustered state
          farmers.map(f => (
            <div 
              key={f.id}
              className="absolute w-3 h-3 bg-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-sm"
              style={{ left: `${f.x}%`, top: `${f.y}%` }}
              title={`${f.acres} acres`}
            />
          ))
        ) : (
          // Clustered state
          <>
            {clusters.map((cluster, i) => (
              cluster.map(f => (
                <div 
                  key={f.id}
                  className={`absolute w-3 h-3 ${COLORS[i]} rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-sm transition-all duration-1000`}
                  style={{ left: `${f.x}%`, top: `${f.y}%` }}
                  title={`Cluster ${i+1}`}
                />
              ))
            ))}
            {/* Centroids (Baler Hubs) */}
            {centroids.map((c, i) => (
              <div
                key={`c-${i}`}
                className={`absolute w-8 h-8 flex items-center justify-center bg-white border-4 border-gray-800 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-xl z-10`}
                style={{ left: `${c.x}%`, top: `${c.y}%` }}
              >
                <span className="text-xs">🚜</span>
              </div>
            ))}
          </>
        )}
      </div>

      {clusters.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          {clusters.map((c, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-600">
              <p className={`font-bold text-sm ${TEXT_COLORS[i]}`}>Group {i + 1}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{c.length} farmers</p>
              <p className="text-xs font-semibold mt-1">Total: {c.reduce((sum, f) => sum + f.acres, 0)} acres</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EquipmentCluster;
