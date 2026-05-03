import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FaFire, FaLeaf, FaServer } from 'react-icons/fa';

// Synthetic Data Generators
const generateFires = () => {
  return Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    lat: 30.9 + (Math.random() * 2 - 1), // Centered around Punjab
    lng: 75.8 + (Math.random() * 2 - 1),
    intensity: Math.random() * 100,
  }));
};

const generateBiomass = () => {
  return Array.from({ length: 60 }).map((_, i) => ({
    id: i,
    lat: 22.9 + (Math.random() * 8 - 4), // Central/North India
    lng: 78.8 + (Math.random() * 8 - 4),
    tonnes: Math.floor(Math.random() * 5000) + 1000,
  }));
};

const FlyToLocation = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 6, { animate: true, duration: 2 });
  }, [lat, lng, map]);
  return null;
};

const CommandCenter = () => {
  const [fires, setFires] = useState([]);
  const [biomass, setBiomass] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLayer, setActiveLayer] = useState('both'); // 'fires', 'biomass', 'both'

  useEffect(() => {
    // Simulate fetching from geospatial backend
    setTimeout(() => {
      setFires(generateFires());
      setBiomass(generateBiomass());
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-white pt-20 flex flex-col">
      {/* Header Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 z-10 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-900/50 text-blue-400 rounded-lg flex items-center justify-center border border-blue-500/30">
            <FaServer />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              GIS COMMAND CENTER
            </h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Live Geospatial Analytics</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex bg-gray-900 rounded-xl p-1 border border-gray-700">
          <button 
            onClick={() => setActiveLayer('both')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeLayer === 'both' ? 'bg-gray-700 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            ALL LAYERS
          </button>
          <button 
            onClick={() => setActiveLayer('fires')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeLayer === 'fires' ? 'bg-red-900/50 text-red-400 shadow-md border border-red-500/30' : 'text-gray-400 hover:text-red-400'}`}
          >
            <FaFire /> NASA FIRMS
          </button>
          <button 
            onClick={() => setActiveLayer('biomass')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeLayer === 'biomass' ? 'bg-green-900/50 text-green-400 shadow-md border border-green-500/30' : 'text-gray-400 hover:text-green-400'}`}
          >
            <FaLeaf /> BIOMASS DENSITY
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 bg-gray-900/80 z-20 flex flex-col items-center justify-center backdrop-blur-sm">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <h2 className="text-blue-400 font-bold tracking-widest animate-pulse">CONNECTING TO SATELLITE...</h2>
          </div>
        )}

        <MapContainer 
          center={[22.5937, 78.9629]} // Center of India
          zoom={5} 
          scrollWheelZoom={true} 
          className="absolute inset-0 z-0"
          style={{ height: '100%', width: '100%', background: '#111827' }}
          zoomControl={false}
        >
          {/* Dark map tiles suitable for command center */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {/* Biomass Density Layer */}
          {(activeLayer === 'both' || activeLayer === 'biomass') && biomass.map(b => (
            <CircleMarker
              key={`bio-${b.id}`}
              center={[b.lat, b.lng]}
              radius={Math.max(10, b.tonnes / 200)}
              fillColor="#22c55e"
              color="#16a34a"
              weight={1}
              opacity={0.3}
              fillOpacity={0.2}
            >
              <Popup className="bg-gray-800 text-white border-gray-700">
                <div className="text-center p-1">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Estimated Yield</p>
                  <p className="text-lg font-black text-green-400">{b.tonnes} t</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* NASA FIRMS Active Fires Layer */}
          {(activeLayer === 'both' || activeLayer === 'fires') && fires.map(f => (
            <CircleMarker
              key={`fire-${f.id}`}
              center={[f.lat, f.lng]}
              radius={f.intensity > 80 ? 8 : 4}
              fillColor="#ef4444"
              color="#b91c1c"
              weight={2}
              opacity={0.8}
              fillOpacity={0.6}
            >
              <Popup className="bg-gray-800 text-white border-gray-700">
                <div className="text-center p-1">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Active Burn Detected</p>
                  <p className="text-lg font-black text-red-500">Intensity: {Math.round(f.intensity)}%</p>
                  <button className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold py-1 px-2 rounded">
                    DISPATCH ALERT
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* Floating Legend / Stats */}
        <div className="absolute bottom-6 right-6 z-[1000] bg-gray-900/90 border border-gray-700 backdrop-blur-md p-4 rounded-xl shadow-2xl pointer-events-auto w-64">
          <h4 className="text-xs text-gray-400 font-bold tracking-widest mb-3 border-b border-gray-700 pb-2">LIVE METRICS</h4>
          
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-red-400 flex items-center gap-2"><FaFire /> Active Burns</span>
            <span className="font-mono text-xl text-white">{fires.length}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-green-400 flex items-center gap-2"><FaLeaf /> Est. Biomass</span>
            <span className="font-mono text-xl text-white">{(biomass.reduce((acc, curr) => acc + curr.tonnes, 0) / 1000).toFixed(1)}k t</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;
