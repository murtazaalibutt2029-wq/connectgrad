import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, Loader, CheckCircle } from 'lucide-react'
import Logo from '../components/Logo'
import { supabase } from '../lib/supabase'

function friendlyError(msg) {
  if (!msg) return 'Something went wrong. Please try again.'
  if (msg.includes('Invalid login credentials'))
    return 'Incorrect email or password. Please try again.'
  if (msg.includes('Email not confirmed'))
    return 'Please verify your email before logging in.'
  if (msg.includes('Too many requests'))
    return 'Too many attempts. Please wait a few minutes and try again.'
  return msg
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(friendlyError(authError.message))
      setLoading(false)
      return
    }

    navigate('/jobs')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#030a1a', display: 'flex' }}>

      {/* Left panel */}
      <div style={{
        flex: '0 0 420px',
        background: 'linear-gradient(180deg, #071230 0%, #0d1f4f 100%)',
        borderRight: '1px solid rgba(99,102,241,0.1)',
        padding: '60px 40px',
        display: 'flex', flexDirection: 'column',
      }} className="login-left">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 48 }}>
          <Logo mini={true} size={36} />
        </Link>

        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.3, marginBottom: 12 }}>
            Welcome back
          </h2>
          <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, marginBottom: 40 }}>
            Log in to access your applications, saved jobs, and interview-ready resources.
          </p>

          {[
            'Track all your applications in one place',
            'Save notes, deadlines, and next steps for every role',
            'Find relevant student-friendly opportunities',
            'Build a stronger profile for graduate recruiters',
          ].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
              <CheckCircle size={15} color="#6366f1" style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 40, padding: 20, borderRadius: 12,
          background: 'rgba(99,102,241,0.07)',
          border: '1px solid rgba(99,102,241,0.15)',
        }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #6366f1, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: 'white',
            }}>O</div>
            <div>
              <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginBottom: 6 }}>
                "The application tracker alone is worth signing up for. Kept me sane during recruitment season."
              </p>
              <p style={{ fontSize: 11, color: '#64748b' }}>Omar Farooq · IB Analyst at Deutsche Bank</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel – form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>
            Log in to your account
          </h2>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 32 }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 500 }}>
              Sign up free
            </Link>
          </p>

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

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ali@university.edu"
                required
                autoComplete="email"
                style={inputStyle}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 8 }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  autoComplete="current-password"
                  style={{ ...inputStyle, paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#475569', display: 'flex',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div style={{ textAlign: 'right', marginBottom: 24 }}>
              <a href="#" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none' }}>
                Forgot your password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px 0', borderRadius: 10, border: 'none',
                background: loading ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #6366f1, #6366f1)',
                color: loading ? '#475569' : 'white',
                fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: loading ? 'none' : '0 0 24px rgba(99,102,241,0.3)',
                transition: 'all 0.2s',
              }}
            >
              {loading
                ? <><Loader size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> Signing in...</>
                : 'Log in'
              }
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ fontSize: 12, color: '#475569' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          </div>

          <Link to="/signup" style={{
            display: 'block', textAlign: 'center',
            padding: '12px 0', borderRadius: 10,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#94a3b8', fontSize: 14, fontWeight: 500, textDecoration: 'none',
          }}>
            Create a new account
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .login-left { display: none !important; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

const labelStyle = {
  fontSize: 13, fontWeight: 500, color: '#94a3b8', display: 'block', marginBottom: 7,
}

const inputStyle = {
  width: '100%', padding: '11px 14px', borderRadius: 9, boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#f1f5f9', fontSize: 14, outline: 'none',
}
