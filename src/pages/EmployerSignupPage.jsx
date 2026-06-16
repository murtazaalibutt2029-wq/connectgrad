import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Briefcase, Building2, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const industries = [
  'Technology', 'Finance', 'Consulting', 'Healthcare', 'Education',
  'Consumer Goods', 'Manufacturing', 'Energy', 'Non-profit', 'Media',
]

export default function EmployerSignupPage() {
  const navigate = useNavigate()
  const { refreshEmployerStatus } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    companyName: '', companySize: '', industry: '', website: '', contactName: '', email: '', password: '',
  })

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            company_name: form.companyName,
            contact_name: form.contactName,
          },
        },
      })
      if (authError) throw authError
      if (!data?.user?.id) throw new Error('Failed to create employer account.')

      const { error: profileError } = await supabase
        .from('employer_profiles')
        .insert({
          user_id: data.user.id,
          company_name: form.companyName,
          company_size: form.companySize,
          industry: form.industry,
          website: form.website,
          contact_name: form.contactName,
          email: form.email,
        })
      if (profileError) throw profileError
      await refreshEmployerStatus()
      setSubmitted(true)
    } catch (err) {
      console.error('Employer signup failed', err)
      setError(err.message || 'Unable to create employer account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: 520 }}>
          <div style={{ width: 90, height: 90, borderRadius: '50%', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(99,102,241,0.15)', border: '2px solid rgba(99,102,241,0.3)' }}>
            <CheckCircle size={36} color="#6366f1" />
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#f1f5f9', marginBottom: 12 }}>Employer account created</h2>
          <p style={{ fontSize: 15, color: '#94a3b8', marginBottom: 28 }}>Your employer profile is ready. You can continue to the dashboard to post your first role and start reviewing candidates.</p>
          <Link to="/employer/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 32px', borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #6366f1)', color: 'white', fontWeight: 700, textDecoration: 'none' }}>
            Go to employer dashboard <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#030a1a', padding: '60px 24px 80px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div style={{ marginBottom: 36, textAlign: 'center' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>Employer signup</p>
          <h1 style={{ fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 800, color: '#f1f5f9', marginBottom: 14 }}>Hire smarter with ConnectGrad</h1>
          <p style={{ fontSize: 15, color: '#94a3b8', maxWidth: 580, margin: '0 auto' }}>Create an employer account to post jobs, connect with students, and manage applications from your dashboard.</p>
        </div>

        {error && (
          <div style={{ marginBottom: 24, padding: '16px 18px', borderRadius: 14, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, display: 'block' }}>Company name</label>
              <input value={form.companyName} onChange={e => update('companyName', e.target.value)} required placeholder="e.g. Arbisoft" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, display: 'block' }}>Company size</label>
              <select value={form.companySize} onChange={e => update('companySize', e.target.value)} required style={inputStyle}>
                <option value="">Select size</option>
                <option value="1-20 employees">1-20 employees</option>
                <option value="21-100 employees">21-100 employees</option>
                <option value="101-500 employees">101-500 employees</option>
                <option value="500+ employees">500+ employees</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, display: 'block' }}>Industry</label>
              <select value={form.industry} onChange={e => update('industry', e.target.value)} required style={inputStyle}>
                <option value="">Select industry</option>
                {industries.map(industry => <option key={industry} value={industry}>{industry}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, display: 'block' }}>Website</label>
              <input value={form.website} onChange={e => update('website', e.target.value)} placeholder="https://" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, display: 'block' }}>Contact name</label>
              <input value={form.contactName} onChange={e => update('contactName', e.target.value)} required placeholder="e.g. Sara Khan" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, display: 'block' }}>Email address</label>
              <input value={form.email} onChange={e => update('email', e.target.value)} type="email" required placeholder="contact@company.com" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, display: 'block' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)} required minLength={8} placeholder="Min. 8 characters" style={{ ...inputStyle, paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ padding: '14px 0', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #6366f1, #6366f1)', color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            {loading ? 'Creating account...' : 'Create employer account'}
          </button>
        </form>

        <p style={{ marginTop: 22, fontSize: 13, color: '#64748b', textAlign: 'center' }}>
          Already have an employer account? <Link to="/login" style={{ color: '#6366f1' }}>Log in</Link>
        </p>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9', fontSize: 14, outline: 'none',
}
