import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch, FaLeaf, FaIndustry, FaMapMarkerAlt, FaShieldAlt, FaBolt, FaRecycle, FaSeedling, FaArrowRight, FaStar } from 'react-icons/fa'
import { plants } from '../data/plants'

const Home = () => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  const stats = [
    { value: '500+', label: 'Registered Plants', icon: FaIndustry },
    { value: '28', label: 'States Covered', icon: FaMapMarkerAlt },
    { value: '12,000+', label: 'MT Monthly Capacity', icon: FaBolt },
    { value: '98%', label: 'Customer Satisfaction', icon: FaStar },
  ]

  const features = [
    {
      icon: FaSearch,
      title: 'Pincode-Based Search',
      desc: 'Find the nearest bio pellet plants to your location with a single pincode search — no sign-up required.',
    },
    {
      icon: FaShieldAlt,
      title: 'Certified Manufacturers',
      desc: 'Every plant in our database is verified and holds valid pollution board and quality certifications.',
    },
    {
      icon: FaRecycle,
      title: 'Eco-Friendly Fuel',
      desc: 'Bio pellets are carbon-neutral, affordable alternatives to coal and furnace oil, reducing your carbon footprint.',
    },
    {
      icon: FaSeedling,
      title: 'Support Green India',
      desc: 'Every purchase through EcoShield supports farmers who convert agricultural waste into sustainable fuel.',
    },
  ]

  const featuredPlants = plants.slice(0, 3)

  return (
    <div className="hero-bg">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="float-particle absolute top-1/4 left-1/6 w-2 h-2 bg-green-500/30 rounded-full" />
          <div className="float-particle-delay absolute top-1/3 right-1/4 w-3 h-3 bg-emerald-400/20 rounded-full" />
          <div className="float-particle-slow absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-lime-400/30 rounded-full" />
          <div className="float-particle absolute top-2/3 right-1/6 w-2.5 h-2.5 bg-green-600/25 rounded-full" />
          <div className="float-particle-delay absolute top-1/5 right-1/3 w-2 h-2 bg-amber-400/20 rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10" data-aos="fade-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 badge mb-6">
            <FaLeaf className="text-green-400 text-xs" />
            <span>India's #1 Bio Pellet Locator Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-7xl font-black leading-tight mb-6 tracking-tight">
            Find Certified{' '}
            <span className="gradient-text">Bio Pellet</span>
            <br />Plants Near You
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Search by pincode to discover verified bio pellet manufacturers in your area. 
            Switch to clean, affordable, and sustainable biomass fuel today.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8" data-aos="fade-up" data-aos-delay="200">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Enter pincode or city (e.g. 110001, Mumbai)"
                className="input-glow w-full bg-white/5 border border-green-800/50 text-white placeholder-gray-500 rounded-full pl-11 pr-5 py-4 text-base"
                id="hero-search"
              />
            </div>
            <button type="submit" className="btn-glow text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 whitespace-nowrap">
              <FaSearch /> Search Plants
            </button>
          </form>

          {/* Quick searches */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-gray-500 text-sm">Popular:</span>
            {['Delhi', 'Mumbai', 'Bengaluru', 'Punjab', 'Gujarat'].map(city => (
              <button
                key={city}
                onClick={() => navigate(`/search?q=${city}`)}
                className="text-sm text-green-400 hover:text-green-300 border border-green-800/40 hover:border-green-600 px-3 py-1 rounded-full transition-all"
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-green-700/50 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 bg-green-500 rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="section-divider mb-16" />
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} data-aos="fade-up" data-aos-delay={i * 100} className="glass rounded-2xl p-6 text-center">
              <stat.icon className="text-green-400 text-2xl mx-auto mb-3" />
              <div className="text-3xl font-black text-white mb-1 stat-num">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose <span className="gradient-text">EcoShield?</span></h2>
            <p className="text-gray-400 max-w-xl mx-auto">The most trusted platform for sourcing certified bio pellets across all 28 states of India</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={i * 100} className="glass rounded-2xl p-6 hover:border-green-500/30 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-green-900/40 flex items-center justify-center mb-4 group-hover:bg-green-800/50 transition-colors">
                  <f.icon className="text-green-400 text-xl" />
                </div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="section-divider mb-20" />
        <div className="max-w-5xl mx-auto text-center" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-white mb-4">How It <span className="gradient-text">Works</span></h2>
          <p className="text-gray-400 mb-14">Three simple steps to find your nearest bio pellet plant</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-px bg-gradient-to-r from-green-700/30 via-green-500/60 to-green-700/30" />
            {[
              { step: '01', title: 'Enter Your Pincode', desc: 'Type your area pincode or city name in the search bar', icon: FaSearch },
              { step: '02', title: 'Browse Nearby Plants', desc: 'View a list of verified bio pellet manufacturers near you', icon: FaIndustry },
              { step: '03', title: 'Get Contact Details', desc: 'Complete a small payment to unlock full contact information', icon: FaArrowRight },
            ].map((step, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={i * 150} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-700 to-emerald-900 flex items-center justify-center mb-4 shadow-lg shadow-green-900/50 relative z-10">
                  <step.icon className="text-green-300 text-xl" />
                </div>
                <div className="text-green-600 text-xs font-bold mb-2">{step.step}</div>
                <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured plants */}
      <section className="py-20 px-4">
        <div className="section-divider mb-20" />
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12" data-aos="fade-up">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">Featured <span className="gradient-text">Plants</span></h2>
              <p className="text-gray-400">Top-rated bio pellet manufacturers on our platform</p>
            </div>
            <button onClick={() => navigate('/search?q=')} className="mt-4 sm:mt-0 flex items-center gap-2 text-green-400 hover:text-green-300 text-sm font-medium border border-green-800/40 hover:border-green-600 px-4 py-2 rounded-full transition-all">
              View All <FaArrowRight />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPlants.map((plant, i) => (
              <div key={plant.id} data-aos="fade-up" data-aos-delay={i * 100} className="plant-card glass rounded-2xl overflow-hidden cursor-pointer" onClick={() => navigate(`/plant/${plant.id}`)}>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="badge">{plant.type}</span>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                      <FaStar /> <span className="text-gray-300">{plant.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">{plant.name}</h3>
                  <div className="flex items-center gap-1 text-gray-400 text-sm mb-3">
                    <FaMapMarkerAlt className="text-green-500 text-xs" />
                    <span>{plant.city}, {plant.state}</span>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">{plant.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 text-sm font-medium">{plant.capacity}</span>
                    <button className="text-sm text-green-400 hover:text-white flex items-center gap-1 transition-colors">
                      View Details <FaArrowRight className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4" data-aos="fade-up">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-3xl p-10 text-center border border-green-700/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-transparent pointer-events-none" />
            <FaLeaf className="text-green-400 text-4xl mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Go Green?</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">Join thousands of businesses switching to affordable, eco-friendly bio pellet fuel across India.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/search?q=')} className="btn-glow text-white px-8 py-3 rounded-full font-semibold">
                Find Plants Now
              </button>
              <button onClick={() => navigate('/register')} className="border border-green-700 text-green-400 hover:bg-green-900/20 px-8 py-3 rounded-full font-semibold transition-all">
                Register Your Plant
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
