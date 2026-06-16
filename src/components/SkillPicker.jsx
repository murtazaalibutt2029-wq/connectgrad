import { useMemo, useState } from 'react'
import { X, Search } from 'lucide-react'
import { commonSkills } from '../utils/skills'

const pillStyle = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '6px 10px', borderRadius: 999,
  background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)',
  color: '#f1f5f9', fontSize: 13,
}

export default function SkillPicker({ label, value, onChange, placeholder, required }) {
  const [query, setQuery] = useState('')
  const selected = useMemo(
    () => value.split(',').map(s => s.trim()).filter(Boolean),
    [value],
  )

  const suggestions = useMemo(() => {
    const lower = query.trim().toLowerCase()
    return commonSkills
      .filter(skill => !selected.includes(skill))
      .filter(skill => !lower || skill.toLowerCase().includes(lower))
      .slice(0, 10)
  }, [query, selected])

  const updateValue = newTags => {
    onChange(newTags.join(', '))
  }

  const addTag = tag => {
    if (!tag) return
    const next = [...selected, tag]
    updateValue(next)
    setQuery('')
  }

  const removeTag = tag => {
    updateValue(selected.filter(item => item !== tag))
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const nextValue = query.trim().replace(/,$/, '')
      if (nextValue) addTag(nextValue)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: '#94a3b8', display: 'block', marginBottom: 7 }}>
        {label}
      </label>
      <div style={{ minHeight: 54, padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
          {selected.map(tag => (
            <div key={tag} style={pillStyle}>
              <span>{tag}</span>
              <button type="button" onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                <X size={12} />
              </button>
            </div>
          ))}
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            style={{
              flex: 1, minWidth: 140, border: 'none', outline: 'none',
              background: 'transparent', color: '#f1f5f9', fontSize: 14,
            }}
          />
        </div>
      </div>
      <div style={{ position: 'absolute', right: 12, top: 38, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
        <Search size={14} />
        <span style={{ fontSize: 11 }}>Search skills</span>
      </div>
      {suggestions.length > 0 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: '100%', marginTop: 8, zIndex: 10, borderRadius: 14, background: '#0d1f4f', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 16px 40px rgba(0,0,0,0.25)', maxHeight: 240, overflowY: 'auto' }}>
          {suggestions.map(skill => (
            <button
              key={skill}
              type="button"
              onClick={() => addTag(skill)}
              style={{
                width: '100%', textAlign: 'left', padding: '10px 14px', border: 'none', background: 'transparent', color: '#f1f5f9', cursor: 'pointer', fontSize: 14,
              }}
            >
              {skill}
            </button>
          ))}
        </div>
      )}
      {required && selected.length === 0 && (
        <p style={{ fontSize: 11, color: '#f87171', marginTop: 8 }}>Please add at least one skill.</p>
      )}
    </div>
  )
}
