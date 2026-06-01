import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, GraduationCap, LayoutDashboard, User, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'Home',             to: '/' },
  { label: 'Jobs & Internships', to: '/jobs' },
  { label: 'For Employers',    to: '/employers' },
  { label: 'Resources',        to: '/resources' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate     = useNavigate()
  const { session, profile } = useAuth()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const displayName = profile?.first_name || session?.user?.email?.split('@')[0] || 'Account'

  return (
    <nav style={{
      background: 'rgba(3,10,26,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(16,185,129,0.15)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'linear-gradient(135deg, #059669, #10b981)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <GraduationCap size={22} color="white" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.3px' }}>
              Connect<span style={{ color: '#10b981' }}>Grad</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
            {navLinks.map(link => (
              <Link key={link.label} to={link.to} style={{
                padding: '8px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
                textDecoration: 'none',
                color: pathname === link.to ? '#10b981' : '#94a3b8',
                background: pathname === link.to ? 'rgba(16,185,129,0.1)' : 'transparent',
                transition: 'all 0.2s',
              }}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA area */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="desktop-nav">
            <Link to="/tracker" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
              textDecoration: 'none',
              color: pathname === '/tracker' ? '#10b981' : '#64748b',
              background: pathname === '/tracker' ? 'rgba(16,185,129,0.1)' : 'transparent',
              border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <LayoutDashboard size={14} /> Tracker
            </Link>

            {session ? (
              <>
                <Link to="/profile" style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                  textDecoration: 'none',
                  color: pathname === '/profile' ? '#10b981' : '#94a3b8',
                  background: pathname === '/profile' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #059669, #10b981)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0,
                  }}>
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  {displayName}
                </Link>
                <button
                  onClick={handleSignOut}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: 'transparent', color: '#64748b', fontSize: 13,
                  }}
                  title="Sign out"
                >
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{
                  padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 500,
                  textDecoration: 'none', color: '#94a3b8',
                  border: '1px solid rgba(148,163,184,0.2)',
                }}>
                  Log in
                </Link>
                <Link to="/signup" style={{
                  padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                  textDecoration: 'none', color: 'white',
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  boxShadow: '0 0 20px rgba(16,185,129,0.3)',
                }}>
                  Sign up free
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'none' }}
            className="mobile-menu-btn"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingBottom: 16 }}>
            {navLinks.map(link => (
              <Link key={link.label} to={link.to} onClick={() => setMobileOpen(false)} style={{
                display: 'block', padding: '10px 0', fontSize: 15, fontWeight: 500,
                textDecoration: 'none', color: pathname === link.to ? '#10b981' : '#94a3b8',
              }}>
                {link.label}
              </Link>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              {session ? (
                <>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} style={{
                    flex: 1, padding: '10px 0', borderRadius: 8, fontSize: 14,
                    textDecoration: 'none', color: '#94a3b8', textAlign: 'center',
                    border: '1px solid rgba(148,163,184,0.2)',
                  }}>
                    Profile
                  </Link>
                  <button onClick={handleSignOut} style={{
                    flex: 1, padding: '10px 0', borderRadius: 8, fontSize: 14, fontWeight: 500,
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#94a3b8', cursor: 'pointer',
                  }}>
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" style={{
                    flex: 1, padding: '10px 0', borderRadius: 8, fontSize: 14, fontWeight: 500,
                    textDecoration: 'none', color: '#94a3b8', textAlign: 'center',
                    border: '1px solid rgba(148,163,184,0.2)',
                  }}>
                    Log in
                  </Link>
                  <Link to="/signup" style={{
                    flex: 1, padding: '10px 0', borderRadius: 8, fontSize: 14, fontWeight: 600,
                    textDecoration: 'none', color: 'white', textAlign: 'center',
                    background: 'linear-gradient(135deg, #059669, #10b981)',
                  }}>
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
