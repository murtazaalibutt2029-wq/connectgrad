import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User, GraduationCap, Briefcase, Save, CheckCircle, AlertCircle,
  Loader, X, Plus, LogOut, Globe, Heart, BookOpen, Target, Phone,
  FileText, Upload, ExternalLink, Sparkles,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { session, profile, loading, refreshProfile } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    first_name: '', last_name: '', phone: '', linkedin_url: '', portfolio_url: '',
    university: '', field_of_study: '', graduation_year: '', preferred_region: '', gpa: '',
    bio: '', career_goals: '', why_abroad: '',
    extracurriculars: '', languages: '',
  })
  const [skills,        setSkills]       = useState([])
  const [skillInput,    setSkillInput]   = useState('')
  const [workExp,       setWorkExp]      = useState([])
  const [newExp,        setNewExp]       = useState({ company: '', role: '', duration: '' })
  const [saving,        setSaving]       = useState(false)
  const [toast,         setToast]        = useState(null)
  const [resumeUrl,     setResumeUrl]    = useState('')
  const [resumeStatus,  setResumeStatus] = useState(null) // null|'reading'|'uploading'|'parsing'|'done'|'error'
  const [resumeError,   setResumeError]  = useState('')
  const resumeInputRef = useRef()

  useEffect(() => { if (!loading && !session) navigate('/login') }, [session, loading])

  useEffect(() => {
    if (!profile) return
    setForm({
      first_name:       profile.first_name       || '',
      last_name:        profile.last_name        || '',
      phone:            profile.phone            || '',
      linkedin_url:     profile.linkedin_url     || '',
      portfolio_url:    profile.portfolio_url    || '',
      university:       (profile.university !== 'Other' ? profile.university : '') || '',
      field_of_study:   profile.field_of_study   || '',
      graduation_year:  profile.graduation_year?.toString() || '',
      preferred_region: profile.preferred_region || '',
      gpa:              profile.gpa              || '',
      bio:              profile.bio              || '',
      career_goals:     profile.career_goals     || '',
      why_abroad:       profile.why_abroad       || '',
      extracurriculars: profile.extracurriculars || '',
      languages:        profile.languages        || '',
    })
    setSkills(profile.skills ? profile.skills.split(',').map(s => s.trim()).filter(Boolean) : [])
    setWorkExp(Array.isArray(profile.work_experience) ? profile.work_experience : [])
    setResumeUrl(profile.resume_url || '')
  }, [profile])

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const addSkill = () => {
    const s = skillInput.trim()
    if (s && !skills.includes(s)) setSkills(p => [...p, s])
    setSkillInput('')
  }

  const addWorkExp = () => {
    if (!newExp.company.trim() || !newExp.role.trim()) return
    setWorkExp(p => [...p, { ...newExp, id: Date.now() }])
    setNewExp({ company: '', role: '', duration: '' })
  }

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setResumeError('')

    try {
      // ── Step 1: Extract text from PDF in the browser ──────────────────────
      setResumeStatus('reading')
      const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist')
      GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

      const arrayBuffer = await file.arrayBuffer()
      const pdf = await getDocument({ data: arrayBuffer }).promise
      let resumeText = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        resumeText += content.items.map(item => item.str).join(' ') + '\n'
      }

      if (!resumeText.trim() || resumeText.trim().length < 30) {
        throw new Error('No readable text found in this PDF. It may be a scanned image — please fill your profile manually.')
      }

      // ── Step 2: Upload PDF to Supabase Storage ────────────────────────────
      setResumeStatus('uploading')
      const path = `${session.user.id}/resume_${Date.now()}.pdf`
      const { error: uploadErr } = await supabase.storage
        .from('cvs')
        .upload(path, file, { contentType: 'application/pdf', upsert: false })
      if (uploadErr) throw uploadErr

      const { data: { publicUrl } } = supabase.storage.from('cvs').getPublicUrl(path)
      setResumeUrl(publicUrl)
      await supabase.from('profiles').upsert({ id: session.user.id, resume_url: publicUrl })

      // ── Step 3: Send text to AI for parsing ───────────────────────────────
      setResumeStatus('parsing')
      const parseRes = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: resumeText.trim() }),
      })
      const parseData = await parseRes.json()
      if (!parseRes.ok) throw new Error(parseData.error || 'AI parsing failed')

      // ── Step 4: Auto-fill form ────────────────────────────────────────────
      const p = parseData.parsed
      setForm(prev => ({
        ...prev,
        first_name:       p.first_name       || prev.first_name,
        last_name:        p.last_name        || prev.last_name,
        phone:            p.phone            || prev.phone,
        linkedin_url:     p.linkedin_url     || prev.linkedin_url,
        university:       p.university       || prev.university,
        field_of_study:   p.degree           || p.field_of_study || prev.field_of_study,
        graduation_year:  p.graduation_year?.toString() || prev.graduation_year,
        gpa:              p.gpa              || prev.gpa,
        bio:              p.bio              || prev.bio,
        career_goals:     p.career_goals     || prev.career_goals,
        extracurriculars: p.extracurriculars || prev.extracurriculars,
        languages:        p.languages        || prev.languages,
      }))
      if (p.skills) setSkills(p.skills.split(',').map(s => s.trim()).filter(Boolean))
      if (Array.isArray(p.work_experience) && p.work_experience.length > 0) {
        setWorkExp(p.work_experience.map((w, i) => ({
          id:       Date.now() + i,
          role:     w.title    || w.role    || '',
          company:  w.company  || '',
          duration: w.duration || '',
        })))
      }

      setResumeStatus('done')
    } catch (err) {
      setResumeStatus('error')
      setResumeError(err.message || 'Upload failed. Please try again.')
    }
  }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('profiles').upsert({
      id: session.user.id,
      email: session.user.email,
      ...form,
      graduation_year: form.graduation_year ? parseInt(form.graduation_year) : null,
      skills: skills.join(', '),
      work_experience: workExp.map(({ id, ...rest }) => rest),
      resume_url: resumeUrl || null,
    })
    setSaving(false)
    if (error) showToast(error.message, 'error')
    else { await refreshProfile(); showToast('Profile saved') }
  }

  const handleSignOut = async () => { await supabase.auth.signOut(); navigate('/') }

  if (loading) return <Spinner />

  return (
    <div style={{ background: '#030a1a', minHeight: '100vh', padding: '48px 24px 80px' }}>
      {toast && <Toast toast={toast} />}

      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#10b981', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>My Account</p>
            <h1 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.5px' }}>Profile</h1>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>
              The more you fill in, the better your AI cover letters will be.
            </p>
          </div>
          <button onClick={handleSignOut} style={ghostBtn}>
            <LogOut size={14} /> Sign out
          </button>
        </div>

        {/* ── Resume Upload ── */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(5,150,105,0.03))',
          border: '1px solid rgba(16,185,129,0.18)',
          borderRadius: 16, padding: 24, marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={16} color="#10b981" />
            </div>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>AI Resume Auto-Fill</h2>
              <p style={{ fontSize: 12, color: '#64748b' }}>Upload your CV and Claude will fill your profile automatically</p>
            </div>
          </div>

          {/* Saved resume link */}
          {resumeUrl && resumeStatus !== 'error' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderRadius: 9, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', marginBottom: 12 }}>
              <FileText size={14} color="#10b981" />
              <span style={{ fontSize: 13, color: '#34d399', flex: 1 }}>View current resume</span>
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#64748b', textDecoration: 'none' }}>
                <ExternalLink size={11} /> Open
              </a>
            </div>
          )}

          {/* Progress status */}
          {resumeStatus && resumeStatus !== 'done' && resumeStatus !== 'error' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 9, background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', marginBottom: 12 }}>
              <Loader size={13} color="#f59e0b" style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: '#fcd34d' }}>
                {{ reading: 'Reading PDF…', uploading: 'Uploading to secure storage…', parsing: 'AI is parsing your resume…' }[resumeStatus]}
              </span>
            </div>
          )}

          {/* Done */}
          {resumeStatus === 'done' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 9, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', marginBottom: 12 }}>
              <CheckCircle size={13} color="#10b981" />
              <span style={{ fontSize: 13, color: '#34d399' }}>Fields auto-filled — review below and click Save Profile.</span>
            </div>
          )}

          {/* Error */}
          {resumeStatus === 'error' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 9, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', marginBottom: 12 }}>
              <AlertCircle size={13} color="#f87171" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: '#f87171' }}>{resumeError}</span>
            </div>
          )}

          <input ref={resumeInputRef} type="file" accept=".pdf" onChange={handleResumeUpload} style={{ display: 'none' }} />
          <button
            type="button"
            onClick={() => { setResumeStatus(null); setResumeError(''); resumeInputRef.current.click() }}
            disabled={!!resumeStatus && resumeStatus !== 'done' && resumeStatus !== 'error'}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 18px', borderRadius: 9, border: 'none',
              cursor: (resumeStatus && resumeStatus !== 'done' && resumeStatus !== 'error') ? 'not-allowed' : 'pointer',
              background: (resumeStatus && resumeStatus !== 'done' && resumeStatus !== 'error') ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg, #059669, #10b981)',
              color: (resumeStatus && resumeStatus !== 'done' && resumeStatus !== 'error') ? '#475569' : 'white',
              fontSize: 13, fontWeight: 700,
              boxShadow: (resumeStatus && resumeStatus !== 'done' && resumeStatus !== 'error') ? 'none' : '0 0 16px rgba(16,185,129,0.25)',
            }}
          >
            <Upload size={14} />
            {resumeUrl && resumeStatus !== 'error' ? 'Replace Resume (PDF)' : 'Upload Resume (PDF)'}
          </button>
        </div>

        <form onSubmit={handleSave}>

          {/* ── Personal ── */}
          <Section icon={User} title="Personal Information">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="First name *" value={form.first_name} onChange={v => update('first_name', v)} placeholder="Ali" required />
              <Field label="Last name *"  value={form.last_name}  onChange={v => update('last_name', v)}  placeholder="Khan" required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
              <div>
                <label style={labelStyle}>Email address</label>
                <input value={session?.user?.email || ''} disabled style={{ ...inputStyle, color: '#475569', cursor: 'not-allowed' }} />
              </div>
              <Field label="Phone number" value={form.phone} onChange={v => update('phone', v)} placeholder="+44 7700 900000" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
              <Field label="LinkedIn URL" value={form.linkedin_url} onChange={v => update('linkedin_url', v)} placeholder="linkedin.com/in/yourname" />
              <Field label="Portfolio / Website" value={form.portfolio_url} onChange={v => update('portfolio_url', v)} placeholder="yoursite.com or github.com/you" />
            </div>
          </Section>

          {/* ── Education ── */}
          <Section icon={GraduationCap} title="Education">
            <Field label="University / Institution *" value={form.university} onChange={v => update('university', v)} placeholder="e.g. LUMS, University of Manchester, MIT" required />
            <div style={{ marginTop: 14 }}>
              <Field label="Degree / Programme *" value={form.field_of_study} onChange={v => update('field_of_study', v)} placeholder="e.g. BSc Computer Science" required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginTop: 14 }}>
              <div>
                <label style={labelStyle}>Graduation year</label>
                <select value={form.graduation_year} onChange={e => update('graduation_year', e.target.value)} style={{ ...inputStyle, color: form.graduation_year ? '#f1f5f9' : '#475569' }}>
                  <option value="">Select year</option>
                  {[2025, 2026, 2027, 2028, 2029].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Preferred region</label>
                <select value={form.preferred_region} onChange={e => update('preferred_region', e.target.value)} style={{ ...inputStyle, color: form.preferred_region ? '#f1f5f9' : '#475569' }}>
                  <option value="">Select</option>
                  {['Pakistan', 'UK', 'USA', 'Europe', 'Open to all'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <Field label="GPA / Grade" value={form.gpa} onChange={v => update('gpa', v)} placeholder="e.g. 3.8/4.0 or First Class" />
            </div>
          </Section>

          {/* ── About You ── */}
          <Section icon={Heart} title="About You">
            <div>
              <label style={labelStyle}>Short bio <Hint>2–3 sentences about yourself for the AI to use</Hint></label>
              <textarea value={form.bio} onChange={e => update('bio', e.target.value)} rows={3}
                placeholder="e.g. I'm a final-year CS student at LUMS with a passion for building scalable web applications. I've led two student societies and interned at a Series A startup..."
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }} />
            </div>
            <div style={{ marginTop: 14 }}>
              <label style={labelStyle}>Career goals <Hint>What kind of role and industry you want</Hint></label>
              <textarea value={form.career_goals} onChange={e => update('career_goals', e.target.value)} rows={2}
                placeholder="e.g. I want to work in product management at a high-growth tech company, ideally in fintech or consumer apps."
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }} />
            </div>
            <div style={{ marginTop: 14 }}>
              <label style={labelStyle}>Why you want to work abroad / in Pakistan <Hint>Used to personalise location-specific applications</Hint></label>
              <textarea value={form.why_abroad} onChange={e => update('why_abroad', e.target.value)} rows={2}
                placeholder="e.g. I want to gain international experience in the UK tech sector before returning to Pakistan to build something impactful."
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }} />
            </div>
          </Section>

          {/* ── Skills ── */}
          <Section icon={Briefcase} title="Skills">
            {skills.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                {skills.map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', fontSize: 13, color: '#34d399' }}>
                    {s}
                    <button type="button" onClick={() => setSkills(p => p.filter(x => x !== s))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#34d399', display: 'flex', padding: 0 }}><X size={12} /></button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill() } }}
                placeholder="Type a skill and press Enter (e.g. Python, React, Figma)"
                style={{ ...inputStyle, flex: 1 }} />
              <button type="button" onClick={addSkill} disabled={!skillInput.trim()} style={{ ...addBtn(!!skillInput.trim()), flexShrink: 0 }}>
                <Plus size={14} /> Add
              </button>
            </div>
          </Section>

          {/* ── Work Experience ── */}
          <Section icon={BookOpen} title="Work Experience">
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
              Previous internships or jobs — used to personalise your cover letters significantly.
            </p>

            {workExp.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {workExp.map((exp, i) => (
                  <div key={exp.id || i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{exp.role}</span>
                      <span style={{ fontSize: 13, color: '#64748b' }}> at {exp.company}</span>
                      {exp.duration && <span style={{ fontSize: 12, color: '#475569' }}> · {exp.duration}</span>}
                    </div>
                    <button type="button" onClick={() => setWorkExp(p => p.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, alignItems: 'end' }}>
              <div>
                <label style={{ ...labelStyle, marginBottom: 5 }}>Role / Title</label>
                <input value={newExp.role} onChange={e => setNewExp(p => ({ ...p, role: e.target.value }))} placeholder="e.g. Software Intern" style={inputStyle} />
              </div>
              <div>
                <label style={{ ...labelStyle, marginBottom: 5 }}>Company</label>
                <input value={newExp.company} onChange={e => setNewExp(p => ({ ...p, company: e.target.value }))} placeholder="e.g. Google" style={inputStyle} />
              </div>
              <div>
                <label style={{ ...labelStyle, marginBottom: 5 }}>Duration</label>
                <input value={newExp.duration} onChange={e => setNewExp(p => ({ ...p, duration: e.target.value }))} placeholder="e.g. Summer 2024" style={inputStyle} />
              </div>
              <button type="button" onClick={addWorkExp} disabled={!newExp.role.trim() || !newExp.company.trim()} style={{ ...addBtn(!!(newExp.role.trim() && newExp.company.trim())), height: 42 }}>
                <Plus size={14} /> Add
              </button>
            </div>
          </Section>

          {/* ── Languages & Activities ── */}
          <Section icon={Globe} title="Languages & Activities">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={labelStyle}>Languages spoken</label>
                <input value={form.languages} onChange={e => update('languages', e.target.value)}
                  placeholder="e.g. English (fluent), Urdu (native), German (basic)"
                  style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Extracurricular activities</label>
                <input value={form.extracurriculars} onChange={e => update('extracurriculars', e.target.value)}
                  placeholder="e.g. Head of Debating Society, hackathon organiser"
                  style={inputStyle} />
              </div>
            </div>
          </Section>

          {/* Save */}
          <button type="submit" disabled={saving} style={{
            width: '100%', padding: '14px 0', borderRadius: 11, border: 'none',
            background: saving ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #059669, #10b981)',
            color: saving ? '#475569' : 'white',
            fontSize: 15, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: saving ? 'none' : '0 0 24px rgba(16,185,129,0.3)',
          }}>
            {saving ? <><Loader size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> Saving…</> : <><Save size={15} /> Save Profile</>}
          </button>
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

// ── small helpers ─────────────────────────────────────────────────────────────

function Section({ icon: Icon, title, children }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
      <input value={value} placeholder={placeholder} required={required} onChange={e => onChange(e.target.value)} style={inputStyle} />
    </div>
  )
}

function Hint({ children }) {
  return <span style={{ fontSize: 11, color: '#475569', marginLeft: 6, fontWeight: 400 }}>— {children}</span>
}

function Toast({ toast }) {
  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 200,
      padding: '12px 20px', borderRadius: 10,
      background: toast.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.08)',
      border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.25)'}`,
      color: toast.type === 'success' ? '#34d399' : '#f87171',
      fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8,
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    }}>
      {toast.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
      {toast.msg}
    </div>
  )
}

function Spinner() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader size={24} color="#10b981" style={{ animation: 'spin 0.8s linear infinite' }} />
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
const ghostBtn = {
  display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 9,
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  color: '#64748b', fontSize: 13, cursor: 'pointer',
}
const addBtn = active => ({
  padding: '0 16px', borderRadius: 9, border: 'none', cursor: active ? 'pointer' : 'not-allowed',
  background: active ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
  color: active ? '#10b981' : '#475569',
  display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600,
})
