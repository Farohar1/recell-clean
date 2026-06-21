import { useAuth } from '../lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ListingCard from '../components/ListingCard';
import { Edit3, PackageOpen, Trash2 } from 'lucide-react';
import { api } from '../lib/api';

export default function MyListings() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!user) return;
    api.getMyListings().then(setListings).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this listing?')) return;
    await api.deleteListing(id);
    setListings(prev => prev.filter(l => l.id !== id));
  };

  if (!user) return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'1rem', background:'#0A0A0F' }}>
      <h2 style={{ fontFamily:'Syne, sans-serif', color:'#E8E8F0' }}>Login required</h2>
      <button onClick={() => navigate('/login')} className="btn-primary">Login</button>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0F', padding:'3rem 1rem' }}>
      <div style={{ maxWidth:'1000px', margin:'0 auto' }}>
        <span className="tag" style={{ marginBottom:'1rem', display:'inline-block' }}>Your Listings</span>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'2rem' }}>
          <h1 style={{ fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:'2rem', color:'#E8E8F0', margin:0 }}>My Listings</h1>
          <button onClick={() => navigate('/sell')} className="btn-primary">+ New Listing</button>
        </div>
        {loading ? <p style={{ color:'rgba(232,232,240,0.4)' }}>Loading...</p>
        : listings.length === 0 ? (
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px', padding:'4rem', textAlign:'center' }}>
            <PackageOpen size={44} color="rgba(167,139,250,0.3)" style={{ marginBottom:'1rem' }}/>
            <p style={{ color:'rgba(232,232,240,0.4)', fontFamily:'Syne, sans-serif' }}>No listings yet</p>
            <button onClick={() => navigate('/sell')} className="btn-primary" style={{ marginTop:'1rem' }}>Sell Your First Phone</button>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:'1rem' }}>
            {listings.map(l => (
              <div key={l.id} style={{ position:'relative' }}>
                <ListingCard listing={l}/>
                <div style={{ position:'absolute', top:10, right:10, display:'flex', gap:'0.4rem' }}>
                  <button onClick={() => navigate(`/listing/${l.id}/edit`)} aria-label="Edit listing" title="Edit listing" style={{ width:30, height:30, background:'rgba(15,23,42,0.78)', border:'1px solid rgba(167,139,250,0.45)', color:'#A78BFA', borderRadius:'6px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Edit3 size={14}/>
                  </button>
                  <button onClick={() => handleDelete(l.id)} aria-label="Delete listing" title="Delete listing" style={{ width:30, height:30, background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', color:'#F87171', borderRadius:'6px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Trash2 size={14}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
