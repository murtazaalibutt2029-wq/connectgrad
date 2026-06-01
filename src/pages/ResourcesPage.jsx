import { Link } from 'react-router-dom'
import { BookOpen, FileText, Mic, TrendingUp, ArrowRight, Star, Users, Download, PlayCircle } from 'lucide-react'

const categories = [
  {
    icon: FileText,
    label: 'CV & Cover Letters',
    count: '24 guides',
    color: '#6366f1',
    desc: 'Templates and tips for writing CVs that get noticed by top employers.',
  },
  {
    icon: Mic,
    label: 'Interview Prep',
    count: '31 resources',
    color: '#10b981',
    desc: 'Common questions, STAR method guides, and mock interview frameworks.',
  },
  {
    icon: TrendingUp,
    label: 'Salary Benchmarks',
    count: '12 reports',
    color: '#f59e0b',
    desc: 'Up-to-date salary data by role, region, and industry for 2025.',
  },
  {
    icon: Users,
    label: 'Networking',
    count: '18 guides',
    color: '#ec4899',
    desc: 'How to build a professional network as a student, from LinkedIn to events.',
  },
  {
    icon: BookOpen,
    label: 'Industry Guides',
    count: '20 guides',
    color: '#0ea5e9',
    desc: 'Deep dives into tech, finance, consulting, marketing, and more.',
  },
  {
    icon: Download,
    label: 'Templates',
    count: '15 templates',
    color: '#8b5cf6',
    desc: 'Downloadable CV, cover letter, and email templates ready to customise.',
  },
]

const featured = [
  {
    category: 'CV Guide',
    title: 'The Complete CV Guide for Pakistan & UK Students',
    desc: 'Covers formatting differences between UK, US, and Pakistani CVs, what to include as a student, and how to make yours stand out.',
    readTime: '8 min read',
    tag: 'Most popular',
    tagColor: '#10b981',
  },
  {
    category: 'Interview Prep',
    title: '50 Most Common Graduate Interview Questions (With Answers)',
    desc: 'Compiled from real interviews at Google, Barclays, McKinsey, and more. Includes STAR-format sample answers for each.',
    readTime: '15 min read',
    tag: 'Editor\'s pick',
    tagColor: '#6366f1',
  },
  {
    category: 'Salary Report',
    title: '2025 Graduate Salary Report: Pakistan, UK, USA & Europe',
    desc: 'Median starting salaries across 12 industries and 4 regions. Know your worth before you negotiate.',
    readTime: '6 min read',
    tag: 'New',
    tagColor: '#f59e0b',
  },
  {
    category: 'Career Guide',
    title: 'Breaking into Investment Banking as a Pakistani Student',
    desc: 'From target universities and internship timelines to networking strategies and technical prep.',
    readTime: '12 min read',
    tag: 'In-depth',
    tagColor: '#0ea5e9',
  },
  {
    category: 'Networking',
    title: 'How to Use LinkedIn as a Student (The Right Way)',
    desc: 'Profile optimisation, cold outreach templates, and how to turn connections into opportunities.',
    readTime: '7 min read',
    tag: 'Beginner friendly',
    tagColor: '#ec4899',
  },
  {
    category: 'Tech Careers',
    title: 'Software Engineering Internships: A Complete Roadmap',
    desc: 'Coding prep, application timelines, system design basics, and what to expect on day one.',
    readTime: '10 min read',
    tag: 'Popular',
    tagColor: '#8b5cf6',
  },
]

const webinars = [
  {
    title: 'Live Q&A: Getting a Tech Job in the UK Without a UK Degree',
    host: 'Zara Ahmed, Google UK',
    date: 'Jun 18, 2025',
    avatar: 'Z',
  },
  {
    title: 'How to Ace Consulting Case Interviews',
    host: 'Omar Farooq, McKinsey Lahore',
    date: 'Jun 25, 2025',
    avatar: 'O',
  },
  {
    title: 'Breaking into Finance in Europe as an International Student',
    host: 'Aisha Malik, ABN AMRO',
    date: 'Jul 2, 2025',
    avatar: 'A',
  },
]

export default function ResourcesPage() {
  return (
    <div style={{ background: '#030a1a' }}>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(180deg, #071230 0%, #030a1a 100%)',
        padding: '80px 24px 80px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 350, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(16,185,129,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', borderRadius: 20,
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
            fontSize: 13, color: '#34d399', fontWeight: 500, marginBottom: 28,
          }}>
            <BookOpen size={13} /> 120+ free career resources
          </div>
          <h1 style={{
            fontSize: 'clamp(34px, 5.5vw, 58px)', fontWeight: 800, color: '#f1f5f9',
            lineHeight: 1.12, letterSpacing: '-1.5px', marginBottom: 20,
          }}>
            Everything you need to
            <br />
            <span style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              land the role
            </span>
          </h1>
          <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: '#64748b', lineHeight: 1.75, maxWidth: 500, margin: '0 auto 0' }}>
            Free CV templates, interview guides, salary benchmarks, and career advice — all tailored for students in Pakistan, UK, USA and Europe.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '72px 24px', background: '#030a1a' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#10b981', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>Browse by category</p>
          <h2 style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.4px', marginBottom: 36 }}>
            What do you need help with?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
            {categories.map(cat => (
              <a key={cat.label} href="#featured" style={{
                display: 'block', padding: '24px', borderRadius: 14, textDecoration: 'none', cursor: 'pointer',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${cat.color}44`; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 11,
                  background: `${cat.color}18`, border: `1px solid ${cat.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
                }}>
                  <cat.icon size={20} color={cat.color} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9' }}>{cat.label}</h3>
                  <span style={{ fontSize: 11, color: '#475569' }}>{cat.count}</span>
                </div>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65 }}>{cat.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured articles */}
      <section id="featured" style={{ padding: '72px 24px', background: '#071230' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#10b981', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Featured guides</p>
              <h2 style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.4px' }}>
                Most-read this month
              </h2>
            </div>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, color: '#10b981', textDecoration: 'none' }}>
              View all <ArrowRight size={15} />
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {featured.map(article => (
              <a key={article.title} href="#" style={{
                display: 'block', padding: 24, borderRadius: 14, textDecoration: 'none',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.25)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    {article.category}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 5,
                    background: `${article.tagColor}18`, color: article.tagColor, letterSpacing: 0.3,
                  }}>
                    {article.tag}
                  </span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', lineHeight: 1.45, marginBottom: 10 }}>
                  {article.title}
                </h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65, marginBottom: 16 }}>
                  {article.desc}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#475569' }}>
                  <BookOpen size={12} />
                  {article.readTime}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming webinars */}
      <section style={{ padding: '72px 24px', background: '#030a1a' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#10b981', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Live events</p>
              <h2 style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.4px' }}>
                Upcoming webinars
              </h2>
            </div>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, color: '#10b981', textDecoration: 'none' }}>
              All events <ArrowRight size={15} />
            </a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {webinars.map(w => (
              <div key={w.title} style={{
                display: 'flex', alignItems: 'center', gap: 20,
                padding: '20px 24px', borderRadius: 14,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 700, color: 'white',
                }}>
                  {w.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginBottom: 4 }}>{w.title}</h3>
                  <p style={{ fontSize: 12, color: '#64748b' }}>Hosted by {w.host}</p>
                </div>
                <div style={{ flexShrink: 0, textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: '#10b981', fontWeight: 600, marginBottom: 8 }}>{w.date}</div>
                  <a href="#" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '6px 14px', borderRadius: 7,
                    background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                    fontSize: 12, fontWeight: 600, color: '#10b981', textDecoration: 'none',
                  }}>
                    <PlayCircle size={12} /> Register
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '72px 24px',
        background: 'linear-gradient(135deg, #071230 0%, #0d1f4f 50%, #071230 100%)',
        borderTop: '1px solid rgba(16,185,129,0.1)',
      }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.8px', marginBottom: 14 }}>
            Get personalised resources
          </h2>
          <p style={{ fontSize: 16, color: '#64748b', marginBottom: 32 }}>
            Create a free account and we will recommend guides based on your target role and region.
          </p>
          <Link to="/signup" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '13px 32px', borderRadius: 10, fontSize: 15, fontWeight: 700,
            textDecoration: 'none', color: 'white',
            background: 'linear-gradient(135deg, #059669, #10b981)',
            boxShadow: '0 0 28px rgba(16,185,129,0.35)',
          }}>
            Sign up free <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
