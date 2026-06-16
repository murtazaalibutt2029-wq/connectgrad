import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, DollarSign, Check } from 'lucide-react'

const typeColors = {
  'Internship':    { bg: 'rgba(99,102,241,0.1)',  color: '#6366f1', border: 'rgba(99,102,241,0.2)' },
  'Graduate Role': { bg: 'rgba(99,102,241,0.1)',  color: '#a5b4fc', border: 'rgba(99,102,241,0.2)' },
  'Full-time':     { bg: 'rgba(14,165,233,0.1)',  color: '#93c5fd', border: 'rgba(14,165,233,0.2)' },
  'Part-time':     { bg: 'rgba(245,158,11,0.1)',  color: '#fcd34d', border: 'rgba(245,158,11,0.2)' },
}

export default function JobCard({ job, selected = false, onToggle }) {
  const navigate  = useNavigate()
  const tc        = typeColors[job.type] || typeColors['Full-time']
  const selectable = typeof onToggle === 'function'

  const baseBorder = selected
    ? 'rgba(99,102,241,0.5)'
    : job.featured ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)'
  const baseBg = selected ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.03)'

  return (
    <div
      onClick={e => {
        if (e.target.closest('[data-checkbox]')) return
        navigate(`/jobs/${job.id}`)
      }}
      style={{
        background: baseBg,
        border: `1px solid ${baseBorder}`,
        borderRadius: 16,
        padding: 24,
        cursor: selectable ? 'pointer' : 'default',
        transition: 'all 0.15s',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: selected ? '0 0 0 1px rgba(99,102,241,0.2)' : 'none',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = selected ? 'rgba(99,102,241,0.09)' : 'rgba(255,255,255,0.05)'
        if (!selected) e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = baseBg
        e.currentTarget.style.borderColor = baseBorder
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = selected ? '0 0 0 1px rgba(99,102,241,0.2)' : 'none'
      }}
    >
      {/* Checkbox */}
      {selectable && (
        <div
          data-checkbox="true"
          onClick={e => { e.stopPropagation(); onToggle() }}
          style={{
            position: 'absolute', top: 14, left: 14,
            width: 20, height: 20, borderRadius: 6,
            background: selected ? 'linear-gradient(135deg, #6366f1, #6366f1)' : 'rgba(255,255,255,0.06)',
            border: `1.5px solid ${selected ? 'transparent' : 'rgba(255,255,255,0.15)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s', zIndex: 1, cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          {selected && <Check size={12} color="white" strokeWidth={3} />}
        </div>
      )}

      {job.featured && (
        <div style={{
          position: 'absolute', top: 0, right: 0,
          background: 'linear-gradient(135deg, #6366f1, #6366f1)',
          fontSize: 10, fontWeight: 700, color: 'white',
          padding: '4px 10px', borderRadius: '0 16px 0 8px', letterSpacing: 0.5,
        }}>
          FEATURED
        </div>
      )}

      {/* Header - shift right when checkbox visible */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14,
        paddingLeft: selectable ? 28 : 0,
      }}>
        <div style={{
          width: 46, height: 46, borderRadius: 12, flexShrink: 0,
          background: job.logoColor ? `${job.logoColor}22` : 'rgba(255,255,255,0.05)',
          border: `1px solid ${job.logoColor ? `${job.logoColor}44` : 'rgba(255,255,255,0.08)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 800, color: job.logoColor || '#94a3b8',
        }}>
          {job.logo}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginBottom: 3, lineHeight: 1.3 }}>
            {job.title}
          </h3>
          <div style={{ fontSize: 13, color: '#64748b' }}>{job.company}</div>
        </div>
        <div style={{
          padding: '4px 10px', borderRadius: 6,
          background: tc.bg, border: `1px solid ${tc.border}`,
          fontSize: 11, fontWeight: 600, color: tc.color, whiteSpace: 'nowrap',
        }}>
          {job.type}
        </div>
      </div>

      <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65, marginBottom: 16 }}>
        {job.description}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
        {job.tags.map(tag => (
          <span key={tag} style={{
            padding: '3px 10px', borderRadius: 5,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            fontSize: 12, color: '#94a3b8',
          }}>
            {tag}
          </span>
        ))}
      </div>

      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 14,
        paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748b' }}>
          <MapPin size={12} />{job.location}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748b' }}>
          <DollarSign size={12} />{job.salary}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#475569', marginLeft: 'auto' }}>
          <Clock size={12} />{job.posted}
        </div>
      </div>
    </div>
  )
}
