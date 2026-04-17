import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { FaLeaf, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (!auth) {
      setError('Auth service not configured. Please contact support.')
      setLoading(false)
      return
    }
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password)
      navigate('/')
    } catch (err) {
      const messages = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/invalid-email': 'Invalid email address.',
        'auth/too-many-requests': 'Too many attempts. Try again later.',
      }
      setError(messages[err.code] || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md" data-aos="fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-700 rounded-xl flex items-center justify-center">
              <FaLeaf className="text-white" />
            </div>
            <span className="font-bold text-2xl"><span className="text-white">ECO</span><span className="text-green-400">SHIELD</span></span>
          </Link>
          <h1 className="text-3xl font-bold text-white mt-6 mb-1">Welcome back</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        <div className="glass rounded-2xl p-8">
          {error && (
            <div className="bg-red-900/20 border border-red-700/40 text-red-400 rounded-xl px-4 py-3 text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                <input
                  id="login-email"
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
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Your password"
                  className="input-glow w-full bg-white/5 border border-green-900/30 text-white placeholder-gray-600 rounded-xl pl-11 pr-11 py-3 text-sm"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="login-submit"
              className="w-full btn-glow text-white py-3.5 rounded-xl font-semibold mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-400 hover:text-green-300 font-medium">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
