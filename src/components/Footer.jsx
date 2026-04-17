import { Link } from 'react-router-dom'
import { FaLeaf, FaTwitter, FaLinkedin, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-black/40 border-t border-green-900/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-700 rounded-lg flex items-center justify-center">
                <FaLeaf className="text-white" />
              </div>
              <span className="font-bold text-xl">
                <span className="text-white">ECO</span>
                <span className="text-green-400">SHIELD</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Empowering a greener tomorrow by connecting industries with certified bio pellet manufacturers across India. One search, infinite green possibilities.
            </p>
            <div className="flex gap-3 mt-5">
              {[FaTwitter, FaLinkedin, FaInstagram].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full border border-green-900/40 flex items-center justify-center text-gray-400 hover:text-green-400 hover:border-green-500 transition-all">
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/search', label: 'Find Plants' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
                { to: '/register', label: 'Register Plant' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 text-sm hover:text-green-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <FaMapMarkerAlt className="text-green-500 mt-0.5 shrink-0" />
                <span>Green Tech Park, Sector 62, Noida, UP - 201309</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <FaPhone className="text-green-500 shrink-0" />
                <span>+91 98765 00000</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <FaEnvelope className="text-green-500 shrink-0" />
                <span>info@ecoshield.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="section-divider my-8" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
          <p>© 2025 EcoShield. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
