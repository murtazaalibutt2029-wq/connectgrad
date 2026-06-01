import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, MapPin, DollarSign, Clock, Calendar, Briefcase,
  Sparkles, Copy, Download, Check, Loader, RotateCcw, ChevronRight,
} from 'lucide-react'
import { jobs } from '../data/jobs'
import { generateCoverLetter } from '../utils/coverLetter'

const typeColors = {
  'Internship':    { bg: 'rgba(16,185,129,0.1)',  color: '#34d399', border: 'rgba(16,185,129,0.2)' },
  'Graduate Role': { bg: 'rgba(99,102,241,0.1)',  color: '#a5b4fc', border: 'rgba(99,102,241,0.2)' },
  'Full-time':     { bg: 'rgba(14,165,233,0.1)',  color: '#7dd3fc', border: 'rgba(14,165,233,0.2)' },
  'Part-time':     { bg: 'rgba(245,158,11,0.1)',  color: '#fcd34d', border: 'rgba(245,158,11,0.2)' },
}

// ─── Cover Letter Generator ───────────────────────────────────────────────────

function CoverLetterGenerator({ job }) {
  const [stage, setStage]       = useState('idle')   // idle | form | loading | done
  const [copied, setCopied]     = useState(false)
  const [letter, setLetter]     = useState('')
  const [form, setForm]         = useState({ name: '', university: '', degree: '', motivation: '' })

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const filled = form.name && form.university && form.degree

  const handleGenerate = e => {
    e.preventDefault()
    setStage('loading')
    // Simulate a brief generation delay for UX realism
    setTimeout(() => {
      setLetter(generateCoverLetter({ job, ...form }))
      setStage('done')
    }, 1600)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(letter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([letter], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `Cover Letter — ${job.title} at ${job.company}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── Idle ──────────────────────────────────────────────────────────────────
  if (stage === 'idle') {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(16,185,129,0.15)',
        borderRadius: 20, overflow: 'hidden',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(5,150,105,0.04))',
          padding: '32px 28px',
          borderBottom: '1px solid rgba(16,185,129,0.1)',
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
          }}>
            <Sparkles size={22} color="#10b981" />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>
            AI Cover Letter Generator
          </h3>
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>
            Generate a professional, tailored cover letter for this role in seconds. Just fill in a few details about yourself.
          </p>
        </div>
        <div style={{ padding: '20px 28px' }}>
          <ul style={{ listStyle: 'none', marginBottom: 24 }}>
            {[
              'Tailored to this specific role and company',
              'Incorporates your skills and motivation',
              'Professional tone, ready to personalise',
              'Copy or download as a text file',
            ].map(item => (
              <li key={item} style={{ display: 'flex', gap: 10, fontSize: 13, color: '#94a3b8', marginBottom: 10, alignItems: 'flex-start' }}>
                <Check size={14} color="#10b981" style={{ flexShrink: 0, marginTop: 1 }} />
                {item}
              </li>
            ))}
          </ul>
          <button
            onClick={() => setStage('form')}
            style={{
              width: '100%', padding: '13px 0', borderRadius: 11,
              background: 'linear-gradient(135deg, #059669, #10b981)',
              border: 'none', cursor: 'pointer',
              color: 'white', fontSize: 15, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 0 24px rgba(16,185,129,0.3)',
            }}
          >
            <Sparkles size={16} /> Generate AI Cover Letter
          </button>
        </div>
      </div>
    )
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  if (stage === 'form') {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(16,185,129,0.15)',
        borderRadius: 20, overflow: 'hidden',
      }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Sparkles size={16} color="#10b981" />
          <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>Your details</span>
        </div>
        <form onSubmit={handleGenerate} style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
            <Field label="Full name *" value={form.name} onChange={v => update('name', v)} placeholder="e.g. Ali Hassan" />
            <Field label="University *" value={form.university} onChange={v => update('university', v)} placeholder="e.g. LUMS / University of Manchester" />
            <Field label="Degree *" value={form.degree} onChange={v => update('degree', v)} placeholder="e.g. BSc Computer Science" />
            <div>
              <label style={labelStyle}>Why do you want this role?</label>
              <textarea
                value={form.motivation}
                onChange={e => update('motivation', e.target.value)}
                placeholder={`e.g. I'm passionate about ${job.tags[0]} and want to work on products at ${job.company}'s scale...`}
                rows={3}
                style={{
                  ...inputStyle,
                  resize: 'vertical', minHeight: 80, lineHeight: 1.6,
                }}
              />
              <p style={{ fontSize: 11, color: '#475569', marginTop: 5 }}>
                Optional — but the more you share, the more personalised your letter will be.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={() => setStage('idle')}
              style={{
                flex: '0 0 80px', padding: '11px 0', borderRadius: 9,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#64748b', fontSize: 14, cursor: 'pointer',
              }}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!filled}
              style={{
                flex: 1, padding: '11px 0', borderRadius: 9,
                background: filled ? 'linear-gradient(135deg, #059669, #10b981)' : 'rgba(255,255,255,0.05)',
                border: 'none', cursor: filled ? 'pointer' : 'not-allowed',
                color: filled ? 'white' : '#475569', fontSize: 14, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                boxShadow: filled ? '0 0 20px rgba(16,185,129,0.3)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              <Sparkles size={14} /> Generate Letter
            </button>
          </div>
        </form>
      </div>
    )
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (stage === 'loading') {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(16,185,129,0.15)',
        borderRadius: 20, padding: '56px 28px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: 'rgba(16,185,129,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'pulse 1.2s ease-in-out infinite',
        }}>
          <Sparkles size={24} color="#10b981" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginBottom: 6 }}>Generating your cover letter…</p>
          <p style={{ fontSize: 13, color: '#64748b' }}>Tailoring it to {job.company} and your profile</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 7, height: 7, borderRadius: '50%', background: '#10b981',
              animation: `bounce 0.8s ease-in-out ${i * 0.15}s infinite`,
            }} />
          ))}
        </div>
      </div>
    )
  }

  // ── Done ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(16,185,129,0.2)',
      borderRadius: 20, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        background: 'rgba(16,185,129,0.06)',
        borderBottom: '1px solid rgba(16,185,129,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Check size={15} color="#10b981" />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#34d399' }}>Cover letter generated</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <ActionBtn icon={<RotateCcw size={13} />} label="Regenerate" onClick={() => setStage('form')} />
          <ActionBtn icon={copied ? <Check size={13} /> : <Copy size={13} />} label={copied ? 'Copied!' : 'Copy'} onClick={handleCopy} primary={copied} />
          <ActionBtn icon={<Download size={13} />} label="Download" onClick={handleDownload} />
        </div>
      </div>

      {/* Letter text */}
      <div style={{ padding: '20px 24px', maxHeight: 520, overflowY: 'auto' }}>
        <pre style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontSize: 13.5, lineHeight: 1.9, color: '#cbd5e1',
          whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0,
        }}>
          {letter}
        </pre>
      </div>

      {/* Footer tip */}
      <div style={{
        padding: '12px 20px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(255,255,255,0.01)',
      }}>
        <p style={{ fontSize: 11, color: '#475569' }}>
          Tip: Review and personalise before sending — add specific examples from your projects or experience to make it uniquely yours.
        </p>
      </div>
    </div>
  )
}

function ActionBtn({ icon, label, onClick, primary }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 5,
      padding: '6px 11px', borderRadius: 7, border: 'none', cursor: 'pointer',
      background: primary ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
      color: primary ? '#34d399' : '#94a3b8',
      fontSize: 12, fontWeight: 500,
    }}>
      {icon}{label}
    </button>
  )
}

const labelStyle = { fontSize: 13, fontWeight: 500, color: '#94a3b8', display: 'block', marginBottom: 7 }
const inputStyle = {
  width: '100%', padding: '10px 13px', borderRadius: 8, boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  color: '#f1f5f9', fontSize: 14, outline: 'none',
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  )
}

// ─── Job Detail Page ──────────────────────────────────────────────────────────

export default function JobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const job = jobs.find(j => j.id === Number(id))

  if (!job) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 24px', background: '#030a1a', minHeight: '60vh' }}>
        <p style={{ fontSize: 48, marginBottom: 16 }}>🔍</p>
        <h2 style={{ fontSize: 22, color: '#f1f5f9', marginBottom: 12 }}>Job not found</h2>
        <Link to="/jobs" style={{ color: '#10b981', fontSize: 14 }}>← Back to Jobs</Link>
      </div>
    )
  }

  const tc = typeColors[job.type] || typeColors['Full-time']

  return (
    <div style={{ background: '#030a1a', minHeight: '100vh' }}>
      {/* Top bar */}
      <div style={{
        background: '#071230',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '16px 24px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 14, color: '#64748b', padding: 0,
            }}
          >
            <ArrowLeft size={15} /> Back to jobs
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }} className="job-detail-layout">

          {/* ── Left: job details ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Header card */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${job.featured ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 20, padding: 28, marginBottom: 20,
              position: 'relative', overflow: 'hidden',
            }}>
              {job.featured && (
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  fontSize: 10, fontWeight: 700, color: 'white',
                  padding: '5px 14px', borderRadius: '0 20px 0 10px', letterSpacing: 0.5,
                }}>FEATURED</div>
              )}

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 16, flexShrink: 0,
                  background: job.logoColor ? `${job.logoColor}22` : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${job.logoColor ? `${job.logoColor}44` : 'rgba(255,255,255,0.08)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, fontWeight: 800, color: job.logoColor || '#94a3b8',
                }}>
                  {job.logo}
                </div>
                <div style={{ flex: 1 }}>
                  <h1 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.4px', marginBottom: 6, lineHeight: 1.2 }}>
                    {job.title}
                  </h1>
                  <p style={{ fontSize: 16, color: '#94a3b8', fontWeight: 500 }}>{job.company}</p>
                </div>
                <div style={{
                  padding: '6px 14px', borderRadius: 8,
                  background: tc.bg, border: `1px solid ${tc.border}`,
                  fontSize: 12, fontWeight: 700, color: tc.color, whiteSpace: 'nowrap',
                }}>
                  {job.type}
                </div>
              </div>

              {/* Meta grid */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                {[
                  { icon: MapPin, label: job.location },
                  { icon: DollarSign, label: job.salary },
                  { icon: Calendar, label: `Deadline: ${job.deadline}` },
                  { icon: Clock, label: `Posted ${job.posted}` },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#64748b' }}>
                    <Icon size={14} color="#475569" />{label}
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16, padding: '20px 24px', marginBottom: 20,
            }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
                Skills & Technologies
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {job.tags.map(tag => (
                  <span key={tag} style={{
                    padding: '6px 14px', borderRadius: 8,
                    background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.15)',
                    fontSize: 13, color: '#34d399', fontWeight: 500,
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16, padding: '20px 24px', marginBottom: 20,
            }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
                About the Role
              </h2>
              <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.9 }}>
                {job.description}
              </p>
              {/* Extended description padding */}
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.9, marginTop: 14 }}>
                This is an exciting opportunity for a motivated student or recent graduate looking to kick-start their career at {job.company}. You will work alongside experienced professionals, take on real responsibilities, and develop the skills and network to build a successful career. The ideal candidate is intellectually curious, eager to learn, and ready to contribute from day one.
              </p>
            </div>

            {/* What you'll gain */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16, padding: '20px 24px',
            }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
                What You'll Gain
              </h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Hands-on experience with real projects and real responsibilities',
                  `Work directly with senior professionals at ${job.company}`,
                  `Build expertise in ${job.tags.slice(0,2).join(' and ')}`,
                  'Strong CV entry from a recognised employer',
                  'Structured mentorship and regular performance feedback',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: '#94a3b8' }}>
                    <ChevronRight size={14} color="#10b981" style={{ marginTop: 1, flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Right: cover letter generator (sticky) ── */}
          <div style={{ width: 380, flexShrink: 0 }} className="job-detail-sidebar">
            <div style={{ position: 'sticky', top: 86 }}>
              <CoverLetterGenerator job={job} />

              {/* Apply now CTA */}
              <div style={{
                marginTop: 16, padding: '18px 20px', borderRadius: 16,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12, textAlign: 'center' }}>
                  Deadline: <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{job.deadline}</span>
                </p>
                <button style={{
                  width: '100%', padding: '12px 0', borderRadius: 10,
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  border: 'none', cursor: 'pointer',
                  color: 'white', fontSize: 14, fontWeight: 700,
                  boxShadow: '0 0 20px rgba(16,185,129,0.3)',
                }}>
                  Apply on {job.company}'s site
                </button>
                <Link to="/jobs" style={{
                  display: 'block', textAlign: 'center', marginTop: 10,
                  fontSize: 13, color: '#64748b', textDecoration: 'none',
                }}>
                  ← Back to all jobs
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes pulse  { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.7; transform:scale(0.95); } }
        @keyframes bounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
        @media (max-width: 860px) {
          .job-detail-layout   { flex-direction: column !important; }
          .job-detail-sidebar  { width: 100% !important; }
        }
      `}</style>
    </div>
  )
}
