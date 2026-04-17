import { FaLeaf, FaSeedling, FaRecycle, FaUsers, FaHandshake, FaGlobeAsia } from 'react-icons/fa'

const About = () => {
  const team = [
    { name: 'Arjun Sharma', role: 'Founder & CEO', bio: 'Renewable energy advocate with 10+ years in biomass sector' },
    { name: 'Priya Nair', role: 'CTO', bio: 'Full-stack engineer passionate about green tech platforms' },
    { name: 'Rakesh Yadav', role: 'Operations Head', bio: 'Supply chain expert managing India-wide plant network' },
  ]

  const values = [
    { icon: FaSeedling, title: 'Sustainability First', desc: 'Every decision we make is guided by its environmental impact.' },
    { icon: FaHandshake, title: 'Farmer Empowerment', desc: 'We help farmers monetize agricultural waste through bio pellets.' },
    { icon: FaGlobeAsia, title: 'Pan-India Reach', desc: 'Connecting manufacturers and buyers across all 28 states.' },
    { icon: FaUsers, title: 'Community Driven', desc: 'Built by and for the green energy community of India.' },
  ]

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 badge mb-4">
            <FaLeaf className="text-green-400 text-xs" />
            <span>Our Story</span>
          </div>
          <h1 className="text-5xl font-black text-white mb-4">
            About <span className="gradient-text">EcoShield</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            We're on a mission to make bio pellet fuel accessible, affordable, and transparent for every business in India — from small factories to large power plants.
          </p>
        </div>

        {/* Mission */}
        <div className="glass rounded-3xl p-10 mb-12" data-aos="fade-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Our <span className="gradient-text">Mission</span></h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                India generates over 500 million tonnes of agricultural waste every year — much of it burned in fields, contributing to massive air pollution and greenhouse gas emissions.
              </p>
              <p className="text-gray-400 leading-relaxed">
                EcoShield bridges the gap between bio pellet manufacturers and industries seeking clean fuel alternatives, making it easy to find certified, local suppliers — reducing transport costs and carbon emissions simultaneously.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '500+', label: 'Registered Plants', color: 'text-green-400' },
                { value: '28', label: 'States', color: 'text-emerald-400' },
                { value: '5000+', label: 'Industries Served', color: 'text-lime-400' },
                { value: '2019', label: 'Year Founded', color: 'text-yellow-400' },
              ].map(stat => (
                <div key={stat.label} className="bg-white/5 rounded-xl p-5 text-center">
                  <div className={`text-2xl font-black ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-gray-500 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values */}
        <h2 className="text-3xl font-bold text-white text-center mb-8" data-aos="fade-up">Our <span className="gradient-text">Values</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
          {values.map((v, i) => (
            <div key={i} data-aos="fade-up" data-aos-delay={i * 100} className="glass rounded-2xl p-6 flex gap-4">
              <div className="w-12 h-12 bg-green-900/40 rounded-xl flex items-center justify-center shrink-0">
                <v.icon className="text-green-400 text-xl" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">{v.title}</h3>
                <p className="text-gray-400 text-sm">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Team */}
        <h2 className="text-3xl font-bold text-white text-center mb-8" data-aos="fade-up">Meet the <span className="gradient-text">Team</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {team.map((member, i) => (
            <div key={i} data-aos="fade-up" data-aos-delay={i * 100} className="glass rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-700 to-emerald-900 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                {member.name[0]}
              </div>
              <h3 className="text-white font-bold mb-1">{member.name}</h3>
              <div className="badge mb-3 inline-block">{member.role}</div>
              <p className="text-gray-400 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default About
