import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { plants } from '../data/plants'
import { FaMapMarkerAlt, FaStar, FaIndustry, FaShieldAlt, FaLock, FaPhoneAlt, FaEnvelope, FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

// Fix leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const PlantDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const plant = plants.find(p => p.id === parseInt(id))
  const [paid, setPaid] = useState(false)
  const [paying, setPaying] = useState(false)

  if (!plant) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-400 mb-4">Plant not found.</p>
        <button onClick={() => navigate('/search')} className="btn-glow text-white px-6 py-2 rounded-full">Back to Search</button>
      </div>
    </div>
  )

  const handlePayment = () => {
    setPaying(true)
    if (window.Razorpay) {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_placeholder',
        amount: 4900, // ₹49 in paise
        currency: 'INR',
        name: 'EcoShield',
        description: `Contact details for ${plant.name}`,
        handler: () => {
          setPaid(true)
          setPaying(false)
        },
        prefill: { name: '', email: '', contact: '' },
        theme: { color: '#16a34a' },
      }
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', () => setPaying(false))
      rzp.open()
    } else {
      // Demo mode - just unlock after 1.5s
      setTimeout(() => { setPaid(true); setPaying(false) }, 1500)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors mb-6 group">
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Results
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header card */}
            <div className="glass rounded-2xl p-8" data-aos="fade-up">
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="badge">{plant.type}</span>
                {plant.certifications.map(c => (
                  <span key={c} className="text-xs bg-blue-900/20 text-blue-400 border border-blue-800/30 rounded-full px-3 py-0.5">{c}</span>
                ))}
              </div>
              <h1 className="text-3xl font-black text-white mb-3">{plant.name}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-5">
                <span className="flex items-center gap-1.5"><FaMapMarkerAlt className="text-green-500" />{plant.address}</span>
                <span className="flex items-center gap-1.5"><FaStar className="text-yellow-400" />{plant.rating} ({plant.reviews} reviews)</span>
                <span className="flex items-center gap-1.5"><FaIndustry className="text-green-500" />Capacity: {plant.capacity}</span>
              </div>
              <p className="text-gray-300 leading-relaxed">{plant.description}</p>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" data-aos="fade-up">
              {[
                { label: 'Established', value: plant.established, color: 'text-blue-400' },
                { label: 'Monthly Capacity', value: plant.capacity, color: 'text-green-400' },
                { label: 'Customer Rating', value: `${plant.rating} / 5`, color: 'text-yellow-400' },
              ].map(item => (
                <div key={item.label} className="glass rounded-xl p-5 text-center">
                  <div className={`text-2xl font-bold ${item.color} mb-1`}>{item.value}</div>
                  <div className="text-gray-500 text-sm">{item.label}</div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="glass rounded-2xl overflow-hidden" data-aos="fade-up">
              <div className="p-4 border-b border-white/5">
                <h3 className="text-white font-semibold">Location</h3>
              </div>
              <div style={{ height: '280px' }}>
                <MapContainer center={plant.coordinates} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com">CARTO</a>'
                  />
                  <Marker position={plant.coordinates}>
                    <Popup>{plant.name}<br />{plant.city}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>

          {/* Sidebar - Contact */}
          <div className="space-y-6">
            {/* Contact unlock card */}
            <div className="glass rounded-2xl overflow-hidden sticky top-24" data-aos="fade-left">
              <div className="p-6 border-b border-white/5">
                <h3 className="text-white font-bold text-lg mb-1">Contact Information</h3>
                <p className="text-gray-400 text-sm">Pay ₹49 to unlock full contact details</p>
              </div>

              <div className="p-6 space-y-4">
                {/* Phone */}
                <div className="relative">
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                    <FaPhoneAlt className="text-green-500" />
                    {paid ? (
                      <div>
                        <div className="text-xs text-gray-500 mb-0.5">Phone</div>
                        <div className="text-white font-semibold">{plant.contact}</div>
                      </div>
                    ) : (
                      <div className="locked-overlay absolute inset-0 rounded-xl flex items-center justify-center">
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <FaLock className="text-green-700" />
                          <span className="font-mono blur-sm select-none">+91 XXXXX XXXXX</span>
                        </div>
                      </div>
                    )}
                    {!paid && <div className="ml-auto font-mono text-gray-600 blur-sm">+91 XXXXX XXXXX</div>}
                  </div>
                </div>

                {/* Email */}
                <div className="relative">
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                    <FaEnvelope className="text-green-500" />
                    {paid ? (
                      <div>
                        <div className="text-xs text-gray-500 mb-0.5">Email</div>
                        <div className="text-white font-semibold">{plant.email}</div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-600 font-mono blur-sm select-none">
                        contact@{plant.city.toLowerCase()}.com
                      </div>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                  <FaMapMarkerAlt className="text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Address</div>
                    <div className="text-gray-300 text-sm">{plant.address}</div>
                  </div>
                </div>

                {paid ? (
                  <div className="flex items-center gap-2 text-green-400 bg-green-900/20 border border-green-800/40 rounded-xl p-4">
                    <FaCheckCircle />
                    <span className="text-sm font-medium">Contact details unlocked!</span>
                  </div>
                ) : (
                  <button
                    onClick={handlePayment}
                    disabled={paying}
                    className="w-full btn-glow text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {paying ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
                    ) : (
                      <><FaLock /> Unlock for ₹49</>
                    )}
                  </button>
                )}

                <p className="text-center text-xs text-gray-600">Secure payment via Razorpay · One-time fee</p>
              </div>
            </div>

            {/* Trust badges */}
            <div className="glass rounded-2xl p-5" data-aos="fade-left">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2"><FaShieldAlt className="text-green-500" /> Verified Plant</h4>
              <ul className="space-y-2">
                {plant.certifications.map(cert => (
                  <li key={cert} className="flex items-center gap-2 text-sm text-gray-300">
                    <FaCheckCircle className="text-green-500 text-xs shrink-0" /> {cert}
                  </li>
                ))}
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <FaCheckCircle className="text-green-500 text-xs shrink-0" /> EcoShield Verified
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlantDetail
