import { Link } from 'react-router-dom'
import { GraduationCap, Share2, ExternalLink, AtSign, Mail } from 'lucide-react'

const footerLinks = {
  'For Students': ['Browse Jobs', 'Internships', 'Career Resources', 'CV Builder', 'Interview Prep'],
  'For Employers': ['Post a Job', 'Browse Talent', 'University Partnerships', 'Pricing'],
  'Regions': ['Pakistan', 'United Kingdom', 'United States', 'Germany', 'Netherlands'],
  'Company': ['About Us', 'Blog', 'Careers', 'Press', 'Contact'],
}

export default function Footer() {
  return (
    <footer style={{
      background: '#020818',
      borderTop: '1px solid rgba(16,185,129,0.1)',
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
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: 'linear-gradient(135deg, #059669, #10b981)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <GraduationCap size={20} color="white" />
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>
                Connect<span style={{ color: '#10b981' }}>Grad</span>
              </span>
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
              <h4 style={{ fontSize: 12, fontWeight: 600, color: '#10b981', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>
                {heading}
              </h4>
              <ul style={{ listStyle: 'none' }}>
                {links.map(link => (
                  <li key={link} style={{ marginBottom: 10 }}>
                    <a href="#" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none' }}>
                      {link}
                    </a>
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
