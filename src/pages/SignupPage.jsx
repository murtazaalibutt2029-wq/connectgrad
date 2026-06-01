import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, Eye, EyeOff, CheckCircle, ArrowRight, Briefcase, Loader, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

const universities = [
  'LUMS', 'NUST', 'IBA Karachi', 'Aga Khan University',
  'University of Oxford', 'University of Cambridge', 'Imperial College London', 'UCL',
  'MIT', 'Stanford University', 'Harvard University', 'Columbia University',
  'TU Berlin', 'University of Amsterdam', 'ETH Zurich', 'Other',
]

const studyFields = [
  'Computer Science / Software Engineering',
  'Business / Management',
  'Finance / Accounting',
  'Data Science / Analytics',
  'Engineering (non-CS)',
  'Marketing / Communications',
  'Medicine / Healthcare',
  'Law',
  'Arts & Humanities',
  'Other',
]

const benefits = [
  'Access 12,000+ verified student opportunities',
  'Personalized job recommendations',
  'CV & cover letter templates',
  'Salary benchmarks by role & region',
  'Alumni network & mentorship',
  'Application deadline reminders',
]

function friendlyError(msg) {
  if (!msg) return 'Something went wrong. Please try again.'
  if (msg.includes('already registered') || msg.includes('already been registered'))
    return 'An account with this email already exists. Try logging in instead.'
  if (msg.includes('Password should be at least'))
    return 'Password must be at least 8 characters.'
  if (msg.includes('Unable to validate email'))
    return 'Please enter a valid email address.'
  if (msg.includes('Email rate limit'))
    return 'Too many attempts. Please wait a few minutes and try again.'
  return msg
}

export default function SignupPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep]         = useState(1)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
    university: '', field: '', graduationYear: '', region: '',
  })

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleStep1 = e => {
    e.preventDefault()
    setError(null)
    setStep(2)
  }

  const handleStep2 = async e => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Create the auth user
      const { data, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            first_name: form.firstName,
            last_name: form.lastName,
          },
        },
      })

      if (authError) throw authError

      // 2. Insert the student profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          university: form.university,
          field_of_study: form.field,
          graduation_year: parseInt(form.graduationYear),
          preferred_region: form.region,
        })

      if (profileError) throw profileError

      setSubmitted(true)
    } catch (err) {
      setError(friendlyError(err.message))
    } finally {
      setLoading(false)
    }
  }

  // ── Success screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(16,185,129,0.15)',
            border: '2px solid rgba(16,185,129,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <CheckCircle size={38} color="#10b981" />
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#f1f5f9', marginBottom: 12 }}>
            Welcome to ConnectGrad!
          </h2>
          <p style={{ fontSize: 15, color: '#64748b', marginBottom: 32 }}>
            Your account has been created. You're all set.
          </p>
          <Link to="/jobs" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '13px 28px', borderRadius: 10,
            background: 'linear-gradient(135deg, #059669, #10b981)',
            color: 'white', fontSize: 15, fontWeight: 600, textDecoration: 'none',
          }}>
            Browse Jobs <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#030a1a', display: 'flex' }}>

      {/* Left panel */}
      <div style={{
        flex: '0 0 420px',
        background: 'linear-gradient(180deg, #071230 0%, #0d1f4f 100%)',
        borderRight: '1px solid rgba(16,185,129,0.1)',
        padding: '60px 40px',
        display: 'flex', flexDirection: 'column',
      }} className="signup-left">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 48 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #059669, #10b981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <GraduationCap size={20} color="white" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>
            Connect<span style={{ color: '#10b981' }}>Grad</span>
          </span>
        </Link>

        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.3, marginBottom: 12 }}>
            Start your career journey today
          </h2>
          <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, marginBottom: 36 }}>
            Join thousands of students who found their dream internship or graduate role through ConnectGrad.
          </p>
          <ul style={{ listStyle: 'none' }}>
            {benefits.map(b => (
              <li key={b} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                fontSize: 13, color: '#94a3b8', marginBottom: 14, lineHeight: 1.5,
              }}>
                <CheckCircle size={15} color="#10b981" style={{ flexShrink: 0, marginTop: 1 }} />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div style={{
          marginTop: 40, padding: 20, borderRadius: 12,
          background: 'rgba(16,185,129,0.07)',
          border: '1px solid rgba(16,185,129,0.15)',
        }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #059669, #10b981)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: 'white',
            }}>Z</div>
            <div>
              <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginBottom: 6 }}>
                "Got my Google internship in London through ConnectGrad. The process was seamless."
              </p>
              <p style={{ fontSize: 11, color: '#64748b' }}>Zara Ahmed · Software Engineer at Google UK</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', minHeight: '100vh',
      }}>
        <div style={{ width: '100%', maxWidth: 480 }}>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36 }}>
            {[1, 2].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: step >= s ? 'linear-gradient(135deg, #059669, #10b981)' : 'rgba(255,255,255,0.06)',
                  border: step === s ? '2px solid #10b981' : '2px solid transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: step >= s ? 'white' : '#475569',
                }}>
                  {step > s ? '✓' : s}
                </div>
                <span style={{ fontSize: 13, color: step === s ? '#f1f5f9' : '#475569', fontWeight: step === s ? 600 : 400 }}>
                  {s === 1 ? 'Account' : 'Your Profile'}
                </span>
                {s < 2 && (
                  <div style={{ width: 40, height: 1, background: step > s ? '#10b981' : 'rgba(255,255,255,0.1)', marginLeft: 4 }} />
                )}
              </div>
            ))}
          </div>

          {/* Error banner */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '12px 16px', borderRadius: 10, marginBottom: 20,
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
            }}>
              <AlertCircle size={15} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 13, color: '#f87171', lineHeight: 1.5 }}>{error}</p>
            </div>
          )}

          {/* ── Step 1 ── */}
          {step === 1 && (
            <>
              <h2 style={{ fontSize: 26, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>Create your account</h2>
              <p style={{ fontSize: 14, color: '#64748b', marginBottom: 32 }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#10b981', textDecoration: 'none' }}>Log in</Link>
              </p>

              <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                {['Google', 'LinkedIn'].map(label => (
                  <button key={label} style={{
                    flex: 1, padding: '11px 0', borderRadius: 9, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#94a3b8', fontSize: 13, fontWeight: 500,
                  }}>
                    Continue with {label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                <span style={{ fontSize: 12, color: '#475569' }}>or with email</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
              </div>

              <form onSubmit={handleStep1}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <InputField label="First name" value={form.firstName} onChange={v => update('firstName', v)} placeholder="Ali" required />
                  <InputField label="Last name"  value={form.lastName}  onChange={v => update('lastName', v)}  placeholder="Khan" required />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <InputField label="Email address" type="email" value={form.email} onChange={v => update('email', v)} placeholder="ali@university.edu" required />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => update('password', e.target.value)}
                      placeholder="Min. 8 characters"
                      required minLength={8}
                      style={{ ...inputStyle, paddingRight: 42 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" style={submitBtnStyle(true)}>
                  Continue
                </button>
                <p style={{ fontSize: 12, color: '#475569', textAlign: 'center', marginTop: 16 }}>
                  By signing up you agree to our{' '}
                  <a href="#" style={{ color: '#64748b' }}>Terms</a> and{' '}
                  <a href="#" style={{ color: '#64748b' }}>Privacy Policy</a>
                </p>
              </form>
            </>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <>
              <h2 style={{ fontSize: 26, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>Tell us about yourself</h2>
              <p style={{ fontSize: 14, color: '#64748b', marginBottom: 32 }}>
                Help us find the best opportunities for you.
              </p>

              <form onSubmit={handleStep2}>
                <div style={{ marginBottom: 14 }}>
                  <InputField
                    label="University / Institution"
                    value={form.university}
                    onChange={v => update('university', v)}
                    placeholder="e.g. LUMS, University of Manchester, MIT"
                    required
                  />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <SelectField
                    label="Field of study"
                    value={form.field}
                    onChange={v => update('field', v)}
                    options={studyFields}
                    placeholder="Select your field"
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={labelStyle}>Graduation year</label>
                    <select
                      value={form.graduationYear}
                      onChange={e => update('graduationYear', e.target.value)}
                      required
                      style={{ ...inputStyle, color: form.graduationYear ? '#f1f5f9' : '#475569' }}
                    >
                      <option value="">Select year</option>
                      {[2025, 2026, 2027, 2028, 2029].map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <SelectField
                    label="Preferred region"
                    value={form.region}
                    onChange={v => update('region', v)}
                    options={['Pakistan', 'UK', 'USA', 'Europe', 'Open to all']}
                    placeholder="Select region"
                    required
                  />
                </div>

                <div style={{
                  padding: 16, borderRadius: 10, marginBottom: 24,
                  background: 'rgba(16,185,129,0.07)',
                  border: '1px solid rgba(16,185,129,0.15)',
                }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <Briefcase size={16} color="#10b981" style={{ marginTop: 1, flexShrink: 0 }} />
                    <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
                      Your profile is saved to your account. You can update preferences anytime.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(null) }}
                    disabled={loading}
                    style={{
                      flex: '0 0 100px', padding: '13px 0', borderRadius: 10,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#94a3b8', fontSize: 15, fontWeight: 500,
                      cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={submitBtnStyle(!loading)}
                  >
                    {loading
                      ? <><Loader size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> Creating account…</>
                      : 'Create my account'
                    }
                  </button>
                </div>
              </form>
            </>
          )}

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .signup-left { display: none !important; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const labelStyle = {
  fontSize: 13, fontWeight: 500, color: '#94a3b8', display: 'block', marginBottom: 7,
}

const inputStyle = {
  width: '100%', padding: '11px 14px', borderRadius: 9, boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#f1f5f9', fontSize: 14, outline: 'none',
}

const submitBtnStyle = (active) => ({
  flex: 1, width: '100%', padding: '13px 0', borderRadius: 10, border: 'none',
  background: active ? 'linear-gradient(135deg, #059669, #10b981)' : 'rgba(255,255,255,0.06)',
  color: active ? 'white' : '#475569',
  fontSize: 15, fontWeight: 700,
  cursor: active ? 'pointer' : 'not-allowed',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  boxShadow: active ? '0 0 24px rgba(16,185,129,0.3)' : 'none',
  transition: 'all 0.2s',
})

// ── Reusable fields ───────────────────────────────────────────────────────────

function InputField({ label, type = 'text', value, onChange, placeholder, required }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type} value={value} placeholder={placeholder} required={required}
        onChange={e => onChange(e.target.value)}
        style={inputStyle}
      />
    </div>
  )
}

function SelectField({ label, value, onChange, options, placeholder, required }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select
        value={value} required={required}
        onChange={e => onChange(e.target.value)}
        style={{ ...inputStyle, color: value ? '#f1f5f9' : '#475569' }}
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}
