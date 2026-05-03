import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { getDistance } from 'geolib';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import plantsData from '../data/plantsData.json';

// Fix Leaflet default marker icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const plantIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const availableStates = [
  "Assam", "Bihar", "Chhattisgarh", "Delhi", "Gujarat", "Karnataka",
  "Maharashtra", "Odisha", "Rajasthan", "Tamil Nadu", "Telangana"
];

// Component to recenter map when coords change
function MapRecenterer({ coords }) {
  const map = useMap();
  if (coords) {
    map.setView([coords.latitude, coords.longitude], 11);
  }
  return null;
}

const Locator = () => {
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pincode, setPincode] = useState('');
  const [userCoords, setUserCoords] = useState(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [mapCenter, setMapCenter] = useState({ latitude: 20.5937, longitude: 78.9629 });

  const MAX_RADIUS_METERS = 30000;

  const locatePlants = (userLocation) => {
    setUserCoords(userLocation);
    setMapCenter(userLocation);
    const nearby = plantsData
      .map((plant) => ({
        ...plant,
        distance: getDistance(userLocation, { latitude: plant.latitude, longitude: plant.longitude }),
      }))
      .filter((p) => p.distance <= MAX_RADIUS_METERS)
      .sort((a, b) => a.distance - b.distance);
    setFilteredPlants(nearby);
    setLoading(false);
  };

  const handleUseCurrentLocation = () => {
    setLoading(true);
    setError('');
    setFilteredPlants([]);
    navigator.geolocation.getCurrentPosition(
      (pos) => locatePlants({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => { setError('Unable to retrieve your location. Please allow location access.'); setLoading(false); }
    );
  };

  const handleUsePincode = async () => {
    if (!pincode || pincode.length !== 6) { setError('Please enter a valid 6-digit Indian pincode.'); return; }
    setLoading(true);
    setError('');
    setFilteredPlants([]);
    try {
      const res = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { postalcode: pincode, country: 'India', format: 'json', limit: 1 }
      });
      const result = res.data[0];
      if (result) {
        locatePlants({ latitude: parseFloat(result.lat), longitude: parseFloat(result.lon) });
      } else {
        setError('No location found for this pincode. Please try a different one.');
        setLoading(false);
      }
    } catch {
      setError('Error fetching location. Service may be temporarily unavailable.');
      setLoading(false);
    }
  };

  const handleStateSelect = (selectedState) => {
    if (!selectedState) { setFilteredPlants([]); setUserCoords(null); return; }
    setLoading(true);
    setError('');
    setPincode('');
    const statePlants = plantsData.filter((p) =>
      (p.state && p.state.toLowerCase() === selectedState.toLowerCase()) ||
      (p.address && p.address.toLowerCase().includes(selectedState.toLowerCase()))
    );
    if (statePlants.length > 0) {
      const center = { latitude: statePlants[0].latitude, longitude: statePlants[0].longitude };
      setFilteredPlants(statePlants.map((p) => ({ ...p, distance: null })));
      setUserCoords(null);
      setMapCenter(center);
    } else {
      setFilteredPlants([]);
      setError(`No plants found for ${selectedState}.`);
    }
    setLoading(false);
  };

  const handleRazorpayPayment = (plantName) => {
    if (paymentComplete) {
      alert(`✅ Access already unlocked! You can now contact ${plantName}.`);
      return;
    }
    const options = {
      key: "rzp_test_RpcGXevGHzUVrf",
      amount: 100,
      currency: "INR",
      name: "Bio Pellet Locator",
      description: `Unlock contact details for ${plantName}`,
      handler: function () {
        alert("✅ Payment successful! Plant contacts are now unlocked.");
        setPaymentComplete(true);
      },
      prefill: { name: "User", email: "user@example.com", contact: "9999999999" },
      theme: { color: "#16a34a" },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 pt-6 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-green-700 dark:text-green-400 mb-2">
            🌿 Bio Pellet Plant Locator
          </h1>
          <p className="text-gray-500 dark:text-gray-300 text-base max-w-xl mx-auto">
            Find verified bio-pellet manufacturing plants near you using pincode, GPS, or state selection.
          </p>
        </div>

        {/* Search Controls Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-100 dark:border-gray-700">
          {/* GPS Button */}
          <button
            onClick={handleUseCurrentLocation}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl mb-5 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            📍 Use My Current Location
          </button>

          {/* Pincode Row */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <input
              type="text"
              placeholder="Enter 6-digit Pincode"
              value={pincode}
              maxLength={6}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => e.key === 'Enter' && handleUsePincode()}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 bg-white dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleUsePincode}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            >
              🔍 Search
            </button>
          </div>

          {/* State Selector */}
          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Or browse by state:</p>
            <select
              onChange={(e) => handleStateSelect(e.target.value)}
              className="w-full sm:w-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
            >
              <option value="">-- Select a State --</option>
              {availableStates.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-4 text-green-600 dark:text-green-400 font-medium">Searching nearby plants...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 rounded-xl px-5 py-4 mb-6 font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Leaflet Map */}
        {(userCoords || filteredPlants.length > 0) && (
          <div className="rounded-2xl overflow-hidden shadow-xl mb-8 border border-gray-200 dark:border-gray-700" style={{ height: '400px' }}>
            <MapContainer
              center={[mapCenter.latitude, mapCenter.longitude]}
              zoom={11}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapRecenterer coords={mapCenter} />
              {userCoords && (
                <Marker position={[userCoords.latitude, userCoords.longitude]} icon={userIcon}>
                  <Popup><strong>📍 Your Location</strong></Popup>
                </Marker>
              )}
              {filteredPlants.map((plant, idx) => (
                <Marker
                  key={idx}
                  position={[plant.latitude, plant.longitude]}
                  icon={plantIcon}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong className="text-green-700">🏭 {plant.name}</strong><br />
                      {plant.address}, {plant.city || ''}, {plant.state || ''}<br />
                      {plant.distance != null && <span>📏 {(plant.distance / 1000).toFixed(2)} km away</span>}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}

        {/* Results Count */}
        {filteredPlants.length > 0 && !loading && (
          <p className="text-green-700 dark:text-green-400 font-semibold mb-4">
            ✅ Found {filteredPlants.length} plant{filteredPlants.length > 1 ? 's' : ''}
            {userCoords ? ' within 30 km of your location' : ''}:
          </p>
        )}

        {/* Plant Cards */}
        <div className="space-y-4">
          {filteredPlants.length > 0 ? (
            filteredPlants.map((plant, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 dark:border-gray-700 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">🏭</span>
                    <h4 className="text-lg font-bold text-gray-800 dark:text-white">{plant.name}</h4>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {plant.address}, {plant.city || ''}, {plant.state || ''}
                    {(plant.pincode || plant.pin_code) && ` — ${plant.pincode || plant.pin_code}`}
                  </p>
                  {plant.distance != null && (
                    <span className="inline-block mt-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold px-3 py-1 rounded-full">
                      📏 {(plant.distance / 1000).toFixed(2)} km away
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleRazorpayPayment(plant.name)}
                  className={`shrink-0 px-5 py-2.5 rounded-xl font-semibold text-white transition-all duration-200 shadow-md hover:shadow-lg ${
                    paymentComplete
                      ? 'bg-teal-500 hover:bg-teal-600'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {paymentComplete ? '📞 Contact Plant' : '🔒 Pay ₹1 to Connect'}
                </button>
              </div>
            ))
          ) : (
            !loading && !error && (
              <div className="text-center py-16 text-gray-400 dark:text-gray-500">
                <div className="text-6xl mb-4">🗺️</div>
                <p className="text-lg font-medium">Search by pincode, GPS, or state to find nearby plants.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Locator;