import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, Eye, EyeOff, CheckCircle, ArrowRight, Briefcase } from 'lucide-react'

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

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
    university: '', field: '', graduationYear: '', region: '',
    agreeTerms: false,
  })
  const [submitted, setSubmitted] = useState(false)

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleStep1 = e => {
    e.preventDefault()
    setStep(2)
  }

  const handleStep2 = e => {
    e.preventDefault()
    setSubmitted(true)
  }

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
            Your account has been created. We have sent a verification link to <span style={{ color: '#10b981' }}>{form.email}</span>.
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

  return (
    <div style={{
      minHeight: '100vh',
      background: '#030a1a',
      display: 'flex',
    }}>
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
          marginTop: 40,
          padding: 20, borderRadius: 12,
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

      {/* Right panel – form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px',
        minHeight: '100vh',
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
                {s < 2 && <div style={{ width: 40, height: 1, background: step > s ? '#10b981' : 'rgba(255,255,255,0.1)', marginLeft: 4 }} />}
              </div>
            ))}
          </div>

          {step === 1 ? (
            <>
              <h2 style={{ fontSize: 26, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>Create your account</h2>
              <p style={{ fontSize: 14, color: '#64748b', marginBottom: 32 }}>
                Already have an account?{' '}
                <Link to="#" style={{ color: '#10b981', textDecoration: 'none' }}>Log in</Link>
              </p>

              {/* Social sign up */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                {['Continue with Google', 'Continue with LinkedIn'].map(label => (
                  <button key={label} style={{
                    flex: 1, padding: '11px 0', borderRadius: 9, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#94a3b8', fontSize: 13, fontWeight: 500,
                  }}>
                    {label.replace('Continue with ', '')}
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
                  <InputField label="Last name" value={form.lastName} onChange={v => update('lastName', v)} placeholder="Khan" required />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <InputField label="Email address" type="email" value={form.email} onChange={v => update('email', v)} placeholder="ali@university.edu" required />
                </div>
                <div style={{ marginBottom: 24, position: 'relative' }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: '#94a3b8', display: 'block', marginBottom: 7 }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => update('password', e.target.value)}
                      placeholder="Min. 8 characters"
                      required
                      minLength={8}
                      style={{
                        width: '100%', padding: '11px 42px 11px 14px', borderRadius: 9,
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#f1f5f9', fontSize: 14, outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex',
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" style={{
                  width: '100%', padding: '13px 0', borderRadius: 10,
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  border: 'none', cursor: 'pointer',
                  color: 'white', fontSize: 15, fontWeight: 700,
                  boxShadow: '0 0 24px rgba(16,185,129,0.35)',
                  marginBottom: 16,
                }}>
                  Continue
                </button>

                <p style={{ fontSize: 12, color: '#475569', textAlign: 'center' }}>
                  By signing up, you agree to our{' '}
                  <a href="#" style={{ color: '#64748b' }}>Terms</a> and{' '}
                  <a href="#" style={{ color: '#64748b' }}>Privacy Policy</a>
                </p>
              </form>
            </>
          ) : (
            <>
              <h2 style={{ fontSize: 26, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>Tell us about yourself</h2>
              <p style={{ fontSize: 14, color: '#64748b', marginBottom: 32 }}>
                Help us find the best opportunities for you.
              </p>

              <form onSubmit={handleStep2}>
                <div style={{ marginBottom: 14 }}>
                  <SelectField
                    label="University / Institution"
                    value={form.university}
                    onChange={v => update('university', v)}
                    options={universities}
                    placeholder="Select your university"
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
                    <label style={{ fontSize: 13, fontWeight: 500, color: '#94a3b8', display: 'block', marginBottom: 7 }}>
                      Graduation year
                    </label>
                    <select
                      value={form.graduationYear}
                      onChange={e => update('graduationYear', e.target.value)}
                      required
                      style={{
                        width: '100%', padding: '11px 14px', borderRadius: 9,
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: form.graduationYear ? '#f1f5f9' : '#475569', fontSize: 14, outline: 'none',
                      }}
                    >
                      <option value="">Select year</option>
                      {[2025, 2026, 2027, 2028, 2029].map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <SelectField
                      label="Preferred region"
                      value={form.region}
                      onChange={v => update('region', v)}
                      options={['Pakistan', 'UK', 'USA', 'Europe', 'Open to all']}
                      placeholder="Select region"
                      required
                    />
                  </div>
                </div>

                <div style={{
                  padding: 16, borderRadius: 10,
                  background: 'rgba(16,185,129,0.07)',
                  border: '1px solid rgba(16,185,129,0.15)',
                  marginBottom: 24,
                }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <Briefcase size={16} color="#10b981" style={{ marginTop: 1, flexShrink: 0 }} />
                    <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
                      You'll receive personalized job recommendations based on your profile. You can update these preferences anytime.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{
                      flex: '0 0 100px', padding: '13px 0', borderRadius: 10,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#94a3b8', fontSize: 15, fontWeight: 500, cursor: 'pointer',
                    }}
                  >
                    Back
                  </button>
                  <button type="submit" style={{
                    flex: 1, padding: '13px 0', borderRadius: 10,
                    background: 'linear-gradient(135deg, #059669, #10b981)',
                    border: 'none', cursor: 'pointer',
                    color: 'white', fontSize: 15, fontWeight: 700,
                    boxShadow: '0 0 24px rgba(16,185,129,0.35)',
                  }}>
                    Create my account
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .signup-left { display: none !important; }
        }
      `}</style>
    </div>
  )
}

function InputField({ label, type = 'text', value, onChange, placeholder, required }) {
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 500, color: '#94a3b8', display: 'block', marginBottom: 7 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        style={{
          width: '100%', padding: '11px 14px', borderRadius: 9,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#f1f5f9', fontSize: 14, outline: 'none',
          boxSizing: 'border-box',
        }}
      />
    </div>
  )
}

function SelectField({ label, value, onChange, options, placeholder, required }) {
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 500, color: '#94a3b8', display: 'block', marginBottom: 7 }}>{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        style={{
          width: '100%', padding: '11px 14px', borderRadius: 9,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: value ? '#f1f5f9' : '#475569', fontSize: 14, outline: 'none',
        }}
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}
