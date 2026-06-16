import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Bell, LayoutDashboard, LogOut, PlusCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

const studentLinks = [
  { label: 'Home', to: '/' },
  { label: 'Jobs & Internships', to: '/jobs' },
  { label: 'For Employers', to: '/employer/signup' },
  { label: 'Resources', to: '/resources' },
]
const employerLinks = [
  { label: 'Dashboard', to: '/employer/dashboard' },
  { label: 'Post a Job', to: '/employer/post-job' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [unread, setUnread]         = useState(0)
  const { pathname }                = useLocation()
  const navigate                    = useNavigate()
  const { session, profile, isEmployer } = useAuth()

  useEffect(() => {
    if (!session || isEmployer) { setUnread(0); return }
    supabase.from('notifications').select('id', { count: 'exact', head: true })
      .eq('recipient_id', session.user.id).eq('is_read', false)
      .then(({ count }) => setUnread(count || 0))
  }, [session, isEmployer])

  const handleSignOut = async () => { await supabase.auth.signOut(); navigate('/') }
  const displayName = profile?.first_name || session?.user?.email?.split('@')[0] || 'Account'
  const navLinks = isEmployer ? employerLinks : studentLinks

  const linkStyle = (to) => ({
    padding: '8px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
    textDecoration: 'none',
    color: pathname === to ? '#6366f1' : '#94a3b8',
    background: pathname === to ? 'rgba(99,102,241,0.1)' : 'transparent',
    transition: 'all 0.2s',
  })

  return (
    <nav style={{ background: 'rgba(3,10,26,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(99,102,241,0.15)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
          <Logo />

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
            {navLinks.map(l => <Link key={l.label} to={l.to} style={linkStyle(l.to)}>{l.label}</Link>)}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="desktop-nav">
            {session ? (
              isEmployer ? (
                <>
                  <Link to="/employer/post-job" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', color: 'white', background: 'linear-gradient(135deg,#6366f1,#1e40af)' }}>
                    <PlusCircle size={14} /> Post a Job
                  </Link>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 8, fontSize: 13, color: '#94a3b8', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#1e40af)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white' }}>
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    {displayName}
                  </span>
                  <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: '#94a3b8', fontSize: 13 }} title="Sign out">
                    <LogOut size={14} />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/tracker" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: 'none', color: pathname === '/tracker' ? '#f59e0b' : '#94a3b8', background: pathname === '/tracker' ? 'rgba(245,158,11,0.14)' : 'transparent', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <LayoutDashboard size={14} /> Tracker
                  </Link>
                  <Link to="/tracker" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#94a3b8', textDecoration: 'none', position: 'relative', fontSize: 13 }}>
                    <Bell size={16} /> Notifications
                    {unread > 0 && <span style={{ position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, borderRadius: 999, background: '#f59e0b', color: '#08101f', fontSize: 11, fontWeight: 700, display: 'grid', placeItems: 'center', padding: '0 5px' }}>{unread}</span>}
                  </Link>
                  <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: 'none', color: pathname === '/profile' ? '#c49b30' : '#94a3b8', background: pathname === '/profile' ? 'rgba(196,155,48,0.12)' : 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg,#3949a6,#1e2a4f)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    {displayName}
                  </Link>
                  <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: '#94a3b8', fontSize: 13 }}>
                    <LogOut size={14} />
                  </button>
                </>
              )
            ) : (
              <>
                <Link to="/login" style={{ padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: 'none', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>Log in</Link>
                <Link to="/signup" style={{ padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', color: 'white', background: 'linear-gradient(135deg,#6366f1,#1e40af)', boxShadow: '0 0 20px rgba(99,102,241,0.25)' }}>Sign up</Link>
              </>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'none' }} className="mobile-menu-btn">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingBottom: 16 }}>
            {navLinks.map(l => <Link key={l.label} to={l.to} onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '10px 0', fontSize: 15, fontWeight: 500, textDecoration: 'none', color: pathname === l.to ? '#6366f1' : '#94a3b8' }}>{l.label}</Link>)}
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              {session ? (
                <button onClick={handleSignOut} style={{ flex: 1, padding: '10px 0', borderRadius: 8, fontSize: 14, fontWeight: 500, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', cursor: 'pointer' }}>Sign out</button>
              ) : (
                <>
                  <Link to="/login" style={{ flex: 1, padding: '10px 0', borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: 'none', color: '#f59e0b', textAlign: 'center', border: '1px solid rgba(245,158,11,0.2)' }}>Log in</Link>
                  <Link to="/signup" style={{ flex: 1, padding: '10px 0', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', color: 'white', textAlign: 'center', background: 'linear-gradient(135deg,#6366f1,#1e40af)' }}>Sign up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <style>{`.desktop-nav{} @media(max-width:768px){.desktop-nav{display:none!important}.mobile-menu-btn{display:flex!important}}`}</style>
    </nav>
  )
}
