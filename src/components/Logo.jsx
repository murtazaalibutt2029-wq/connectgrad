import { Link } from 'react-router-dom'

export default function Logo({ mini = false, size = 38, style }) {
  const logoSize = size
  return (
    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: mini ? 0 : 10, textDecoration: 'none', ...style }}>
      <div style={{
        width: logoSize,
        height: logoSize,
        minWidth: logoSize,
        borderRadius: 14,
        background: '#6366f1',
        display: 'grid',
        placeItems: 'center',
        color: 'white',
        fontWeight: 900,
        fontSize: Math.round(logoSize * 0.5),
        letterSpacing: '-0.08em',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        CG
      </div>
      {!mini && (
        <span style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.3px', fontFamily: 'Inter, system-ui, sans-serif' }}>
          Connect<span style={{ color: '#f59e0b' }}>Grad</span>
        </span>
      )}
    </Link>
  )
}
