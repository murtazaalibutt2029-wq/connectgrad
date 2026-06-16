import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader, Download, ChevronDown, ChevronUp, Bell, Briefcase, FileText, CheckCircle, XCircle, Clock, PlusCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const STATUS_STYLES = {
  pending:     { label: 'Pending',     color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
  shortlisted: { label: 'Shortlisted', color: '#6366f1', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.28)' },
  interview:   { label: 'Interview',   color: '#6366f1', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.25)' },
  rejected:    { label: 'Rejected',    color: '#f87171', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)' },
}

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
      {s.label}
    </span>
  )
}

function ApplicationCard({ app, onStatusChange }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14, overflow: 'hidden', marginBottom: 12,
    }}>
      {/* Summary row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', flexWrap: 'wrap' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #071230, #0d1f4f)',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: '#6366f1',
        }}>
          {(app.applicant_name || '?').charAt(0).toUpperCase()}
        </div>

        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{app.applicant_name || 'Unknown'}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>
            {app.applicant_university || '-'}{app.applicant_degree ? ` · ${app.applicant_degree}` : ''}
          </div>
        </div>

        <div style={{ minWidth: 160 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>{app.job_title}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>{app.company}</div>
        </div>

        <div style={{ fontSize: 12, color: '#475569', minWidth: 90 }}>
          {new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>

        <StatusBadge status={app.status} />

        {/* Status selector */}
        <select
            value={app.status}
            onChange={e => onStatusChange(app.id, e.target.value)}
            onClick={e => e.stopPropagation()}
            style={{
              padding: '5px 10px', borderRadius: 7, fontSize: 12,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#f1f5f9', cursor: 'pointer', outline: 'none',
            }}
          >
            <option value="pending">Pending</option>
            <option value="interview">Interview</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
          </select>
        {app.cv_url && (
          <a href={app.cv_url} target="_blank" rel="noopener noreferrer" style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 500,
            background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)',
            color: '#93c5fd', textDecoration: 'none',
          }}>
            <Download size={12} /> CV
          </a>
        )}

        <button
          onClick={() => setExpanded(p => !p)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? 'Hide' : 'View'} letter
        </button>
      </div>

      {/* Cover letter */}
      {expanded && (
        <div style={{
          padding: '16px 20px 20px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(255,255,255,0.01)',
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Cover Letter</p>
          <pre style={{
            fontFamily: "'Georgia', serif", fontSize: 12.5, color: '#94a3b8',
            lineHeight: 1.85, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10, padding: '16px 18px', margin: 0,
          }}>
            {app.cover_letter || 'No cover letter provided.'}
          </pre>
        </div>
      )}
    </div>
  )
}

export default function EmployerDashboard() {
  const { session, loading } = useAuth()
  const navigate = useNavigate()
  const [apps, setApps]         = useState([])
  const [postedJobs, setPostedJobs] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loadingNotifications, setLoadingNotifications] = useState(true)
  const [fetching, setFetching] = useState(true)
  const [filter, setFilter]     = useState('all')

  useEffect(() => { if (!loading && !session) navigate('/login') }, [session, loading, navigate])

  useEffect(() => {
    if (!session) return
    const fetchEmployerData = async () => {
      const [applicationsRes, jobsRes, notificationsRes] = await Promise.all([
        supabase.from('applications').select('*').order('created_at', { ascending: false }),
        supabase.from('jobs').select('*').eq('employer_id', session.user.id).order('created_at', { ascending: false }),
        supabase.from('notifications').select('*').eq('recipient_id', session.user.id).order('created_at', { ascending: false }),
      ])

      setApps(applicationsRes.data || [])
      setPostedJobs(jobsRes.data || [])
      setNotifications(notificationsRes.data || [])
      setFetching(false)
      setLoadingNotifications(false)
    }

    fetchEmployerData()
  }, [session])

  const updateStatus = async (id, status) => {
    const app = apps.find(a => a.id === id)
    if (!app) return

    await supabase.from('applications').update({ status }).eq('id', id)
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a))

    if (!app.user_id) return

    const messageMap = {
      pending: `Your application for ${app.job_title} at ${app.company} is listed as pending with the employer.`,
      interview: `Good news - ${app.company} wants to schedule an interview for ${app.job_title}. Check your ConnectGrad tracker for details.`,
      shortlisted: `Your application for ${app.job_title} at ${app.company} has been shortlisted. You are moving to the next stage.`,
      rejected: `Your application for ${app.job_title} at ${app.company} has been declined. Keep applying - the right role is ahead.`,
    }

    await supabase.from('notifications').insert({
      recipient_id: app.user_id,
      title: `Application ${STATUS_STYLES[status]?.label ?? 'Update'}`,
      message: messageMap[status] || `Your application for ${app.job_title} at ${app.company} is now ${status}.`,
      is_read: false,
    })
  }

  const markAllNotificationsRead = async () => {
    if (!session) return
    await supabase.from('notifications').update({ is_read: true }).eq('recipient_id', session.user.id)
    setNotifications(prev => prev.map(note => ({ ...note, is_read: true })))
  }

  const counts = {
    all:         apps.length,
    pending:     apps.filter(a => a.status === 'pending').length,
    interview:   apps.filter(a => a.status === 'interview').length,
    shortlisted: apps.filter(a => a.status === 'shortlisted').length,
    rejected:    apps.filter(a => a.status === 'rejected').length,
  }

  const displayed = filter === 'all' ? apps : apps.filter(a => a.status === filter)

  if (loading || fetching) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#030a1a' }}>
      <Loader size={24} color="#6366f1" style={{ animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ background: '#030a1a', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(180deg, #071230 0%, #030a1a 100%)', padding: '48px 24px 40px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#6366f1', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Employer Portal</p>
              <h1 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.8px', marginBottom: 14 }}>
                Applications Dashboard
              </h1>
              <p style={{ fontSize: 15, color: '#94a3b8', maxWidth: 640 }}>Your job posting flow should feel fast, polished, and rewarding. Keep top graduate talent engaged and manage their applications from a single dashboard.</p>
            </div>
            <button
              onClick={() => navigate('/employer/post-job')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 22px', borderRadius: 14, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #6366f1, #6366f1)', color: 'white', fontSize: 15, fontWeight: 700,
                boxShadow: '0 18px 40px rgba(99,102,241,0.18)',
              }}
            >
              <Briefcase size={16} /> Post a job
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, marginTop: 28 }}>
            <div style={{ padding: 20, borderRadius: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>Active postings</p>
              <p style={{ fontSize: 32, fontWeight: 800, color: '#f1f5f9' }}>{postedJobs.length}</p>
            </div>
            <div style={{ padding: 20, borderRadius: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>New applicants</p>
              <p style={{ fontSize: 32, fontWeight: 800, color: '#f1f5f9' }}>{apps.length}</p>
            </div>
            <div style={{ padding: 20, borderRadius: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>Live roles</p>
              <p style={{ fontSize: 32, fontWeight: 800, color: '#f1f5f9' }}>{postedJobs.filter(job => !job.is_external).length}</p>
            </div>
          </div>

          <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ padding: 20, borderRadius: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>Why post here?</p>
              <ul style={{ listStyle: 'inside disc', color: '#94a3b8', lineHeight: 1.8, margin: 0, paddingLeft: 12 }}>
                <li>Attract motivated graduates in Pakistan, UK, USA and Europe.</li>
                <li>Receive applications from candidates with polished profiles and generated letters.</li>
                <li>Keep the entire hiring pipeline visible inside ConnectGrad.</li>
              </ul>
            </div>
            <div style={{ padding: 20, borderRadius: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>Latest job preview</p>
              {postedJobs[0] ? (
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>{postedJobs[0].title}</p>
                  <p style={{ fontSize: 13, color: '#64748b', marginBottom: 10 }}>{postedJobs[0].company} · {postedJobs[0].region}</p>
                  <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>{postedJobs[0].description.slice(0, 120)}{postedJobs[0].description.length > 120 ? '...' : ''}</p>
                </div>
              ) : (
                <p style={{ fontSize: 13, color: '#64748b' }}>No jobs posted yet. Create your first role to start receiving qualified applicants.</p>
              )}
            </div>
          </div>

          {/* Stat chips */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { key: 'all',         label: 'All',         icon: Briefcase, color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
              { key: 'pending',     label: 'Pending',     icon: Clock,     color: '#f59e0b', bg: 'rgba(245,158,11,0.16)' },
              { key: 'interview',   label: 'Interview',   icon: Clock,     color: '#6366f1', bg: 'rgba(99,102,241,0.16)' },
              { key: 'shortlisted', label: 'Shortlisted', icon: CheckCircle, color: '#6366f1', bg: 'rgba(99,102,241,0.16)' },
              { key: 'rejected',    label: 'Rejected',    icon: XCircle,   color: '#f87171', bg: 'rgba(248,113,113,0.16)' },
            ].map(({ key, label, icon: Icon, color, bg }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '8px 16px', borderRadius: 9, border: 'none', cursor: 'pointer',
                  background: filter === key ? bg : 'rgba(255,255,255,0.04)',
                  color: filter === key ? color : '#64748b',
                  fontSize: 13, fontWeight: filter === key ? 700 : 400,
                  border: filter === key ? `1px solid ${color}44` : '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <Icon size={13} />
                {label}
                <span style={{ fontSize: 12, fontWeight: 700, padding: '1px 7px', borderRadius: 5, background: 'rgba(255,255,255,0.08)' }}>
                  {counts[key]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px 0' }}>
        <div style={{ padding: 22, borderRadius: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#c49b30', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>Recent notifications</p>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>Candidate updates</h2>
              <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, maxWidth: 640 }}>Status changes and alerts from your hiring workflow are surfaced here. Students receive updates when you change application status.</p>
            </div>
            <button
              onClick={markAllNotificationsRead}
              style={{ padding: '10px 18px', borderRadius: 10, border: '1px solid rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.12)', color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}
            >
              Mark all read
            </button>
          </div>

          {notifications.length === 0 ? (
            <div style={{ paddingTop: 24, color: '#64748b', fontSize: 13 }}>No notifications yet. Updates will appear as applicants move through your pipeline.</div>
          ) : (
            <div style={{ display: 'grid', gap: 12, marginTop: 18 }}>
              {notifications.slice(0, 3).map(note => (
                <div key={note.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 14, background: note.is_read ? 'rgba(255,255,255,0.02)' : 'rgba(196,155,48,0.12)', border: note.is_read ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(196,155,48,0.2)' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 12, display: 'grid', placeItems: 'center', background: note.is_read ? 'rgba(255,255,255,0.06)' : 'rgba(196,155,48,0.14)', color: '#c49b30' }}><Bell size={18} /></div>
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{note.title}</p>
                    <p style={{ margin: '6px 0 0', fontSize: 13, color: '#94a3b8' }}>{note.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Applications list */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 80px' }}>
        {displayed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <h3 style={{ fontSize: 18, color: '#f1f5f9', marginBottom: 8 }}>No applications {filter !== 'all' ? `with status "${filter}"` : 'yet'}</h3>
            <p style={{ fontSize: 14, color: '#64748b' }}>
              Applications submitted through ConnectGrad will appear here.
            </p>
          </div>
        ) : (
          displayed.map(app => (
            <ApplicationCard key={app.id} app={app} onStatusChange={updateStatus} />
          ))
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
