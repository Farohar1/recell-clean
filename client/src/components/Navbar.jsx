import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { Smartphone, Menu, X, Plus } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const active = (p) => location.pathname === p;
  const linkStyle = (p) => ({
    color: active(p) ? '#A78BFA' : 'rgba(232,232,240,0.7)',
    textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500,
    padding: '0.4rem 0.75rem', borderRadius: '6px',
    background: active(p) ? 'rgba(139,92,246,0.12)' : 'transparent',
  });

  const handleLogout = async () => { await logout(); navigate('/'); setOpen(false); };

  return (
    <nav style={{ background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 1rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Smartphone size={16} color="#fff" />
          </div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#E8E8F0' }}>
            ReCell <span style={{ color: '#A78BFA' }}>Mobile</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <Link to="/browse" style={linkStyle('/browse')}>Browse</Link>
          {user && <Link to="/sell" style={linkStyle('/sell')}>Sell</Link>}
          {user && <Link to="/messages" style={linkStyle('/messages')}>Messages</Link>}
          {user && <Link to="/my-listings" style={linkStyle('/my-listings')}>My Listings</Link>}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/sell" style={{ background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', color: '#fff', textDecoration: 'none', padding: '0.45rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'Syne, sans-serif', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Plus size={14} /> List Device
              </Link>
              <div onClick={handleLogout} title={`Logout (${user.name})`} style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#fff', fontSize: '0.9rem', cursor: 'pointer' }}>
                {user.name?.[0]?.toUpperCase()}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'rgba(232,232,240,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>Login</Link>
              <Link to="/register" style={{ background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', color: '#fff', textDecoration: 'none', padding: '0.45rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'Syne, sans-serif', fontWeight: 600 }}>Register</Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E8E8F0' }}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div style={{ background: '#0F0F1A', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link to="/browse" onClick={() => setOpen(false)} style={{ color: 'rgba(232,232,240,0.8)', textDecoration: 'none' }}>Browse</Link>
          {user ? (
            <>
              <Link to="/sell" onClick={() => setOpen(false)} style={{ color: 'rgba(232,232,240,0.8)', textDecoration: 'none' }}>Sell</Link>
              <Link to="/messages" onClick={() => setOpen(false)} style={{ color: 'rgba(232,232,240,0.8)', textDecoration: 'none' }}>Messages</Link>
              <Link to="/my-listings" onClick={() => setOpen(false)} style={{ color: 'rgba(232,232,240,0.8)', textDecoration: 'none' }}>My Listings</Link>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#A78BFA', textAlign: 'left', cursor: 'pointer', fontFamily: 'Syne, sans-serif', padding: 0 }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} style={{ color: 'rgba(232,232,240,0.8)', textDecoration: 'none' }}>Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} style={{ color: '#A78BFA', textDecoration: 'none', fontWeight: 600 }}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
