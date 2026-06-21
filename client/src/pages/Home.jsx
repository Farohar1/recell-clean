// ── Home.jsx ─────────────────────────────────────────────────────────────────
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Search, ArrowRight, Shield, Zap, Heart } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import { api } from '../lib/api';

const brands = ['Apple','Samsung','Google','OnePlus','Xiaomi','Sony','Nokia','Motorola'];

export default function Home() {
  const [search, setSearch]   = useState('');
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { api.getListings().then(setListings).catch(() => {}); }, []);

  const handleSearch = (e) => { e.preventDefault(); navigate(`/browse?q=${search}`); };

  return (
    <div style={{ background: '#0A0A0F' }}>
      {/* Hero */}
      <section style={{ position: 'relative', padding: '6rem 1rem 5rem', textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '20px', padding: '0.35rem 1rem', marginBottom: '2rem', color: '#A78BFA', fontSize: '0.85rem', fontFamily: 'Syne, sans-serif', fontWeight: 600 }}>
            ↗ The #1 marketplace for second-hand phones
          </div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(2.5rem,7vw,4.5rem)', lineHeight: 1.05, marginBottom: '1.5rem', letterSpacing: '-0.03em', color: '#fff' }}>
            Buy & Sell{' '}
            <span style={{ background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Mobile</span><br/>
            <span style={{ background: 'linear-gradient(135deg,#06B6D4,#7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Devices</span> with Confidence
          </h1>
          <p style={{ color: 'rgba(232,232,240,0.6)', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            Find great deals on pre-owned smartphones or list yours in minutes.<br/>Safe, simple, and trusted by thousands.
          </p>
          <form onSubmit={handleSearch} style={{ display: 'flex', maxWidth: '560px', margin: '0 auto 1.5rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', color: 'rgba(232,232,240,0.4)' }}><Search size={18}/></div>
            <input type="text" placeholder="Search iPhone, Samsung, Pixel..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, padding: '0.85rem 0', border: 'none', background: 'transparent', color: '#E8E8F0', fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem', outline: 'none' }} />
            <button type="submit" style={{ background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', border: 'none', color: '#fff', padding: '0.85rem 1.5rem', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 600 }}>Search</button>
          </form>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/browse" style={{ color: 'rgba(232,232,240,0.7)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>Browse All <ArrowRight size={14}/></Link>
            <Link to="/sell" style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.4)', color: '#A78BFA', textDecoration: 'none', padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'Syne, sans-serif', fontWeight: 600 }}>Sell Your Phone</Link>
          </div>
        </div>
      </section>

      {/* Brand pills */}
      <section style={{ padding: '0 1rem 3rem' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {brands.map(b => (
            <button key={b} onClick={() => navigate(`/browse?brand=${b}`)}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(232,232,240,0.7)', padding: '0.5rem 1.1rem', borderRadius: '20px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem' }}>
              {b}
            </button>
          ))}
        </div>
      </section>

      {/* Recent listings */}
      <section style={{ padding: '0 1rem 4rem' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#E8E8F0', margin: 0 }}>Recent Listings</h2>
            <Link to="/browse" style={{ color: '#A78BFA', textDecoration: 'none', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>See all <ArrowRight size={13}/></Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {listings.slice(0,6).map(l => <ListingCard key={l.id} listing={l}/>)}
          </div>
        </div>
      </section>

      {/* Why section */}
      <section style={{ padding: '4rem 1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.75rem', color: '#E8E8F0', marginBottom: '2.5rem', textAlign: 'center' }}>Why ReCell Mobile?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: <Shield size={24} color="#7C3AED"/>, title: 'Trusted Sellers', text: 'Every seller is verified. No bots, no scams.' },
              { icon: <Zap    size={24} color="#06B6D4"/>, title: 'Fast & Simple',   text: 'List your phone in 3 minutes. Buyers contact you directly.' },
              { icon: <Heart  size={24} color="#A78BFA"/>, title: 'Fair Prices',     text: 'Community pricing. No hidden fees, no commissions.' },
            ].map(({ icon, title, text }) => (
              <div key={title} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1.75rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: '10px', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>{icon}</div>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#E8E8F0', marginBottom: '0.5rem', fontSize: '1rem' }}>{title}</h3>
                <p style={{ color: 'rgba(232,232,240,0.5)', fontSize: '0.9rem', lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '16px', padding: '3rem 2rem' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2rem', color: '#E8E8F0', marginBottom: '0.75rem' }}>Got a phone to sell?</h2>
          <p style={{ color: 'rgba(232,232,240,0.5)', marginBottom: '1.75rem' }}>List it for free and reach buyers today.</p>
          <Link to="/sell" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>List Your Phone →</Link>
        </div>
      </section>
    </div>
  );
}
