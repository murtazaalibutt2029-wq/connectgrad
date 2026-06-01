import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, GraduationCap, Briefcase, Save, CheckCircle, AlertCircle, Loader, X, Plus, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { session, profile, loading, refreshProfile } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    first_name: '', last_name: '', university: '', field_of_study: '',
    graduation_year: '', preferred_region: '',
  })
  const [skills, setSkills]       = useState([])
  const [skillInput, setSkillInput] = useState('')
  const [saving, setSaving]       = useState(false)
  const [toast, setToast]         = useState(null)

  useEffect(() => {
    if (!loading && !session) navigate('/login')
  }, [session, loading])

  useEffect(() => {
    if (profile) {
      setForm({
        first_name:       profile.first_name || '',
        last_name:        profile.last_name  || '',
        university:       profile.university || '',
        field_of_study:   profile.field_of_study || '',
        graduation_year:  profile.graduation_year?.toString() || '',
        preferred_region: profile.preferred_region || '',
      })
      setSkills(profile.skills ? profile.skills.split(',').map(s => s.trim()).filter(Boolean) : [])
    }
  }, [profile])

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const addSkill = () => {
    const s = skillInput.trim()
    if (s && !skills.includes(s)) setSkills(p => [...p, s])
    setSkillInput('')
  }

  const removeSkill = skill => setSkills(p => p.filter(s => s !== skill))

  const handleSkillKeyDown = e => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill() }
  }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('profiles').upsert({
      id:               session.user.id,
      email:            session.user.email,
      first_name:       form.first_name,
      last_name:        form.last_name,
      university:       form.university,
      field_of_study:   form.field_of_study,
      graduation_year:  form.graduation_year ? parseInt(form.graduation_year) : null,
      preferred_region: form.preferred_region,
      skills:           skills.join(', '),
    })
    setSaving(false)
    if (error) showToast(error.message, 'error')
    else { await refreshProfile(); showToast('Profile saved successfully') }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader size={24} color="#10b981" style={{ animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ background: '#030a1a', minHeight: '100vh', padding: '48px 24px 80px' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 200,
          padding: '12px 20px', borderRadius: 10,
          background: toast.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.3)'}`,
          color: toast.type === 'success' ? '#34d399' : '#f87171',
          fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}>
          {toast.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {toast.msg}
        </div>
      )}

      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#10b981', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
              My Account
            </p>
            <h1 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.5px' }}>
              Profile
            </h1>
          </div>
          <button
            onClick={handleSignOut}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 16px', borderRadius: 9,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#64748b', fontSize: 13, cursor: 'pointer',
            }}
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>

        <form onSubmit={handleSave}>
          {/* Personal info */}
          <Section icon={User} title="Personal Information">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="First name" value={form.first_name} onChange={v => update('first_name', v)} placeholder="Ali" required />
              <Field label="Last name"  value={form.last_name}  onChange={v => update('last_name', v)}  placeholder="Khan" required />
            </div>
            <div style={{ marginTop: 14 }}>
              <label style={labelStyle}>Email address</label>
              <input
                value={session?.user?.email || ''}
                disabled
                style={{ ...inputStyle, color: '#475569', cursor: 'not-allowed' }}
              />
            </div>
          </Section>

          {/* Education */}
          <Section icon={GraduationCap} title="Education">
            <Field label="University / Institution" value={form.university} onChange={v => update('university', v)} placeholder="e.g. LUMS, University of Manchester" required />
            <div style={{ marginTop: 14 }}>
              <Field label="Degree" value={form.field_of_study} onChange={v => update('field_of_study', v)} placeholder="e.g. BSc Computer Science" required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
              <div>
                <label style={labelStyle}>Graduation year</label>
                <select
                  value={form.graduation_year}
                  onChange={e => update('graduation_year', e.target.value)}
                  style={{ ...inputStyle, color: form.graduation_year ? '#f1f5f9' : '#475569' }}
                >
                  <option value="">Select year</option>
                  {[2025, 2026, 2027, 2028, 2029].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Preferred region</label>
                <select
                  value={form.preferred_region}
                  onChange={e => update('preferred_region', e.target.value)}
                  style={{ ...inputStyle, color: form.preferred_region ? '#f1f5f9' : '#475569' }}
                >
                  <option value="">Select region</option>
                  {['Pakistan', 'UK', 'USA', 'Europe', 'Open to all'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
          </Section>

          {/* Skills */}
          <Section icon={Briefcase} title="Skills">
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 14 }}>
              Add skills to auto-fill your cover letters and get better job matches.
            </p>

            {/* Skill chips */}
            {skills.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                {skills.map(skill => (
                  <div key={skill} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '5px 12px', borderRadius: 8,
                    background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                    fontSize: 13, color: '#34d399',
                  }}>
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#34d399', display: 'flex', padding: 0, lineHeight: 1 }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Skill input */}
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="Type a skill and press Enter (e.g. Python, React, Figma)"
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                type="button"
                onClick={addSkill}
                disabled={!skillInput.trim()}
                style={{
                  padding: '0 16px', borderRadius: 9, border: 'none', cursor: skillInput.trim() ? 'pointer' : 'not-allowed',
                  background: skillInput.trim() ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
                  color: skillInput.trim() ? '#10b981' : '#475569',
                  display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </Section>

          {/* Save button */}
          <button
            type="submit"
            disabled={saving}
            style={{
              width: '100%', padding: '14px 0', borderRadius: 11, border: 'none',
              background: saving ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #059669, #10b981)',
              color: saving ? '#475569' : 'white',
              fontSize: 15, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: saving ? 'none' : '0 0 24px rgba(16,185,129,0.3)',
            }}
          >
            {saving
              ? <><Loader size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> Saving…</>
              : <><Save size={15} /> Save Profile</>
            }
          </button>
        </form>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

function Section({ icon: Icon, title, children }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 16, padding: '24px', marginBottom: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={16} color="#10b981" />
        </div>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{title}</h2>
      </div>
      {children}
    </div>
  )
}

function Field({ label, value, onChange, placeholder, required }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        value={value} placeholder={placeholder} required={required}
        onChange={e => onChange(e.target.value)}
        style={inputStyle}
      />
    </div>
  )
}

const labelStyle = { fontSize: 13, fontWeight: 500, color: '#94a3b8', display: 'block', marginBottom: 7 }
const inputStyle = {
  width: '100%', padding: '11px 14px', borderRadius: 9, boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  color: '#f1f5f9', fontSize: 14, outline: 'none',
}
