import { Link } from 'react-router-dom'
import { Share2, ExternalLink, AtSign, Mail } from 'lucide-react'
import Logo from './Logo'

const footerLinks = {
  'For Students': [
    { label: 'Browse Jobs', to: '/jobs' },
    { label: 'Internships', to: '/jobs?type=internship' },
    { label: 'Career Resources', to: '/resources' },
    { label: 'CV Builder', to: '/profile' },
    { label: 'Interview Prep', to: '/resources' },
  ],
  'For Employers': [
    { label: 'Post a Job', to: '/employer/signup' },
    { label: 'Browse Talent', to: '/employer/signup' },
    { label: 'University Partnerships', to: '/employer/signup' },
    { label: 'Pricing', to: '/employer/signup' },
  ],
  'Regions': [
    { label: 'Pakistan', to: '/jobs?region=Pakistan' },
    { label: 'United Kingdom', to: '/jobs?region=UK' },
    { label: 'United States', to: '/jobs?region=USA' },
    { label: 'Germany', to: '/jobs?region=Germany' },
    { label: 'Netherlands', to: '/jobs?region=Netherlands' },
  ],
  'Company': [
    { label: 'About Us', to: '/about' },
    { label: 'Blog', to: '/blog' },
    { label: 'Careers', to: '/employer/signup' },
    { label: 'Press', to: '/contact' },
  ],
}

export default function Footer() {
  return (
    <footer style={{
      background: '#020818',
      borderTop: '1px solid rgba(99,102,241,0.1)',
      paddingTop: 60,
      paddingBottom: 32,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Top section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 40,
          marginBottom: 48,
        }}>
          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 16 }}>
              <Logo mini={true} size={36} />
            </Link>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, marginBottom: 20 }}>
              Connecting ambitious graduates with world-class opportunities across Pakistan, UK, USA and Europe.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {[Share2, ExternalLink, AtSign, Mail].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#64748b', textDecoration: 'none',
                  transition: 'all 0.2s',
                }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 style={{ fontSize: 12, fontWeight: 600, color: '#8b5cf6', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>
                {heading}
              </h4>
              <ul style={{ listStyle: 'none' }}>
                {links.map(link => (
                  <li key={link.label} style={{ marginBottom: 10 }}>
                    <Link to={link.to} style={{ fontSize: 13, color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <p style={{ fontSize: 12, color: '#475569' }}>
            © 2025 ConnectGrad. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <a key={item} href="#" style={{ fontSize: 12, color: '#475569', textDecoration: 'none' }}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
