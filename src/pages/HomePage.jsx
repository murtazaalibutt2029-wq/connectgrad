import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, Briefcase, GraduationCap, TrendingUp, Globe, Users, Star, ArrowRight, CheckCircle } from 'lucide-react'
import { jobs } from '../data/jobs'
import JobCard from '../components/JobCard'

const stats = [
  { value: '12,000+', label: 'Active Listings' },
  { value: '800+', label: 'Partner Companies' },
  { value: '45,000+', label: 'Students Placed' },
  { value: '4 Regions', label: 'Pakistan · UK · USA · Europe' },
]

const features = [
  {
    icon: Globe,
    title: 'Global Reach, Local Insight',
    desc: 'Whether you are in Karachi, London, New York, or Berlin, we surface opportunities tailored to your location and visa status.',
  },
  {
    icon: GraduationCap,
    title: 'Built for Students',
    desc: 'Every listing is vetted for fresh graduates and students. No 5-year experience required — just talent and ambition.',
  },
  {
    icon: TrendingUp,
    title: 'Career Growth Tools',
    desc: 'Access CV templates, interview guides, and salary benchmarks to give yourself every advantage.',
  },
  {
    icon: Users,
    title: 'Community & Mentorship',
    desc: 'Connect with alumni who have made the same journey. Real advice from real people in your target roles.',
  },
]

const testimonials = [
  {
    name: 'Zara Ahmed',
    role: 'Software Engineer at Google UK',
    university: 'LUMS, Pakistan',
    quote: 'ConnectGrad helped me find my grad role in London when I had no idea where to start. The regional filters saved me hours.',
    avatar: 'Z',
  },
  {
    name: 'Omar Farooq',
    role: 'Investment Banking Analyst at Deutsche Bank',
    university: 'University of Manchester',
    quote: 'The salary benchmarks and interview resources are genuinely useful. I went in knowing exactly what to expect.',
    avatar: 'O',
  },
  {
    name: 'Aisha Malik',
    role: 'Product Manager at Spotify',
    university: 'IBA Karachi',
    quote: 'I found my Amsterdam internship through ConnectGrad. The listings for European roles are unlike anything else.',
    avatar: 'A',
  },
]

const companies = ['Google', 'Microsoft', 'Barclays', 'Unilever', 'SAP', 'McKinsey', 'Arbisoft', 'Netsol']

export default function HomePage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchRegion, setSearchRegion] = useState('All Regions')

  const handleSearch = e => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set('search', searchQuery.trim())
    if (searchRegion !== 'All Regions') params.set('region', searchRegion)
    navigate(`/jobs${params.toString() ? `?${params}` : ''}`)
  }

  const featuredJobs = jobs.filter(j => j.featured)

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(180deg, #030a1a 0%, #071230 50%, #030a1a 100%)',
        padding: '80px 24px 100px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow effects */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 800, height: 400, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 200, left: '10%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(7,18,48,0.6) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', borderRadius: 20,
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.25)',
            fontSize: 13, color: '#34d399', fontWeight: 500,
            marginBottom: 28,
          }}>
            <Star size={13} />
            Now live in Pakistan, UK, USA and Europe
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 800,
            color: '#f1f5f9',
            lineHeight: 1.12,
            letterSpacing: '-1.5px',
            marginBottom: 20,
          }}>
            Launch your career with
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #10b981, #34d399)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              the right opportunity
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 2vw, 19px)',
            color: '#64748b',
            lineHeight: 1.7,
            marginBottom: 44,
            maxWidth: 560,
            margin: '0 auto 44px',
          }}>
            ConnectGrad connects ambitious students and graduates to internships and jobs at top companies — across Pakistan, the UK, USA, and Europe.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{
            display: 'flex',
            gap: 0,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 14,
            padding: 6,
            maxWidth: 640,
            margin: '0 auto 20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 16px', gap: 10 }}>
              <Search size={18} color="#475569" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Job title, company, or keyword..."
                style={{
                  background: 'none', border: 'none', outline: 'none',
                  color: '#f1f5f9', fontSize: 15, width: '100%',
                }}
              />
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.08)', margin: '8px 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8 }}>
              <MapPin size={16} color="#475569" />
              <select
                value={searchRegion}
                onChange={e => setSearchRegion(e.target.value)}
                style={{ background: 'none', border: 'none', outline: 'none', color: '#64748b', fontSize: 14, cursor: 'pointer' }}
              >
                <option>All Regions</option>
                <option>Pakistan</option>
                <option>UK</option>
                <option>USA</option>
                <option>Europe</option>
              </select>
            </div>
            <button type="submit" style={{
              padding: '12px 24px', borderRadius: 10,
              background: 'linear-gradient(135deg, #059669, #10b981)',
              color: 'white', fontSize: 15, fontWeight: 600,
              border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              boxShadow: '0 0 20px rgba(16,185,129,0.4)',
            }}>
              Search Jobs
            </button>
          </form>

          <p style={{ fontSize: 13, color: '#475569' }}>
            Popular: &nbsp;
            {['Software Engineering', 'Finance', 'Product Management', 'Data Science'].map((t, i) => (
              <Link key={t} to={`/jobs?search=${encodeURIComponent(t)}`} style={{ color: '#34d399', textDecoration: 'none' }}>
                {t}{i < 3 ? ' · ' : ''}
              </Link>
            ))}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#071230', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {stats.map(stat => (
              <div key={stat.label} style={{ textAlign: 'center', padding: '16px' }}>
                <div style={{ fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 800, color: '#10b981', marginBottom: 6 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 13, color: '#64748b' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section style={{ padding: '80px 24px', background: '#030a1a' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#10b981', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>
                Featured Opportunities
              </p>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.5px' }}>
                Top picks for you
              </h2>
            </div>
            <Link to="/jobs" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 14, fontWeight: 500, color: '#10b981', textDecoration: 'none',
            }}>
              View all jobs <ArrowRight size={16} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {featuredJobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', background: '#071230' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#10b981', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
              Why ConnectGrad
            </p>
            <h2 style={{ fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.5px', marginBottom: 14 }}>
              Everything you need to land your dream role
            </h2>
            <p style={{ fontSize: 16, color: '#64748b', maxWidth: 480, margin: '0 auto' }}>
              From first application to first day — we have got you covered.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
            {features.map(f => (
              <div key={f.title} style={{
                padding: 28,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16,
                transition: 'all 0.2s',
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 18,
                }}>
                  <f.icon size={22} color="#10b981" />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: '#f1f5f9', marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 24px', background: '#030a1a' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#10b981', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
              Success Stories
            </p>
            <h2 style={{ fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.5px' }}>
              Students who made it happen
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {testimonials.map(t => (
              <div key={t.name} style={{
                padding: 28,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16,
              }}>
                <div style={{ display: 'flex', marginBottom: 6 }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} color="#10b981" fill="#10b981" />
                  ))}
                </div>
                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, marginBottom: 20 }}>
                  "{t.quote}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #059669, #10b981)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 700, color: 'white',
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{t.role}</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>{t.university}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section style={{ padding: '56px 24px', background: '#071230', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: '#475569', marginBottom: 28 }}>
            TRUSTED BY LEADING COMPANIES
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
            {companies.map(c => (
              <div key={c} style={{
                padding: '10px 22px',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                fontSize: 14, fontWeight: 600, color: '#64748b',
              }}>
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, #071230 0%, #0d1f4f 50%, #071230 100%)',
        borderTop: '1px solid rgba(16,185,129,0.1)',
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.8px', marginBottom: 16 }}>
            Ready to start your journey?
          </h2>
          <p style={{ fontSize: 17, color: '#64748b', marginBottom: 36 }}>
            Join 45,000+ students and graduates who found their path through ConnectGrad.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" style={{
              padding: '14px 32px', borderRadius: 10, fontSize: 16, fontWeight: 700,
              textDecoration: 'none', color: 'white',
              background: 'linear-gradient(135deg, #059669, #10b981)',
              boxShadow: '0 0 30px rgba(16,185,129,0.4)',
            }}>
              Create free account
            </Link>
            <Link to="/jobs" style={{
              padding: '14px 32px', borderRadius: 10, fontSize: 16, fontWeight: 600,
              textDecoration: 'none', color: '#94a3b8',
              border: '1px solid rgba(148,163,184,0.2)',
            }}>
              Browse jobs
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 24 }}>
            {['No credit card required', 'Free for students', 'Cancel anytime'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#475569' }}>
                <CheckCircle size={13} color="#10b981" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
