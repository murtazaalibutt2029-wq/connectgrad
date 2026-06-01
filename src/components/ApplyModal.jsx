import { useState, useEffect, useRef } from 'react'
import { X, Sparkles, Upload, Send, CheckCircle, Loader, AlertCircle, FileText, ExternalLink } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function ApplyModal({ job, onClose }) {
  const { session, profile } = useAuth()
  const [stage, setStage]           = useState('generating') // generating | ready | uploading | success | error
  const [letter, setLetter]         = useState('')
  const [cvFile, setCvFile]         = useState(null)         // new file override
  const [useProfileResume, setUseProfileResume] = useState(false) // tracks whether to use saved resume
  const [error, setError]           = useState('')
  const fileRef                     = useRef()

  // Initialise CV state once profile loads
  useEffect(() => {
    if (profile?.resume_url) setUseProfileResume(true)
  }, [profile?.resume_url])

  useEffect(() => {
    if (!profile) return
    generate()
  }, [profile])

  const generate = async () => {
    setStage('generating')
    try {
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
      setLetter(data.letter)
      setStage('ready')
    } catch (err) {
      setError(err.message)
      setStage('error')
    }
  }

  const handleSubmit = async () => {
    setStage('uploading')
    setError('')
    try {
      let cvUrl = null

      if (useProfileResume && profile?.resume_url) {
        // Use the resume already saved in their profile — no re-upload needed
        cvUrl = profile.resume_url
      } else if (cvFile) {
        const path = `${session.user.id}/${job.id}-${Date.now()}.pdf`
        const { error: uploadErr } = await supabase.storage
          .from('cvs').upload(path, cvFile, { contentType: 'application/pdf' })
        if (uploadErr) throw uploadErr
        const { data: { publicUrl } } = supabase.storage.from('cvs').getPublicUrl(path)
        cvUrl = publicUrl
      }

      const { error: insertErr } = await supabase.from('applications').insert({
        user_id:              session.user.id,
        job_id:               job.id,
        job_title:            job.title,
        company:              job.company,
        cover_letter:         letter,
        cv_url:               cvUrl,
        status:               'pending',
        applicant_name:       `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
        applicant_university: profile.university !== 'Other' ? (profile.university || '') : '',
        applicant_degree:     profile.field_of_study || '',
      })

      if (insertErr) throw insertErr
      setStage('success')
    } catch (err) {
      setError(err.message)
      setStage('ready')
    }
  }

  // ── backdrop ─────────────────────────────────────────────────────────────
  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div style={{
        width: '100%', maxWidth: 600, maxHeight: '90vh',
        background: '#0d1f4f',
        border: '1px solid rgba(16,185,129,0.2)',
        borderRadius: 20, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: job.logoColor ? `${job.logoColor}22` : 'rgba(255,255,255,0.05)', border: `1px solid ${job.logoColor ? `${job.logoColor}44` : 'rgba(255,255,255,0.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: job.logoColor || '#94a3b8' }}>
              {job.logo}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{job.title}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{job.company} · {job.location}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

          {/* ── Generating ── */}
          {stage === 'generating' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '40px 0', textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 1.2s ease-in-out infinite' }}>
                <Sparkles size={24} color="#10b981" />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginBottom: 6 }}>Writing your cover letter…</p>
                <p style={{ fontSize: 13, color: '#64748b' }}>Tailoring it to {job.company} using your profile</p>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', animation: `bounce 0.8s ease-in-out ${i * 0.15}s infinite` }} />
                ))}
              </div>
            </div>
          )}

          {/* ── Error ── */}
          {stage === 'error' && (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <AlertCircle size={32} color="#f87171" style={{ marginBottom: 12 }} />
              <p style={{ fontSize: 15, color: '#f1f5f9', marginBottom: 8 }}>Generation failed</p>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>{error}</p>
              <button onClick={generate} style={{ padding: '10px 24px', borderRadius: 9, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: 14, cursor: 'pointer' }}>
                Try again
              </button>
            </div>
          )}

          {/* ── Success ── */}
          {stage === 'success' && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <CheckCircle size={30} color="#10b981" />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>Application submitted!</h3>
              <p style={{ fontSize: 14, color: '#64748b', marginBottom: 28 }}>
                Your application to <strong style={{ color: '#f1f5f9' }}>{job.company}</strong> has been saved. You can track it in your dashboard.
              </p>
              <button onClick={onClose} style={{ padding: '12px 28px', borderRadius: 10, background: 'linear-gradient(135deg, #059669, #10b981)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                Done
              </button>
            </div>
          )}

          {/* ── Ready ── */}
          {(stage === 'ready' || stage === 'uploading') && (
            <>
              {error && (
                <div style={{ display: 'flex', gap: 8, padding: '10px 14px', borderRadius: 9, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', marginBottom: 16 }}>
                  <AlertCircle size={14} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
                  <p style={{ fontSize: 13, color: '#f87171' }}>{error}</p>
                </div>
              )}

              {/* Cover letter */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={labelStyle}>Cover Letter <span style={{ color: '#475569', fontWeight: 400 }}>(editable)</span></label>
                  <button onClick={generate} type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#64748b' }}>
                    <Sparkles size={11} /> Regenerate
                  </button>
                </div>
                <textarea
                  value={letter}
                  onChange={e => setLetter(e.target.value)}
                  rows={14}
                  style={{ ...inputStyle, fontFamily: "'Georgia', serif", fontSize: 12.5, lineHeight: 1.85, resize: 'vertical' }}
                />
              </div>

              {/* CV / Resume */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>CV / Resume</label>
                <input ref={fileRef} type="file" accept=".pdf" onChange={e => { setCvFile(e.target.files[0] || null); setUseProfileResume(false) }} style={{ display: 'none' }} />

                {/* Using saved profile resume */}
                {useProfileResume && profile?.resume_url && !cvFile && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 9, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', marginBottom: 8 }}>
                      <FileText size={14} color="#10b981" />
                      <span style={{ fontSize: 13, color: '#34d399', flex: 1 }}>Using your saved resume</span>
                      <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <ExternalLink size={10} /> View
                      </a>
                    </div>
                    <button type="button" onClick={() => { setUseProfileResume(false); fileRef.current.click() }} style={{ fontSize: 12, color: '#475569', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
                      Use a different CV for this job
                    </button>
                  </div>
                )}

                {/* New file selected */}
                {cvFile && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 9, background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)', marginBottom: 8 }}>
                      <FileText size={14} color="#7dd3fc" />
                      <span style={{ fontSize: 13, color: '#7dd3fc', flex: 1 }}>{cvFile.name}</span>
                      <button type="button" onClick={() => { setCvFile(null); if (profile?.resume_url) setUseProfileResume(true) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}><X size={13} /></button>
                    </div>
                  </div>
                )}

                {/* No resume */}
                {!useProfileResume && !cvFile && (
                  <div>
                    <button type="button" onClick={() => fileRef.current.click()} style={{ width: '100%', padding: '12px', borderRadius: 9, background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.12)', color: '#64748b', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <Upload size={14} /> Upload CV (PDF)
                    </button>
                    {!profile?.resume_url && (
                      <p style={{ fontSize: 11, color: '#475569', marginTop: 6 }}>
                        Save a resume on your <a href="/profile" style={{ color: '#64748b' }}>profile</a> to skip this step every time.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {(stage === 'ready' || stage === 'uploading') && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 10 }}>
            <button onClick={onClose} style={{ flex: '0 0 90px', padding: '12px 0', borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: 14, cursor: 'pointer' }}>
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={stage === 'uploading'}
              style={{
                flex: 1, padding: '12px 0', borderRadius: 9, border: 'none',
                background: stage === 'uploading' ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #059669, #10b981)',
                color: stage === 'uploading' ? '#475569' : 'white',
                fontSize: 14, fontWeight: 700,
                cursor: stage === 'uploading' ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                boxShadow: stage === 'uploading' ? 'none' : '0 0 20px rgba(16,185,129,0.3)',
              }}
            >
              {stage === 'uploading'
                ? <><Loader size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Submitting…</>
                : <><Send size={14} /> Submit Application</>
              }
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes pulse  { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.7; transform:scale(0.95); } }
        @keyframes bounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
      `}</style>
    </div>
  )
}

const labelStyle = { fontSize: 13, fontWeight: 500, color: '#94a3b8', display: 'block', marginBottom: 7 }
const inputStyle = {
  width: '100%', padding: '11px 14px', borderRadius: 9, boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  color: '#f1f5f9', fontSize: 14, outline: 'none',
}
