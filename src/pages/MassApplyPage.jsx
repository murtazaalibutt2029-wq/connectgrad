import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  CheckCircle, Loader, AlertCircle, ChevronDown, ChevronUp,
  FileText, Upload, Link as LinkIcon, HelpCircle, Edit3,
  Send, ArrowLeft, Sparkles, User, RotateCcw,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { addApplications } from '../utils/applications'
import { supabase } from '../lib/supabase'

// ── helpers ───────────────────────────────────────────────────────────────────

async function genLetter(job, profile) {
  const res = await fetch('/api/generate-cover-letter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      job,
      name:       `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
      university:  profile.university !== 'Other' ? (profile.university || '') : '',
      degree:      profile.field_of_study || '',
      motivation:  profile.career_goals || '',
      skills:      profile.skills || '',
      profile,
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data.letter
}

async function genAnswers(job, profile) {
  if (!job.requirements?.customQuestions?.length) return []
  const res = await fetch('/api/generate-application-answers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ job, questions: job.requirements.customQuestions, profile }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data.answers
}

// ── status pill ───────────────────────────────────────────────────────────────

function StatusPill({ status }) {
  const map = {
    pending:     { label: 'Pending',     color: '#475569', bg: 'rgba(71,85,105,0.15)'  },
    generating:  { label: 'Generating…', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    done:        { label: 'Ready',       color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    error:       { label: 'Error',       color: '#f87171', bg: 'rgba(239,68,68,0.12)'  },
  }
  const { label, color, bg } = map[status] || map.pending
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6,
      background: bg, color,
    }}>
      {status === 'generating' && <Loader size={10} style={{ animation: 'spin 0.8s linear infinite', marginRight: 4, verticalAlign: 'middle' }} />}
      {label}
    </span>
  )
}

// ── individual job review card ────────────────────────────────────────────────

function JobReviewCard({ item, index, onUpdate, onRetry }) {
  const [open, setOpen]   = useState(true)
  const [tab, setTab]     = useState('letter') // letter | custom
  const req = item.job.requirements || {}
  const hasCustomQ = req.customQuestions?.length > 0

  if (item.status === 'error') {
    return (
      <div style={{
        borderRadius: 16, overflow: 'hidden',
        border: '1px solid rgba(239,68,68,0.25)',
        background: 'rgba(239,68,68,0.05)', marginBottom: 16,
      }}>
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <AlertCircle size={16} color="#f87171" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#f87171' }}>
              {item.job.company} — {item.job.title}
            </span>
            <span style={{ display: 'block', fontSize: 12, color: '#64748b', marginTop: 2 }}>{item.error}</span>
          </div>
          <button
            onClick={() => onRetry(item.job.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
              color: '#f87171', fontSize: 13, fontWeight: 600, flexShrink: 0,
            }}
          >
            <RotateCcw size={12} /> Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      borderRadius: 16, overflow: 'hidden',
      border: `1px solid ${item.status === 'done' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.07)'}`,
      background: 'rgba(255,255,255,0.02)', marginBottom: 16,
    }}>
      {/* Card header */}
      <div
        onClick={() => item.status === 'done' && setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '16px 20px',
          background: 'rgba(255,255,255,0.02)',
          borderBottom: open && item.status === 'done' ? '1px solid rgba(255,255,255,0.06)' : 'none',
          cursor: item.status === 'done' ? 'pointer' : 'default',
        }}
      >
        <div style={{
          width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
          background: `#${index * 3 + 4}b5cf`,
          fontSize: 13, fontWeight: 800,
        }} />
        <div style={{
          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          background: item.job.logoColor ? `${item.job.logoColor}22` : 'rgba(255,255,255,0.05)',
          border: `1px solid ${item.job.logoColor ? `${item.job.logoColor}33` : 'rgba(255,255,255,0.08)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, fontWeight: 800, color: item.job.logoColor || '#94a3b8',
        }}>
          {item.job.logo}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{item.job.title}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>{item.job.company} · {item.job.location}</div>
        </div>
        <StatusPill status={item.status} />
        {item.status === 'done' && (open ? <ChevronUp size={16} color="#475569" /> : <ChevronDown size={16} color="#475569" />)}
      </div>

      {/* Expanded content */}
      {open && item.status === 'done' && (
        <div style={{ padding: '20px' }}>
          {/* Requirements checklist */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
              Requirements
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <ReqChip icon={FileText} label="Cover Letter" done />
              <ReqChip icon={Upload} label="CV / Resume" done={!!item.cvUrl} />
              {req.portfolio && (
                <ReqChip icon={LinkIcon} label="Portfolio" done={!!item.portfolioUrl} />
              )}
              {hasCustomQ && (
                <ReqChip icon={HelpCircle} label={`${req.customQuestions.length} Custom Q${req.customQuestions.length > 1 ? 's' : ''}`} done />
              )}
            </div>
          </div>

          {/* CV status */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>CV / Resume</label>
            {item.cvUrl ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 9, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <FileText size={14} color="#10b981" />
                <span style={{ fontSize: 13, color: '#34d399', flex: 1 }}>Resume attached</span>
                <a href={item.cvUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#64748b', textDecoration: 'none' }}>View</a>
                <button type="button" onClick={() => onUpdate(item.job.id, 'cvUrl', '')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', fontSize: 11 }}>
                  Change
                </button>
              </div>
            ) : (
              <div style={{ padding: '10px 14px', borderRadius: 9, background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', fontSize: 13, color: '#fcd34d' }}>
                No resume attached — save one to your <a href="/profile" style={{ color: '#f59e0b' }}>profile</a> to auto-populate.
              </div>
            )}
          </div>

          {/* Portfolio link input */}
          {req.portfolio && (
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>{req.portfolioLabel || 'Portfolio URL'}</label>
              <input
                value={item.portfolioUrl || ''}
                onChange={e => onUpdate(item.job.id, 'portfolioUrl', e.target.value)}
                placeholder="https://..."
                style={inputStyle}
              />
            </div>
          )}

          {/* Tabs when there are custom questions */}
          {hasCustomQ && (
            <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
              {['letter', 'custom'].map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: tab === t ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.04)',
                    color: tab === t ? '#10b981' : '#64748b',
                    fontSize: 13, fontWeight: tab === t ? 600 : 400,
                  }}
                >
                  {t === 'letter' ? 'Cover Letter' : `Custom Questions (${req.customQuestions.length})`}
                </button>
              ))}
            </div>
          )}

          {/* Cover letter */}
          {(!hasCustomQ || tab === 'letter') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={labelStyle}>Cover Letter</label>
                <span style={{ fontSize: 11, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Edit3 size={10} /> Editable
                </span>
              </div>
              <textarea
                value={item.coverLetter}
                onChange={e => onUpdate(item.job.id, 'coverLetter', e.target.value)}
                rows={14}
                style={{
                  ...inputStyle,
                  fontFamily: "'Georgia', serif", fontSize: 13, lineHeight: 1.8,
                  resize: 'vertical', minHeight: 320,
                }}
              />
            </div>
          )}

          {/* Custom Q&A */}
          {hasCustomQ && tab === 'custom' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {item.customAnswers.map((qa, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: 5, flexShrink: 0, marginTop: 1,
                      background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700, color: '#10b981',
                    }}>
                      {i + 1}
                    </div>
                    <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500, lineHeight: 1.6 }}>{qa.question}</p>
                  </div>
                  <textarea
                    value={qa.answer}
                    onChange={e => {
                      const updated = item.customAnswers.map((a, j) => j === i ? { ...a, answer: e.target.value } : a)
                      onUpdate(item.job.id, 'customAnswers', updated)
                    }}
                    rows={5}
                    style={{ ...inputStyle, fontSize: 13, lineHeight: 1.7, resize: 'vertical' }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ReqChip({ icon: Icon, label, done, note }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '5px 11px', borderRadius: 7,
      background: done ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
      border: `1px solid ${done ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`,
      fontSize: 12, color: done ? '#34d399' : '#fcd34d',
    }} title={note}>
      {done ? <CheckCircle size={12} /> : <Icon size={12} />}
      {label}
    </div>
  )
}

// ── main page ─────────────────────────────────────────────────────────────────

export default function MassApplyPage() {
  const { session, profile, loading: authLoading } = useAuth()
  const location = useLocation()
  const navigate  = useNavigate()
  const started   = useRef(false)

  const selectedJobs = location.state?.jobs || []

  const [items, setItems] = useState(
    selectedJobs.map(job => ({
      job,
      status:        'pending',
      coverLetter:   '',
      customAnswers: [],
      portfolioUrl:  '',
      cvUrl:         '',   // seeded from profile.resume_url once profile loads
      error:         '',
    }))
  )
  const [phase, setPhase] = useState('generating') // generating | review | submitting | done

  // Seed cvUrl from profile resume once available
  useEffect(() => {
    if (profile?.resume_url) {
      setItems(prev => prev.map(it => ({ ...it, cvUrl: it.cvUrl || profile.resume_url })))
    }
  }, [profile?.resume_url])

  useEffect(() => {
    if (!authLoading && !session) navigate('/login')
  }, [session, authLoading])

  useEffect(() => {
    if (!authLoading && !selectedJobs.length) navigate('/jobs')
  }, [authLoading])

  // Start generation once profile is available
  useEffect(() => {
    if (authLoading || !profile || started.current) return
    started.current = true

    const generate = async () => {
      const tasks = selectedJobs.map(async (job, i) => {
        setItems(prev => prev.map((it, idx) => idx === i ? { ...it, status: 'generating' } : it))

        try {
          const [letter, answers] = await Promise.all([
            genLetter(job, profile),
            genAnswers(job, profile),
          ])
          setItems(prev => prev.map((it, idx) =>
            idx === i ? { ...it, status: 'done', coverLetter: letter, customAnswers: answers } : it
          ))
        } catch (err) {
          setItems(prev => prev.map((it, idx) =>
            idx === i ? { ...it, status: 'error', error: err.message } : it
          ))
        }
      })

      await Promise.allSettled(tasks)
      setPhase('review')
    }

    generate()
  }, [authLoading, profile])

  const updateItem = (jobId, field, value) => {
    setItems(prev => prev.map(it => it.job.id === jobId ? { ...it, [field]: value } : it))
  }

  const retryJob = async (jobId) => {
    const jobItem = items.find(it => it.job.id === jobId)
    if (!jobItem || !profile) return
    setItems(prev => prev.map(it => it.job.id === jobId ? { ...it, status: 'generating', error: '' } : it))
    try {
      const [letter, answers] = await Promise.all([
        genLetter(jobItem.job, profile),
        genAnswers(jobItem.job, profile),
      ])
      setItems(prev => prev.map(it =>
        it.job.id === jobId ? { ...it, status: 'done', coverLetter: letter, customAnswers: answers } : it
      ))
    } catch (err) {
      setItems(prev => prev.map(it =>
        it.job.id === jobId ? { ...it, status: 'error', error: err.message } : it
      ))
    }
  }

  const handleSubmit = async () => {
    setPhase('submitting')
    const readyItems = items.filter(it => it.status === 'done')

    // Save to Supabase applications table
    if (session) {
      await Promise.allSettled(readyItems.map(it =>
        supabase.from('applications').insert({
          user_id:              session.user.id,
          job_id:               it.job.id,
          job_title:            it.job.title,
          company:              it.job.company,
          cover_letter:         it.coverLetter,
          cv_url:               it.cvUrl || profile?.resume_url || null,
          status:               'pending',
          applicant_name:       `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim(),
          applicant_university: profile?.university !== 'Other' ? (profile?.university || '') : '',
          applicant_degree:     profile?.field_of_study || '',
        })
      ))
    }

    // Also track locally in the applications tracker
    addApplications(readyItems.map(it => it.job))
    navigate('/tracker')
  }

  const doneCount  = items.filter(i => i.status === 'done').length
  const totalCount = items.length
  const allDone    = doneCount === totalCount

  if (authLoading || !profile) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader size={24} color="#10b981" style={{ animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ background: '#030a1a', minHeight: '100vh' }}>
      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 68, zIndex: 40,
        background: 'rgba(3,10,26,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '14px 24px',
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => navigate('/jobs')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, padding: 0 }}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>
              Review Applications
            </span>
            <span style={{ fontSize: 13, color: '#64748b', marginLeft: 10 }}>
              {phase === 'generating'
                ? `Generating… ${doneCount}/${totalCount}`
                : `${doneCount} of ${totalCount} ready`}
            </span>
          </div>

          {/* Profile pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '5px 12px', borderRadius: 8,
            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)',
            fontSize: 12, color: '#34d399',
          }}>
            <User size={12} />
            {profile.first_name} {profile.last_name} · {profile.university}
          </div>

          {phase === 'review' && (
            <button
              onClick={handleSubmit}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #059669, #10b981)',
                color: 'white', fontSize: 14, fontWeight: 700,
                boxShadow: '0 0 20px rgba(16,185,129,0.3)',
              }}
            >
              <Send size={14} /> Submit {doneCount} Application{doneCount !== 1 ? 's' : ''}
            </button>
          )}

          {phase === 'submitting' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 14, color: '#10b981', fontWeight: 600 }}>
              <Loader size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Submitting…
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px 80px' }}>
        {/* Generation progress banner */}
        {phase === 'generating' && (
          <div style={{
            padding: '16px 20px', borderRadius: 14, marginBottom: 28,
            background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <Sparkles size={18} color="#10b981" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginBottom: 6 }}>
                Generating tailored applications…
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {items.map(it => (
                  <div key={it.job.id} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748b' }}>
                    {it.status === 'done'    && <CheckCircle size={12} color="#10b981" />}
                    {it.status === 'generating' && <Loader size={12} color="#f59e0b" style={{ animation: 'spin 0.8s linear infinite' }} />}
                    {it.status === 'pending' && <div style={{ width: 12, height: 12, borderRadius: '50%', border: '1.5px solid #475569' }} />}
                    {it.status === 'error'   && <AlertCircle size={12} color="#f87171" />}
                    {it.job.company}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Instructions (review phase) */}
        {phase === 'review' && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#10b981', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>
              Review & edit before submitting
            </p>
            <p style={{ fontSize: 14, color: '#64748b' }}>
              Each cover letter and answer set has been tailored to the specific role. Review, edit, and add any missing details before submitting.
            </p>
          </div>
        )}

        {/* Job cards */}
        {items.map((item, i) => (
          <JobReviewCard key={item.job.id} item={item} index={i} onUpdate={updateItem} onRetry={retryJob} />
        ))}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

const labelStyle = { fontSize: 13, fontWeight: 500, color: '#94a3b8', display: 'block', marginBottom: 7 }
const inputStyle = {
  width: '100%', padding: '11px 14px', borderRadius: 9, boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  color: '#f1f5f9', fontSize: 14, outline: 'none',
}
