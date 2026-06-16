import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Calendar, ArrowRight, Trash2, Briefcase, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { getApplications, updateStatus, removeApplication } from '../utils/applications'

const STATUSES = ['Applied', 'Under Review', 'Interview', 'Offer']

const COLUMN_STYLES = {
  Applied:      { accent: '#3b82f6', bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.2)',  badge: 'rgba(59,130,246,0.15)',  text: '#93c5fd' },
  'Under Review': { accent: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', badge: 'rgba(245,158,11,0.15)', text: '#fcd34d' },
  Interview:    { accent: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)', badge: 'rgba(139,92,246,0.15)', text: '#c4b5fd' },
  Offer:        { accent: '#10b981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.2)',  badge: 'rgba(16,185,129,0.15)',  text: '#34d399' },
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function daysSince(iso) {
  const then = new Date(iso)
  const now = new Date()
  return Math.max(0, Math.floor((now - then) / (1000 * 60 * 60 * 24)))
}

function ApplicationCard({ app, onMove, onRemove, onSaveNote, isLocal }) {
  const currentIdx = STATUSES.indexOf(app.status)
  const nextStatus = STATUSES[currentIdx + 1] ?? null
  const cs = COLUMN_STYLES[app.status] || COLUMN_STYLES.Applied
  const reminderDays = daysSince(app.appliedAt)
  const showReminder = ['Applied', 'Under Review'].includes(app.status) && reminderDays >= 10

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12,
      padding: 18,
      display: 'grid',
      gap: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9, flexShrink: 0,
          background: app.logoColor ? `${app.logoColor}22` : 'rgba(255,255,255,0.05)',
          border: `1px solid ${app.logoColor ? `${app.logoColor}44` : 'rgba(255,255,255,0.08)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 800, color: app.logoColor || '#94a3b8',
        }}>
          {app.logo}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', margin: 0, lineHeight: 1.3 }}>{app.title}</h4>
            <span style={{ fontSize: 11, padding: '4px 9px', borderRadius: 999, background: cs.badge, color: cs.text, fontWeight: 700 }}>{app.status}</span>
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{app.company}</div>
        </div>
        <button
          onClick={() => onRemove(app.id)}
          title="Remove"
          style={{
            background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 4, borderRadius: 6,
          }}
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, color: '#64748b', fontSize: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={12} />{app.location || 'Remote'}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={12} />{app.appliedAt ? `Applied ${formatDate(app.appliedAt)}` : 'Date unknown'}</div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
        {(app.tags || []).slice(0, 4).map(tag => (
          <span key={tag} style={{
            padding: '4px 10px', borderRadius: 999,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
            fontSize: 11, color: '#94a3b8',
          }}>{tag}</span>
        ))}
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        <textarea
          value={app.notes || ''}
          onChange={e => onSaveNote(app.id, e.target.value)}
          placeholder={isLocal ? 'Add notes for this external application...' : 'Add interview details, follow-up reminders, hiring manager notes...'}
          rows={4}
          style={{
            width: '100%', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.03)', color: '#f1f5f9', padding: 12,
            resize: 'vertical', fontSize: 13,
          }}
        />
        {showReminder && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b', fontSize: 13 }}>
            <Briefcase size={16} />
            <div>
              {reminderDays >= 14
                ? 'It has been over two weeks since you applied. Consider sending a polite follow-up email today.'
                : 'If you haven’t heard back soon, plan a follow-up message to the recruiter.'}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {nextStatus ? (
          <button
            onClick={() => onMove(app.id, nextStatus)}
            style={{
              flex: '1 1 140px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '10px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: cs.bg, color: cs.text, fontSize: 13, fontWeight: 700,
            }}
          >
            Move to {nextStatus} <ChevronRight size={14} />
          </button>
        ) : (
          <div style={{
            flex: '1 1 140px', padding: '10px 14px', borderRadius: 10,
            background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)',
            color: '#34d399', fontSize: 13, fontWeight: 700, textAlign: 'center',
          }}>
            Offer received
          </div>
        )}
        <Link
          to={`/jobs/${app.job_id || app.id}`}
          style={{
            flex: '1 1 140px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#94a3b8', textDecoration: 'none', fontSize: 13,
          }}
        >
          View job
        </Link>
      </div>
    </div>
  )
}

function Column({ status, apps, onMove, onRemove, onSaveNote, isLocal }) {
  const cs = COLUMN_STYLES[status]
  return (
    <div style={{ flex: '1 1 260px', minWidth: 260, display: 'flex', flexDirection: 'column' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px', background: cs.bg, border: `1px solid ${cs.border}`, borderRadius: '14px 14px 0 0', borderBottom: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: cs.accent }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: cs.text }}>{status}</span>
        </div>
        <div style={{ minWidth: 26, height: 26, borderRadius: 8, padding: '0 8px', background: cs.badge, color: cs.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
          {apps.length}
        </div>
      </div>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', gap: 12, padding: 12,
        border: `1px solid ${cs.border}`, borderTop: 'none', borderRadius: '0 0 14px 14px', background: 'rgba(255,255,255,0.01)',
        minHeight: 200,
      }}>
        {apps.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#64748b', fontSize: 12, padding: '24px 8px' }}>
            No applications here yet
          </div>
        ) : apps.map(app => (
          <ApplicationCard key={app.id} app={app} onMove={onMove} onRemove={onRemove} onSaveNote={onSaveNote} isLocal={isLocal} />
        ))}
      </div>
    </div>
  )
}

export default function TrackerPage() {
  const { session, loading: authLoading } = useAuth()
  const [dbApps, setDbApps] = useState([])
  const [localApps, setLocalApps] = useState(() => getApplications().map(item => ({ ...item, isLocal: true, notes: item.notes || '' })))
  const [loadingApps, setLoadingApps] = useState(true)

  useEffect(() => {
    if (!session) {
      const timer = window.setTimeout(() => setLoadingApps(false), 0)
      return () => window.clearTimeout(timer)
    }

    const loadApplications = async () => {
      setLoadingApps(true)
      const { data, error } = await supabase
        .from('applications')
        .select('id, user_id, job_id, job_title, company, location, status, applied_at, notes, logo, logo_color, tags')
        .eq('user_id', session.user.id)
        .order('applied_at', { ascending: false })

      if (error) {
        console.error('Unable to load applications:', error)
        setLoadingApps(false)
        return
      }

      setDbApps((data || []).map(row => ({
        id: row.id,
        job_id: row.job_id,
        title: row.job_title,
        company: row.company,
        location: row.location || 'Remote',
        status: row.status || 'Applied',
        appliedAt: row.applied_at || new Date().toISOString(),
        notes: row.notes || '',
        logo: row.logo || row.company?.charAt(0) || '•',
        logoColor: row.logo_color || '#64748b',
        tags: row.tags || [],
      })))
      setLoadingApps(false)
    }

    loadApplications()
  }, [session])

  const allApps = useMemo(() => [...dbApps, ...localApps], [dbApps, localApps])

  const grouped = useMemo(() => STATUSES.reduce((acc, status) => {
    acc[status] = allApps.filter(app => app.status === status)
    return acc
  }, {}), [allApps])

  const handleSaveDbNote = async (id, value) => {
    setDbApps(prev => prev.map(app => app.id === id ? { ...app, notes: value } : app))
    const { error } = await supabase.from('applications').update({ notes: value }).eq('id', id)
    if (error) {
      console.error('Failed to save notes:', error)
    }
  }

  const handleSaveLocalNote = (id, value) => {
    const updated = localApps.map(app => app.id === id ? { ...app, notes: value } : app)
    setLocalApps(updated)
    const stored = getApplications().map(app => app.id === id ? { ...app, notes: value } : app)
    localStorage.setItem('connectgrad_applications', JSON.stringify(stored))
  }

  const handleMoveDb = async (id, status) => {
    setDbApps(prev => prev.map(app => app.id === id ? { ...app, status } : app))
    const { error } = await supabase.from('applications').update({ status }).eq('id', id)
    if (error) console.error('Failed to update status:', error)
  }

  const handleMoveLocal = (id, status) => {
    const updated = updateStatus(id, status)
    setLocalApps(updated)
  }

  const handleRemoveDb = async id => {
    setDbApps(prev => prev.filter(app => app.id !== id))
    const { error } = await supabase.from('applications').delete().eq('id', id)
    if (error) console.error('Failed to remove application:', error)
  }

  const handleRemoveLocal = id => {
    const updated = removeApplication(id)
    setLocalApps(updated)
  }

  const totalApplications = allApps.length
  const hasDbApps = dbApps.length > 0
  const hasLocalApps = localApps.length > 0

  if (authLoading || loadingApps) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 14, color: '#94a3b8' }}>Loading your application tracker…</div>
      </div>
    )
  }

  return (
    <div style={{ background: '#030a1a', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(180deg, #071230 0%, #030a1a 100%)', padding: '48px 24px 40px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ maxWidth: 660 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#10b981', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Application Tracker</p>
              <h1 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.8px', marginBottom: 12 }}>My Applications</h1>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>
                Track every application with real Supabase data and keep quick notes, reminders, and status updates in one place.
              </p>
              <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 12 }}>
                {totalApplications === 0
                  ? 'No applications yet — submit a job from a listing and it will appear here automatically.'
                  : `You’re tracking ${totalApplications} application${totalApplications !== 1 ? 's' : ''} across ${STATUSES.length} stages.`}
              </p>
            </div>
            <Link to="/jobs" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: 13, boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}>
              Browse more jobs <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginTop: 28 }}>
            {STATUSES.map(status => {
              const cs = COLUMN_STYLES[status]
              return (
                <div key={status} style={{ padding: '14px 16px', borderRadius: 14, background: cs.bg, border: `1px solid ${cs.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: cs.text }}>{status}</span>
                    <span style={{ minWidth: 24, height: 24, borderRadius: 8, background: cs.badge, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: cs.text }}>{grouped[status]?.length || 0}</span>
                  </div>
                  <p style={{ marginTop: 10, fontSize: 12, color: '#64748b' }}>{status === 'Applied' ? 'Waiting on response' : status === 'Offer' ? 'Final stage' : 'Track progress'}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '32px 24px 80px', display: 'grid', gap: 24 }}>
        {hasDbApps && (
          <section style={{ padding: 24, borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 18 }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#10b981', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Connected applications</p>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Applications saved in your account</h2>
              </div>
              <p style={{ fontSize: 13, color: '#94a3b8', maxWidth: 480, margin: 0 }}>
                These applications are pulled directly from your Supabase applications table. Update notes, move statuses, or remove entries as you progress.
              </p>
            </div>
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              {STATUSES.map(status => (
                <Column key={status} status={status} apps={grouped[status].filter(app => !app.isLocal)} onMove={handleMoveDb} onRemove={handleRemoveDb} onSaveNote={handleSaveDbNote} />
              ))}
            </div>
          </section>
        )}

        {hasLocalApps && (
          <section style={{ padding: 24, borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 18 }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#7c3aed', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>External applications</p>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Manual entries and external jobs</h2>
              </div>
              <p style={{ fontSize: 13, color: '#94a3b8', maxWidth: 480, margin: 0 }}>
                Track roles that were applied to outside the ConnectGrad flow. Status updates and notes are saved in your browser as a fallback.
              </p>
            </div>
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              {STATUSES.map(status => (
                <Column key={status} status={status} apps={grouped[status].filter(app => app.isLocal)} onMove={handleMoveLocal} onRemove={handleRemoveLocal} onSaveNote={handleSaveLocalNote} isLocal />
              ))}
            </div>
          </section>
        )}

        {!hasDbApps && !hasLocalApps && (
          <div style={{ padding: 24, borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', marginBottom: 12 }}>Your tracker is empty</h2>
            <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 20 }}>
              Submit an application from a job detail page or add an external entry. Once you have applications, this page will show company, role, date, status, and private notes.
            </p>
            <Link to="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 10, background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', textDecoration: 'none', fontWeight: 700 }}>
              Find jobs to track <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
