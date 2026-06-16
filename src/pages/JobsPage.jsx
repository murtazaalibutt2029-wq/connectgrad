import { useState, useMemo, useCallback } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Search, MapPin, Filter, X, CheckSquare, Send, LayoutDashboard } from 'lucide-react'
import { jobs, regions, jobTypes } from '../data/jobs'
import JobCard from '../components/JobCard'

export default function JobsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(() => searchParams.get('search') || '')
  const [region, setRegion] = useState(() => searchParams.get('region') || 'All Regions')
  const [type, setType] = useState('All Types')
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [toast, setToast] = useState(null) // { message, type }

  const filtered = useMemo(() => jobs.filter(job => {
    const matchesQuery =
      !query ||
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.company.toLowerCase().includes(query.toLowerCase()) ||
      job.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
    return matchesQuery &&
      (region === 'All Regions' || job.region === region) &&
      (type === 'All Types' || job.type === type)
  }), [query, region, type])

  const activeFilters = [
    region !== 'All Regions' && region,
    type !== 'All Types' && type,
  ].filter(Boolean)

  const toggleJob = useCallback(id => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map(j => j.id)))
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const handleMassApply = (e) => {
    e.stopPropagation()
    const selected = jobs.filter(j => selectedIds.has(j.id))
    if (!selected.length) return
    navigate('/apply/review', { state: { jobs: selected } })
    setSelectedIds(new Set())
  }

  const allVisibleSelected = filtered.length > 0 && filtered.every(j => selectedIds.has(j.id))

  return (
    <div style={{ background: '#030a1a', minHeight: '100vh' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 200,
          padding: '12px 20px', borderRadius: 10,
          background: toast.type === 'success' ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.15)',
          border: `1px solid ${toast.type === 'success' ? 'rgba(99,102,241,0.4)' : 'rgba(99,102,241,0.4)'}`,
          color: toast.type === 'success' ? '#6366f1' : '#a5b4fc',
          fontSize: 14, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          animation: 'slideIn 0.2s ease',
        }}>
          {toast.message}
          <Link to="/tracker" style={{ color: 'inherit', fontWeight: 700, textDecoration: 'underline' }}>
            View tracker →
          </Link>
        </div>
      )}

      {/* Page header */}
      <div style={{
        background: 'linear-gradient(180deg, #071230 0%, #030a1a 100%)',
        padding: '56px 24px 48px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#6366f1', letterSpacing: 1.5, textTransform: 'uppercase' }}>
              {filtered.length} opportunities available
            </p>
            <Link to="/tracker" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 13, fontWeight: 500, color: '#64748b', textDecoration: 'none',
              padding: '6px 12px', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
            }}>
              <LayoutDashboard size={14} /> My Tracker
            </Link>
          </div>

          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800,
            color: '#f1f5f9', letterSpacing: '-0.8px', marginBottom: 32,
          }}>
            Jobs & Internships
          </h1>

          {/* Search + Filter row */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{
              flex: 1, minWidth: 240, display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, padding: '0 16px', height: 46,
            }}>
              <Search size={16} color="#475569" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search jobs, companies, skills..."
                style={{ background: 'none', border: 'none', outline: 'none', color: '#f1f5f9', fontSize: 14, width: '100%' }}
              />
              {query && (
                <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, padding: '0 14px', height: 46, minWidth: 150,
            }}>
              <MapPin size={14} color="#475569" />
              <select value={region} onChange={e => setRegion(e.target.value)} style={{ background: 'none', border: 'none', outline: 'none', color: '#94a3b8', fontSize: 14, cursor: 'pointer', width: '100%' }}>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, padding: '0 14px', height: 46, minWidth: 150,
            }}>
              <Filter size={14} color="#475569" />
              <select value={type} onChange={e => setType(e.target.value)} style={{ background: 'none', border: 'none', outline: 'none', color: '#94a3b8', fontSize: 14, cursor: 'pointer', width: '100%' }}>
                {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
              {activeFilters.map(f => (
                <div key={f} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '4px 12px', borderRadius: 6,
                  background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                  fontSize: 12, color: '#6366f1',
                }}>
                  {f}
                  <button
                    onClick={() => regions.includes(f) ? setRegion('All Regions') : setType('All Types')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1', display: 'flex', padding: 0 }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => { setRegion('All Regions'); setType('All Types') }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#475569', padding: '4px 0' }}
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Job grid */}
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: `40px 24px ${selectedIds.size > 0 ? '120px' : '80px'}`,
      }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: '#f1f5f9', marginBottom: 10 }}>No results found</h3>
            <p style={{ fontSize: 14, color: '#64748b' }}>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <p style={{ fontSize: 14, color: '#64748b' }}>
                  Showing <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{filtered.length}</span> results
                </p>
                <button
                  onClick={toggleAll}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 13, color: allVisibleSelected ? '#6366f1' : '#64748b',
                    padding: 0,
                  }}
                >
                  <CheckSquare size={14} />
                  {allVisibleSelected ? 'Deselect all' : 'Select all'}
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, color: '#475569' }}>Sort by:</span>
                <select style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 6, padding: '5px 10px', color: '#94a3b8', fontSize: 13, outline: 'none', cursor: 'pointer',
                }}>
                  <option>Most Recent</option>
                  <option>Most Relevant</option>
                  <option>Deadline Soon</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
              {filtered.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  selected={selectedIds.has(job.id)}
                  onToggle={() => toggleJob(job.id)}
                />
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 48 }}>
              <button style={{
                padding: '12px 36px', borderRadius: 10,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#94a3b8', fontSize: 15, fontWeight: 500, cursor: 'pointer',
              }}>
                Load more jobs
              </button>
            </div>
          </>
        )}
      </div>

      {/* Floating apply bar */}
      {selectedIds.size > 0 && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: '#0d1f4f',
          border: '1px solid rgba(99,102,241,0.35)',
          borderRadius: 16,
          padding: '14px 20px',
          display: 'flex', alignItems: 'center', gap: 16,
          boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)',
          zIndex: 100,
          backdropFilter: 'blur(16px)',
          whiteSpace: 'nowrap',
        }}>
          <div style={{ fontSize: 14, color: '#94a3b8' }}>
            <span style={{ color: '#6366f1', fontWeight: 700 }}>{selectedIds.size}</span>
            {' '}job{selectedIds.size > 1 ? 's' : ''} selected
          </div>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />
          <button
            onClick={() => setSelectedIds(new Set())}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, color: '#64748b', display: 'flex', alignItems: 'center', gap: 5, padding: 0,
            }}
          >
            <X size={13} /> Clear
          </button>
          <button
            onClick={handleMassApply}
            onMouseDown={e => e.stopPropagation()}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 22px', borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #6366f1)',
              border: 'none', cursor: 'pointer',
              color: 'white', fontSize: 14, fontWeight: 700,
              boxShadow: '0 0 20px rgba(99,102,241,0.4)',
            }}
          >
            <Send size={14} />
            Apply to Selected ({selectedIds.size})
          </button>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
