import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaLeaf, FaBars, FaTimes, FaSearch, FaUser } from 'react-icons/fa'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
    }
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/search', label: 'Find Plants' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'navbar-blur shadow-xl' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <FaLeaf className="text-white text-sm" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              <span className="text-white">ECO</span>
              <span className="text-green-400">SHIELD</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-green-400 ${location.pathname === link.to ? 'text-green-400' : 'text-gray-300'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Search + Auth */}
          <div className="hidden md:flex items-center gap-3">
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search by pincode..."
                  className="input-glow bg-white/5 border border-green-900/40 text-white placeholder-gray-500 rounded-full pl-8 pr-4 py-1.5 text-sm w-44 focus:w-56 transition-all duration-300"
                />
              </div>
            </form>
            <Link to="/login" className="text-sm text-gray-300 hover:text-green-400 transition-colors flex items-center gap-1">
              <FaUser className="text-xs" /> Login
            </Link>
            <Link to="/register" className="btn-glow text-white text-sm px-4 py-1.5 rounded-full font-medium">
              Register
            </Link>
          </div>

          {/* Mobile menu btn */}
          <button
            className="md:hidden text-gray-300 hover:text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-green-900/30 mt-2 pt-4">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.to ? 'text-green-400 bg-green-900/20' : 'text-gray-300 hover:text-green-400'}`}
              >
                {link.label}
              </Link>
            ))}
            <form onSubmit={handleSearch} className="px-3 pt-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search by pincode or city..."
                  className="input-glow w-full bg-white/5 border border-green-900/40 text-white placeholder-gray-500 rounded-lg pl-8 pr-4 py-2 text-sm"
                />
              </div>
            </form>
            <div className="flex gap-2 px-3 pt-2">
              <Link to="/login" onClick={() => setIsOpen(false)} className="flex-1 text-center py-2 rounded-lg border border-green-700 text-green-400 text-sm">Login</Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="flex-1 text-center py-2 rounded-lg btn-glow text-white text-sm">Register</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
