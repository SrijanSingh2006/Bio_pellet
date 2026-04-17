import { useState } from 'react'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle } from 'react-icons/fa'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setSubmitted(true); setLoading(false) }, 1500)
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14" data-aos="fade-up">
          <h1 className="text-5xl font-black text-white mb-4">Get in <span className="gradient-text">Touch</span></h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">Have a question or want to register your plant? We'd love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-4" data-aos="fade-right">
            {[
              { icon: FaPhone, title: 'Call Us', value: '+91 98765 00000', sub: 'Mon–Sat, 9am–6pm IST' },
              { icon: FaEnvelope, title: 'Email Us', value: 'info@ecoshield.in', sub: 'We reply within 24 hours' },
              { icon: FaMapMarkerAlt, title: 'Visit Us', value: 'Green Tech Park, Sector 62', sub: 'Noida, UP - 201309' },
            ].map((item, i) => (
              <div key={i} className="glass rounded-2xl p-5 flex gap-4">
                <div className="w-11 h-11 bg-green-900/40 rounded-xl flex items-center justify-center shrink-0">
                  <item.icon className="text-green-400" />
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-0.5">{item.title}</div>
                  <div className="text-white font-semibold text-sm">{item.value}</div>
                  <div className="text-gray-500 text-xs">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-3" data-aos="fade-left">
            <div className="glass rounded-2xl p-8">
              {submitted ? (
                <div className="text-center py-10">
                  <FaCheckCircle className="text-green-400 text-5xl mx-auto mb-4" />
                  <h3 className="text-white text-2xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-gray-400">We'll get back to you within 24 hours.</p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }} className="mt-6 btn-glow text-white px-6 py-2.5 rounded-full text-sm">
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-1.5 block">Your Name</label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Rahul Sharma"
                        className="input-glow w-full bg-white/5 border border-green-900/30 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-1.5 block">Email Address</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="rahul@example.com"
                        className="input-glow w-full bg-white/5 border border-green-900/30 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1.5 block">Subject</label>
                    <input
                      required
                      type="text"
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      placeholder="How can we help you?"
                      className="input-glow w-full bg-white/5 border border-green-900/30 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1.5 block">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us about your requirements..."
                      className="input-glow w-full bg-white/5 border border-green-900/30 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-glow text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><FaPaperPlane /> Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
