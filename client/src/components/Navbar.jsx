import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { Smartphone, Menu, X, Plus, LogOut, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const active = (p) => location.pathname === p;
  const linkStyle = (p) => ({
    color: active(p) ? '#A78BFA' : 'rgba(232,232,240,0.7)',
    textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500,
    padding: '0.4rem 0.75rem', borderRadius: '6px',
    background: active(p) ? 'rgba(139,92,246,0.12)' : 'transparent',
  });

  useEffect(() => {
    if (!profileOpen) return;
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setOpen(false);
    setProfileOpen(false);
  };

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
              <div ref={profileRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setProfileOpen(v => !v)}
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                  title={user.name}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                    background: profileOpen ? 'rgba(139,92,246,0.15)' : 'transparent',
                    border: profileOpen ? '1px solid rgba(139,92,246,0.4)' : '1px solid transparent',
                    borderRadius: '999px', padding: '0.2rem 0.35rem 0.2rem 0.2rem',
                    cursor: 'pointer', transition: 'background 0.15s, border-color 0.15s',
                  }}
                >
                  <span style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#7C3AED,#06B6D4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#fff', fontSize: '0.9rem',
                  }}>
                    {user.name?.[0]?.toUpperCase()}
                  </span>
                  <ChevronDown
                    size={14}
                    color="#A78BFA"
                    style={{
                      transition: 'transform 0.2s',
                      transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>

                {profileOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 0.5rem)', right: 0,
                    minWidth: '220px', background: '#0F0F1A',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px', boxShadow: '0 16px 48px rgba(0,0,0,0.45)',
                    overflow: 'hidden', zIndex: 60,
                  }}>
                    <div style={{
                      padding: '1rem 1rem 0.85rem',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      background: 'rgba(139,92,246,0.06)',
                    }}>
                      <p style={{
                        fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem',
                        color: '#E8E8F0', marginBottom: '0.2rem',
                      }}>
                        {user.name}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'rgba(232,232,240,0.5)', margin: 0 }}>
                        {user.email}
                      </p>
                      {user.location && (
                        <p style={{ fontSize: '0.75rem', color: 'rgba(167,139,250,0.7)', marginTop: '0.35rem', marginBottom: 0 }}>
                          {user.location}
                        </p>
                      )}
                    </div>

                    <div style={{ padding: '0.5rem' }}>
                      <Link
                        to="/my-listings"
                        onClick={() => setProfileOpen(false)}
                        style={{
                          display: 'block', padding: '0.6rem 0.75rem', borderRadius: '8px',
                          color: 'rgba(232,232,240,0.8)', textDecoration: 'none', fontSize: '0.875rem',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        My Listings
                      </Link>
                      <Link
                        to="/messages"
                        onClick={() => setProfileOpen(false)}
                        style={{
                          display: 'block', padding: '0.6rem 0.75rem', borderRadius: '8px',
                          color: 'rgba(232,232,240,0.8)', textDecoration: 'none', fontSize: '0.875rem',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        Messages
                      </Link>
                    </div>

                    <div style={{ padding: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <button
                        type="button"
                        onClick={handleLogout}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem',
                          padding: '0.6rem 0.75rem', borderRadius: '8px',
                          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                          color: '#F87171', fontFamily: 'Syne, sans-serif', fontWeight: 600,
                          fontSize: '0.875rem', cursor: 'pointer', transition: 'background 0.15s, border-color 0.15s',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'rgba(239,68,68,0.15)';
                          e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
                          e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)';
                        }}
                      >
                        <LogOut size={15} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
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
