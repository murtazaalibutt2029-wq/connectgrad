import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader, Briefcase, Globe, Calendar, Link as LinkIcon, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const JOB_TYPES = ['Internship', 'Graduate Role', 'Full-time']
const REGIONS = ['Pakistan', 'UK', 'USA', 'Europe', 'Remote']
const SALARY_OPTIONS = ['Unpaid', 'Entry level', 'PKR 30k-60k', 'PKR 60k-120k', 'GBP 18k-28k', 'USD 40k-60k', 'Competitive']

export default function EmployerPostJobPage() {
  const navigate = useNavigate()
  const { session, loading } = useAuth()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    title: '', company: '', type: '', location: '', region: '', salary: '',
    description: '', requirements: '', deadline: '', external_url: '',
  })

  useEffect(() => {
    if (!loading && !session) navigate('/login')
  }, [loading, session])

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const { error: insertError } = await supabase.from('jobs').insert({
        employer_id: session.user.id,
        title: form.title,
        company: form.company,
        type: form.type,
        location: form.location,
        region: form.region,
        salary: form.salary,
        description: form.description,
        requirements: form.requirements,
        deadline: form.deadline || null,
        is_external: !!form.external_url,
        external_url: form.external_url || null,
      })
      if (insertError) throw insertError
      setSuccess(true)
    } catch (err) {
      console.error('Post job failed', err)
      setError(err.message || 'Unable to save job posting. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (success) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: 560 }}>
          <div style={{ width: 90, height: 90, borderRadius: '50%', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.3)' }}>
            <Check size={36} color="#10b981" />
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#f1f5f9', marginBottom: 12 }}>Job posted successfully</h2>
          <p style={{ fontSize: 15, color: '#64748b', marginBottom: 28 }}>Your role is now saved to the employer dashboard and visible to students in the job feed.</p>
          <button onClick={() => navigate('/employer/dashboard')} style={{ padding: '14px 26px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
            Return to dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#030a1a', minHeight: '100vh', padding: '60px 24px 80px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div style={{ marginBottom: 34 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#10b981', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>Post a job</p>
          <h1 style={{ fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 800, color: '#f1f5f9', marginBottom: 14 }}>Publish a new role for graduates</h1>
          <p style={{ fontSize: 15, color: '#94a3b8', maxWidth: 680 }}>Enter the job details below and reach students matched to your company profile.</p>
        </div>

        {error && (
          <div style={{ marginBottom: 24, padding: '16px 18px', borderRadius: 14, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, alignItems: 'start' }}>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              <div>
                <label style={labelStyle}>Job title</label>
                <input value={form.title} onChange={e => update('title', e.target.value)} required placeholder="Graduate Software Engineer" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Company name</label>
                <input value={form.company} onChange={e => update('company', e.target.value)} required placeholder="e.g. ConnectGrad" style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              <div>
                <label style={labelStyle}>Job type</label>
                <select value={form.type} onChange={e => update('type', e.target.value)} required style={inputStyle}>
                  <option value="">Choose type</option>
                  {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Location</label>
                <input value={form.location} onChange={e => update('location', e.target.value)} required placeholder="Lahore, Pakistan" style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              <div>
                <label style={labelStyle}>Region</label>
                <select value={form.region} onChange={e => update('region', e.target.value)} required style={inputStyle}>
                  <option value="">Choose region</option>
                  {REGIONS.map(region => <option key={region} value={region}>{region}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Salary range</label>
                <select value={form.salary} onChange={e => update('salary', e.target.value)} required style={inputStyle}>
                  <option value="">Choose salary range</option>
                  {SALARY_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Job description</label>
              <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={6} required placeholder="Describe the role, what the hire will do, and what success looks like." style={{ ...inputStyle, minHeight: 150, resize: 'vertical' }} />
            </div>

            <div>
              <label style={labelStyle}>Requirements</label>
              <textarea value={form.requirements} onChange={e => update('requirements', e.target.value)} rows={5} required placeholder="List the must-have skills, qualifications, and experience." style={{ ...inputStyle, minHeight: 130, resize: 'vertical' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              <div>
                <label style={labelStyle}>Application deadline</label>
                <input value={form.deadline} onChange={e => update('deadline', e.target.value)} type="date" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>External URL (optional)</label>
                <input value={form.external_url} onChange={e => update('external_url', e.target.value)} placeholder="https://" style={inputStyle} />
              </div>
            </div>

            <button type="submit" disabled={saving} style={{ padding: '14px 0', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
              {saving ? 'Posting job…' : 'Post job'}
            </button>
          </form>

          <aside style={{ display: 'grid', gap: 18 }}>
            <div style={{ padding: 22, borderRadius: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>Fast, employer-first posting</p>
              <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.8, marginBottom: 16 }}>Create a role that students can immediately understand and apply to. Your job posting will be surfaced to top applicants matched to your needs.</p>
              <ul style={{ listStyle: 'inside disc', paddingLeft: 14, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>
                <li>Share clear expectations and candidate profile.</li>
                <li>Use precise region and salary data for better matches.</li>
                <li>Keep it concise and actionable for students browsing quickly.</li>
              </ul>
            </div>

            <div style={{ padding: 22, borderRadius: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>Live preview</p>
              <div style={{ borderRadius: 16, padding: 18, background: '#07141f', border: '1px solid rgba(16,185,129,0.1)' }}>
                <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 10 }}>{form.type || 'Graduate Role'}</p>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>{form.title || 'Graduate Software Engineer'}</h2>
                <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>{form.company || 'Company name'} · {form.region || 'Region'}</p>
                <div style={{ display: 'grid', gap: 10, marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 12 }}>
                    <Globe size={14} /> {form.location || 'Lahore, Pakistan'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 12 }}>
                    <Calendar size={14} /> {form.deadline ? `Apply by ${form.deadline}` : 'No deadline set'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 12 }}>
                    <LinkIcon size={14} /> {form.external_url ? 'External application link' : 'Apply through ConnectGrad'}
                  </div>
                </div>
                <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.8 }}>{form.description ? form.description.slice(0, 140) + (form.description.length > 140 ? '…' : '') : 'Add a short summary of what the role includes and what kind of graduate you are looking for.'}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

const labelStyle = { fontSize: 13, fontWeight: 500, color: '#94a3b8', display: 'block', marginBottom: 8 }
const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9', fontSize: 14, outline: 'none' }
