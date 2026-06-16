import { Link } from 'react-router-dom'
import { Briefcase, Users, Globe, BarChart2, CheckCircle, ArrowRight, Star, Building2, Zap, Shield } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    description: 'Perfect for small companies posting their first role.',
    features: ['1 active job listing', 'Up to 50 applicants', 'Basic company profile', 'Email support'],
    cta: 'Get started',
    highlight: false,
  },
  {
    name: 'Growth',
    price: '$99',
    period: '/month',
    description: 'For growing teams hiring regularly across regions.',
    features: ['10 active listings', 'Unlimited applicants', 'Featured listings', 'Candidate filtering tools', 'Analytics dashboard', 'Priority support'],
    cta: 'Start free trial',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Tailored solutions for large organisations and universities.',
    features: ['Unlimited listings', 'Dedicated account manager', 'University partnership access', 'ATS integrations', 'Custom branding', 'SLA guarantee'],
    cta: 'Contact sales',
    highlight: false,
  },
]

const steps = [
  { icon: Building2, title: 'Create your company profile', desc: 'Set up your employer page in minutes. Add your logo, culture, and what makes your team great.' },
  { icon: Briefcase, title: 'Post your opportunity', desc: 'Fill in the job details, requirements, and compensation. Choose target regions and student year groups.' },
  { icon: Users, title: 'Review applications', desc: 'Candidates apply directly. Use filters to shortlist by university, field, or region.' },
  { icon: Zap, title: 'Hire faster', desc: 'Message shortlisted candidates, schedule interviews, and make offers - all in one place.' },
]

const stats = [
  { value: '45,000+', label: 'Active students' },
  { value: '4', label: 'Regions covered' },
  { value: '72hrs', label: 'Avg. time to first applicant' },
  { value: '94%', label: 'Employer satisfaction rate' },
]

const testimonials = [
  {
    name: 'Sarah Thornton',
    role: 'Graduate Recruitment Lead, Barclays',
    quote: 'ConnectGrad gives us direct access to top students from Pakistan and the UK in one place. The quality of applicants is genuinely impressive.',
    avatar: 'S',
  },
  {
    name: 'Ahmed Raza',
    role: 'HR Director, Arbisoft',
    quote: 'We filled three internship positions within a week of posting. The regional targeting is exactly what we needed.',
    avatar: 'A',
  },
]

export default function EmployersPage() {
  return (
    <div style={{ background: '#030a1a' }}>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(180deg, #071230 0%, #030a1a 100%)',
        padding: '80px 24px 90px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 350, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', borderRadius: 20,
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
            fontSize: 13, color: '#6366f1', fontWeight: 500, marginBottom: 28,
          }}>
            <Star size={13} /> Trusted by 800+ companies worldwide
          </div>
          <h1 style={{
            fontSize: 'clamp(34px, 5.5vw, 60px)', fontWeight: 800, color: '#f1f5f9',
            lineHeight: 1.12, letterSpacing: '-1.5px', marginBottom: 20,
          }}>
            Hire the next generation
            <br />
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              of top talent
            </span>
          </h1>
          <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: '#64748b', lineHeight: 1.75, marginBottom: 40, maxWidth: 540, margin: '0 auto 40px' }}>
            Post internships and graduate roles to 45,000+ ambitious students across Pakistan, UK, USA and Europe. Your next great hire is already here.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" style={{
              padding: '13px 30px', borderRadius: 10, fontSize: 15, fontWeight: 700,
              textDecoration: 'none', color: 'white',
              background: 'linear-gradient(135deg, #6366f1, #6366f1)',
              boxShadow: '0 0 28px rgba(99,102,241,0.35)',
            }}>
              Post a job free
            </Link>
            <a href="#how-it-works" style={{
              padding: '13px 30px', borderRadius: 10, fontSize: 15, fontWeight: 600,
              textDecoration: 'none', color: '#94a3b8',
              border: '1px solid rgba(148,163,184,0.2)',
            }}>
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#071230', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: '#6366f1', marginBottom: 6 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: '80px 24px', background: '#030a1a' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#6366f1', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>How it works</p>
            <h2 style={{ fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.5px' }}>
              From posting to hiring in days
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 24 }}>
            {steps.map((step, i) => (
              <div key={step.title} style={{
                padding: 28,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16, position: 'relative',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: '#6366f1', marginBottom: 16,
                }}>
                  {i + 1}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#f1f5f9', marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '80px 24px', background: '#071230' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#6366f1', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>Pricing</p>
            <h2 style={{ fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.5px', marginBottom: 12 }}>
              Simple, transparent pricing
            </h2>
            <p style={{ fontSize: 15, color: '#64748b' }}>Start free. Scale as you grow.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {plans.map(plan => (
              <div key={plan.name} style={{
                padding: 32, borderRadius: 16,
                background: plan.highlight ? 'rgba(99,102,241,0.07)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${plan.highlight ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.06)'}`,
                position: 'relative',
              }}>
                {plan.highlight && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #6366f1, #6366f1)',
                    fontSize: 11, fontWeight: 700, color: 'white',
                    padding: '4px 14px', borderRadius: 20, letterSpacing: 0.5,
                  }}>
                    MOST POPULAR
                  </div>
                )}
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>{plan.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 8 }}>
                    <span style={{ fontSize: 36, fontWeight: 800, color: plan.highlight ? '#6366f1' : '#f1f5f9' }}>{plan.price}</span>
                    <span style={{ fontSize: 14, color: '#64748b' }}>{plan.period}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{plan.description}</p>
                </div>
                <ul style={{ listStyle: 'none', marginBottom: 28 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>
                      <CheckCircle size={14} color="#6366f1" style={{ flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/signup" style={{
                  display: 'block', textAlign: 'center',
                  padding: '11px 0', borderRadius: 9, fontSize: 14, fontWeight: 600,
                  textDecoration: 'none',
                  color: plan.highlight ? 'white' : '#94a3b8',
                  background: plan.highlight ? 'linear-gradient(135deg, #6366f1, #6366f1)' : 'rgba(255,255,255,0.05)',
                  border: plan.highlight ? 'none' : '1px solid rgba(255,255,255,0.1)',
                }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 24px', background: '#030a1a' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#6366f1', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>Employer stories</p>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.5px' }}>
              What hiring teams say
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {testimonials.map(t => (
              <div key={t.name} style={{ padding: 28, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }}>
                <div style={{ display: 'flex', marginBottom: 8 }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} color="#6366f1" fill="#6366f1" />)}
                </div>
                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, marginBottom: 20 }}>"{t.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #6366f1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 15, fontWeight: 700, color: 'white',
                  }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{t.role}</div>
                  </div>
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
        borderTop: '1px solid rgba(99,102,241,0.1)',
      }}>
        <div style={{ maxWidth: 580, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.8px', marginBottom: 14 }}>
            Ready to find your next hire?
          </h2>
          <p style={{ fontSize: 16, color: '#64748b', marginBottom: 32 }}>
            Post your first role free. No credit card required.
          </p>
          <Link to="/signup" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '13px 32px', borderRadius: 10, fontSize: 15, fontWeight: 700,
            textDecoration: 'none', color: 'white',
            background: 'linear-gradient(135deg, #6366f1, #6366f1)',
            boxShadow: '0 0 28px rgba(99,102,241,0.35)',
          }}>
            Post a job free <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
