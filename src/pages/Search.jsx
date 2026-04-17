import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { FaSearch, FaMapMarkerAlt, FaStar, FaIndustry, FaFilter, FaArrowRight, FaLeaf } from 'react-icons/fa'
import { searchPlants, plants } from '../data/plants'

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('rating')

  useEffect(() => {
    const q = searchParams.get('q') || ''
    setQuery(q)
    setLoading(true)
    setTimeout(() => {
      const found = q.trim() ? searchPlants(q) : plants
      setResults(found)
      setLoading(false)
    }, 500)
  }, [searchParams])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchParams(query ? { q: query } : {})
  }

  const sorted = [...results].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating
    if (sortBy === 'capacity') return parseInt(b.capacity) - parseInt(a.capacity)
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    return 0
  })

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Search header */}
        <div className="mb-10" data-aos="fade-up">
          <h1 className="text-4xl font-bold text-white mb-2">
            Find <span className="gradient-text">Bio Pellet Plants</span>
          </h1>
          <p className="text-gray-400">Search by pincode, city, state, or pellet type</p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8" data-aos="fade-up">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Enter pincode, city, state or pellet type..."
              className="input-glow w-full bg-white/5 border border-green-800/40 text-white placeholder-gray-500 rounded-xl pl-11 pr-4 py-3.5"
              id="search-input"
              autoFocus
            />
          </div>
          <button type="submit" className="btn-glow text-white px-6 py-3.5 rounded-xl font-semibold flex items-center gap-2">
            <FaSearch /> Search
          </button>
        </form>

        {/* Sort + Results count */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div className="text-gray-400 text-sm">
            {loading ? 'Searching...' : (
              <span>
                Found <span className="text-green-400 font-semibold">{results.length}</span> plants
                {query && <span> for "<span className="text-white">{query}</span>"</span>}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500 text-sm" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-white/5 border border-green-900/40 text-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
            >
              <option value="rating">Sort by Rating</option>
              <option value="capacity">Sort by Capacity</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-400 text-sm">Searching plants...</span>
            </div>
          </div>
        )}

        {/* No results */}
        {!loading && results.length === 0 && (
          <div className="text-center py-24" data-aos="fade-up">
            <FaLeaf className="text-green-800 text-5xl mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">No plants found</h3>
            <p className="text-gray-400 mb-6">Try searching with a different pincode or city name</p>
            <button onClick={() => { setQuery(''); setSearchParams({}) }} className="btn-glow text-white px-6 py-2.5 rounded-full text-sm">
              Show All Plants
            </button>
          </div>
        )}

        {/* Results grid */}
        {!loading && sorted.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((plant, i) => (
              <div
                key={plant.id}
                data-aos="fade-up"
                data-aos-delay={i * 50}
                className="plant-card glass rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => navigate(`/plant/${plant.id}`)}
              >
                {/* Card header */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="badge">{plant.type}</span>
                    <div className="flex items-center gap-1">
                      <FaStar className="text-yellow-400 text-xs" />
                      <span className="text-gray-300 text-sm font-medium">{plant.rating}</span>
                      <span className="text-gray-600 text-xs">({plant.reviews})</span>
                    </div>
                  </div>

                  <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">{plant.name}</h3>

                  <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-1">
                    <FaMapMarkerAlt className="text-green-500 text-xs shrink-0" />
                    <span>{plant.city}, {plant.state} - {plant.pincode}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-4">
                    <FaIndustry className="text-green-500 text-xs shrink-0" />
                    <span>Capacity: {plant.capacity}</span>
                  </div>

                  <p className="text-gray-500 text-sm line-clamp-2 mb-5">{plant.description}</p>

                  {/* Certifications */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {plant.certifications.slice(0, 2).map(cert => (
                      <span key={cert} className="text-xs bg-green-900/20 text-green-600 border border-green-900/30 rounded px-2 py-0.5">{cert}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-xs text-gray-500">Est. {plant.established}</span>
                    <button className="flex items-center gap-1.5 text-green-400 text-sm font-medium hover:text-white transition-colors">
                      View Details <FaArrowRight className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Search
