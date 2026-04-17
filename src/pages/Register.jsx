import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { FaLeaf, FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa'

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    if (!auth) {
      setError('Auth service not configured. Please contact support.')
      setLoading(false)
      return
    }
    try {
      await createUserWithEmailAndPassword(auth, form.email, form.password)
      navigate('/')
    } catch (err) {
      const messages = {
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/invalid-email': 'Invalid email address.',
        'auth/weak-password': 'Password is too weak.',
      }
      setError(messages[err.code] || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const perks = ['Find nearest bio pellet plants', 'Save favourite manufacturers', 'Track orders & inquiries']

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10">
      <div className="w-full max-w-md" data-aos="fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-700 rounded-xl flex items-center justify-center">
              <FaLeaf className="text-white" />
            </div>
            <span className="font-bold text-2xl"><span className="text-white">ECO</span><span className="text-green-400">SHIELD</span></span>
          </Link>
          <h1 className="text-3xl font-bold text-white mt-6 mb-1">Create Account</h1>
          <p className="text-gray-400">Join India's green energy platform</p>
        </div>

        {/* Perks */}
        <div className="flex justify-center flex-wrap gap-3 mb-6">
          {perks.map(perk => (
            <span key={perk} className="flex items-center gap-1.5 text-xs text-gray-400">
              <FaCheckCircle className="text-green-500 text-xs" /> {perk}
            </span>
          ))}
        </div>

        <div className="glass rounded-2xl p-8">
          {error && (
            <div className="bg-red-900/20 border border-red-700/40 text-red-400 rounded-xl px-4 py-3 text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">Full Name</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Rahul Sharma"
                  className="input-glow w-full bg-white/5 border border-green-900/30 text-white placeholder-gray-600 rounded-xl pl-11 pr-4 py-3 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="input-glow w-full bg-white/5 border border-green-900/30 text-white placeholder-gray-600 rounded-xl pl-11 pr-4 py-3 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                <input
                  id="reg-password"
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 6 characters"
                  className="input-glow w-full bg-white/5 border border-green-900/30 text-white placeholder-gray-600 rounded-xl pl-11 pr-11 py-3 text-sm"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                <input
                  id="reg-confirm"
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })}
                  placeholder="Re-enter password"
                  className="input-glow w-full bg-white/5 border border-green-900/30 text-white placeholder-gray-600 rounded-xl pl-11 pr-4 py-3 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="register-submit"
              className="w-full btn-glow text-white py-3.5 rounded-xl font-semibold mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-green-400 hover:text-green-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
