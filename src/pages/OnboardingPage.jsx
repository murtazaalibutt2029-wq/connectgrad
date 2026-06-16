import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Upload, Sparkles, Loader, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import SkillPicker from '../components/SkillPicker'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { session, profile, loading, refreshProfile } = useAuth()
  const [step, setStep] = useState(1)
  const [resumeUrl, setResumeUrl] = useState('')
  const [resumeStatus, setResumeStatus] = useState(null)
  const [resumeError, setResumeError] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({ phone: '', bio: '', skills: '' })
  const fileRef = useRef()

  useEffect(() => {
    if (!loading && !session) navigate('/login')
  }, [loading, session])

  useEffect(() => {
    if (!profile) return
    setResumeUrl(profile.resume_url || '')
    setForm({
      phone: profile.phone || '',
      bio: profile.bio || '',
      skills: profile.skills || '',
    })
  }, [profile])

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const uploadResume = async file => {
    setResumeStatus('reading')
    setResumeError('')
    try {
      const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist')
      GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await getDocument({ data: arrayBuffer }).promise
      if (pdf.numPages === 0) throw new Error('Uploaded file contains no pages.')
      setResumeStatus('uploading')
      const path = `${session.user.id}/resume_${Date.now()}.pdf`
      const { error: uploadErr } = await supabase.storage.from('cvs').upload(path, file, { contentType: 'application/pdf', upsert: false })
      if (uploadErr) throw uploadErr
      const { data: { publicUrl } } = supabase.storage.from('cvs').getPublicUrl(path)
      setResumeUrl(publicUrl)
      await supabase.from('profiles').upsert({ id: session.user.id, resume_url: publicUrl })
      setResumeStatus('done')
      setMessage('Resume uploaded successfully.')
    } catch (err) {
      setResumeStatus('error')
      setResumeError(err.message || 'Failed to upload resume. Please try again.')
    }
  }

  const handleResumeChange = e => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    uploadResume(file)
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    setResumeError('')
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: session.user.id,
        phone: form.phone,
        bio: form.bio,
        skills: form.skills,
      })
      if (error) throw error
      await refreshProfile()
      setMessage('Profile details saved.')
      setStep(3)
    } catch (err) {
      setResumeError(err.message || 'Unable to save profile details.')
    } finally {
      setSaving(false)
    }
  }

  const stepLabels = [
    'Upload Resume',
    'Complete Profile',
    'Ready to Apply',
  ]

  return (
    <div style={{ background: '#030a1a', minHeight: '100vh', padding: '60px 24px 80px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#10b981', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>Welcome aboard</p>
          <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, color: '#f1f5f9', marginBottom: 12 }}>Complete your profile in 3 quick steps</h1>
          <p style={{ fontSize: 15, color: '#94a3b8', maxWidth: 650 }}>A polished profile means better applications, smarter matches, and more confidence when you hit Apply.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 24, alignItems: 'start' }}>
          <div>
            <div style={{ padding: 24, borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 24 }}>
              <div style={{ marginBottom: 18 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>Progress</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
                  {stepLabels.map((label, index) => (
                    <div key={label} style={{ flex: 1, minWidth: 100, padding: 14, borderRadius: 16, background: index + 1 <= step ? 'rgba(16,185,129,0.14)' : 'rgba(255,255,255,0.02)', border: index + 1 === step ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.08)' }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: index + 1 <= step ? '#10b981' : '#64748b', marginBottom: 6 }}>{`Step ${index + 1}`}</p>
                      <p style={{ fontSize: 13, color: '#f1f5f9' }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ width: '100%', height: 10, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div style={{ width: `${(step / 3) * 100}%`, height: '100%', background: 'linear-gradient(135deg, #059669, #10b981)' }} />
              </div>
            </div>

            {step === 1 && (
              <div style={{ padding: 24, borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginBottom: 10 }}>Upload your resume</h2>
                <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 20 }}>Optional but recommended. This helps your profile look complete and gives the AI a better sense of your experience.</p>
                <input ref={fileRef} type="file" accept=".pdf" onChange={handleResumeChange} style={{ display: 'none' }} />
                <button type="button" onClick={() => fileRef.current.click()} style={{ width: '100%', padding: '14px 0', borderRadius: 12, background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                  <Upload size={16} /> Upload resume
                </button>
                {resumeStatus && resumeStatus !== 'done' && (
                  <p style={{ marginTop: 16, fontSize: 13, color: '#f3f4f6' }}>{resumeStatus === 'reading' ? 'Reading file…' : 'Uploading…'}</p>
                )}
                {resumeStatus === 'done' && <p style={{ marginTop: 16, fontSize: 13, color: '#34d399' }}>Resume uploaded. You can proceed to the next step.</p>}
                {resumeStatus === 'error' && <p style={{ marginTop: 16, fontSize: 13, color: '#f87171' }}>{resumeError}</p>}
                {resumeUrl && (
                  <p style={{ marginTop: 14, fontSize: 13, color: '#64748b' }}>Saved resume ready to use: <a href={resumeUrl} target="_blank" rel="noreferrer" style={{ color: '#10b981' }}>View file</a></p>
                )}
              </div>
            )}

            {step === 2 && (
              <div style={{ padding: 24, borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginBottom: 10 }}>Complete your profile</h2>
                <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 20 }}>Add the details that matter most to employers.</p>
                <div style={{ display: 'grid', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, color: '#94a3b8', marginBottom: 8, display: 'block' }}>Phone number</label>
                    <PhoneInput
                      international
                      defaultCountry="PK"
                      value={form.phone}
                      onChange={value => update('phone', value)}
                      placeholder="Enter phone number"
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#f1f5f9' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, color: '#94a3b8', marginBottom: 8, display: 'block' }}>About you</label>
                    <textarea value={form.bio} onChange={e => update('bio', e.target.value)} rows={4} placeholder="A brief professional summary" style={{ width: '100%', padding: '14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#f1f5f9', resize: 'vertical' }} />
                  </div>
                  <SkillPicker label="Skills" value={form.skills} onChange={value => update('skills', value)} placeholder="Search and add skills" />
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ padding: 24, borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 14, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={26} color="#10b981" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f1f5f9' }}>You're ready to apply</h2>
                    <p style={{ fontSize: 14, color: '#94a3b8' }}>Your profile is set up. Start applying to roles tailored for you.</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gap: 12 }}>
                  <div style={{ padding: 16, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <p style={{ fontSize: 14, color: '#cbd5e1' }}>Resume uploaded: <strong style={{ color: '#f1f5f9' }}>{resumeUrl ? 'Yes' : 'Not yet'}</strong></p>
                  </div>
                  <div style={{ padding: 16, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <p style={{ fontSize: 14, color: '#cbd5e1' }}>Bio and skills saved: <strong style={{ color: '#f1f5f9' }}>{form.bio && form.skills ? 'Yes' : 'Pending'}</strong></p>
                  </div>
                </div>
                <button type="button" onClick={() => navigate('/jobs')} style={{ marginTop: 24, width: '100%', padding: '14px 0', borderRadius: 12, background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                  Go browse jobs
                </button>
              </div>
            )}

            {message && <p style={{ marginTop: 16, fontSize: 13, color: '#34d399' }}>{message}</p>}

            <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} style={{ flex: '1', padding: '13px 0', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#94a3b8', cursor: 'pointer' }}>
                  Back
                </button>
              )}
              {step < 3 ? (
                <button type="button" onClick={() => step === 1 ? setStep(2) : handleSaveProfile()} style={{ flex: '1', padding: '13px 0', borderRadius: 12, background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                  {step === 1 ? 'Skip to profile' : saving ? 'Saving…' : 'Save and continue'}
                </button>
              ) : (
                <button type="button" onClick={() => navigate('/jobs')} style={{ flex: '1', padding: '13px 0', borderRadius: 12, background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                  Start applying
                </button>
              )}
            </div>
          </div>

          <div style={{ padding: 24, borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>Quick checklist</h3>
            <ul style={{ listStyle: 'none', display: 'grid', gap: 14, padding: 0, margin: 0 }}>
              {['Resume uploaded', 'Phone number added', 'Professional summary written', 'Top skills selected', 'Ready to submit applications'].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#cbd5e1' }}>
                  <CheckCircle size={16} color="#10b981" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
