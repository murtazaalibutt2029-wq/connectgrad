import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Calendar, ArrowRight, Trash2, Briefcase, ChevronRight } from 'lucide-react'
import { getApplications, updateStatus, removeApplication } from '../utils/applications'

const STATUSES = ['Applied', 'Under Review', 'Interview', 'Offer']

const COLUMN_STYLES = {
  'Applied':      { accent: '#3b82f6', bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.2)',  badge: 'rgba(59,130,246,0.15)',  text: '#93c5fd' },
  'Under Review': { accent: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', badge: 'rgba(245,158,11,0.15)', text: '#fcd34d' },
  'Interview':    { accent: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)', badge: 'rgba(139,92,246,0.15)', text: '#c4b5fd' },
  'Offer':        { accent: '#10b981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.2)',  badge: 'rgba(16,185,129,0.15)',  text: '#34d399' },
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function ApplicationCard({ app, onMove, onRemove }) {
  const currentIdx = STATUSES.indexOf(app.status)
  const nextStatus = STATUSES[currentIdx + 1] ?? null
  const cs = COLUMN_STYLES[app.status]

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12,
      padding: 16,
      transition: 'border-color 0.15s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = `${cs.accent}44`}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
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
          <h4 style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', lineHeight: 1.3, marginBottom: 2 }}>
            {app.title}
          </h4>
          <div style={{ fontSize: 12, color: '#64748b' }}>{app.company}</div>
        </div>
        <button
          onClick={() => onRemove(app.id)}
          title="Remove"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#475569', display: 'flex', padding: 2, borderRadius: 4,
            flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
          onMouseLeave={e => e.currentTarget.style.color = '#475569'}
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#64748b' }}>
          <MapPin size={10} />{app.location}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#64748b' }}>
          <Calendar size={10} />Applied {formatDate(app.appliedAt)}
        </div>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
        {app.tags.slice(0, 3).map(tag => (
          <span key={tag} style={{
            padding: '2px 7px', borderRadius: 4,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
            fontSize: 10, color: '#64748b',
          }}>{tag}</span>
        ))}
      </div>

      {/* Move to next stage */}
      {nextStatus && (
        <button
          onClick={() => onMove(app.id, nextStatus)}
          style={{
            width: '100%', padding: '7px 0', borderRadius: 8,
            background: cs.bg, border: `1px solid ${cs.border}`,
            color: cs.text, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
          }}
        >
          Move to {nextStatus} <ChevronRight size={12} />
        </button>
      )}
      {!nextStatus && (
        <div style={{
          width: '100%', padding: '7px 0', borderRadius: 8,
          background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
          color: '#34d399', fontSize: 12, fontWeight: 600,
          textAlign: 'center',
        }}>
          Offer received
        </div>
      )}
    </div>
  )
}

function Column({ status, apps, onMove, onRemove }) {
  const cs = COLUMN_STYLES[status]
  return (
    <div style={{
      flex: '1 1 220px', minWidth: 220,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Column header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 14px',
        background: cs.bg,
        border: `1px solid ${cs.border}`,
        borderRadius: '12px 12px 0 0',
        borderBottom: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: cs.accent }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: cs.text }}>{status}</span>
        </div>
        <div style={{
          minWidth: 22, height: 22, borderRadius: 6, padding: '0 6px',
          background: cs.badge,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: cs.text,
        }}>
          {apps.length}
        </div>
      </div>

      {/* Cards */}
      <div style={{
        flex: 1,
        border: `1px solid ${cs.border}`,
        borderTop: 'none',
        borderRadius: '0 0 12px 12px',
        padding: 10,
        display: 'flex', flexDirection: 'column', gap: 10,
        minHeight: 200,
        background: 'rgba(255,255,255,0.01)',
      }}>
        {apps.length === 0 ? (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '24px 12px', textAlign: 'center',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: cs.bg, border: `1px dashed ${cs.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 10,
            }}>
              <Briefcase size={16} color={cs.accent} style={{ opacity: 0.4 }} />
            </div>
            <p style={{ fontSize: 12, color: '#475569' }}>No applications here yet</p>
          </div>
        ) : (
          apps.map(app => (
            <ApplicationCard key={app.id} app={app} onMove={onMove} onRemove={onRemove} />
          ))
        )}
      </div>
    </div>
  )
}

export default function TrackerPage() {
  const [apps, setApps] = useState(() => getApplications())

  const handleMove = useCallback((id, newStatus) => {
    setApps(updateStatus(id, newStatus))
  }, [])

  const handleRemove = useCallback((id) => {
    setApps(removeApplication(id))
  }, [])

  const grouped = STATUSES.reduce((acc, s) => {
    acc[s] = apps.filter(a => a.status === s)
    return acc
  }, {})

  const totalApps = apps.length

  return (
    <div style={{ background: '#030a1a', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(180deg, #071230 0%, #030a1a 100%)',
        padding: '48px 24px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#10b981', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>
                Application Tracker
              </p>
              <h1 style={{
                fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800,
                color: '#f1f5f9', letterSpacing: '-0.8px', marginBottom: 8,
              }}>
                My Applications
              </h1>
              <p style={{ fontSize: 14, color: '#64748b' }}>
                {totalApps === 0
                  ? 'No applications yet — find your first role below.'
                  : `Tracking ${totalApps} application${totalApps > 1 ? 's' : ''} across ${STATUSES.length} stages`}
              </p>
            </div>
            <Link to="/jobs" style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '10px 20px', borderRadius: 10,
              background: 'linear-gradient(135deg, #059669, #10b981)',
              color: 'white', fontSize: 13, fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 0 20px rgba(16,185,129,0.3)',
            }}>
              Browse more jobs <ArrowRight size={14} />
            </Link>
          </div>

          {/* Summary stats */}
          {totalApps > 0 && (
            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
              {STATUSES.map(s => {
                const cs = COLUMN_STYLES[s]
                const count = grouped[s].length
                return (
                  <div key={s} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 14px', borderRadius: 8,
                    background: cs.bg, border: `1px solid ${cs.border}`,
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: cs.accent }} />
                    <span style={{ fontSize: 13, color: cs.text, fontWeight: 600 }}>{count}</span>
                    <span style={{ fontSize: 12, color: '#64748b' }}>{s}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Kanban board */}
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '36px 24px 80px' }}>
        {totalApps === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{
              width: 72, height: 72, borderRadius: 20, margin: '0 auto 20px',
              background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Briefcase size={30} color="#10b981" style={{ opacity: 0.6 }} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: '#f1f5f9', marginBottom: 10 }}>
              No applications tracked yet
            </h3>
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 28 }}>
              Go to the jobs page, select roles with the checkboxes, and click "Apply to Selected".
            </p>
            <Link to="/jobs" style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '11px 24px', borderRadius: 10,
              background: 'linear-gradient(135deg, #059669, #10b981)',
              color: 'white', fontSize: 14, fontWeight: 700, textDecoration: 'none',
            }}>
              Browse jobs <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', overflowX: 'auto', paddingBottom: 8 }}>
            {STATUSES.map(status => (
              <Column
                key={status}
                status={status}
                apps={grouped[status]}
                onMove={handleMove}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
