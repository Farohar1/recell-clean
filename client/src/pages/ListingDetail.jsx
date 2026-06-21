import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { useEffect, useState } from 'react';
import { MapPin, Eye, ArrowLeft, MessageCircle, Calendar, Edit3, Trash2 } from 'lucide-react';
import { api } from '../lib/api';
import { getListingFallbackImageSrc, getListingImageSrc } from '../lib/listingImages';

const condTag = { 'Like New': 'tag-green', 'Good': 'tag', 'Fair': 'tag', 'Poor': 'tag-rust' };

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [msg, setMsg]         = useState('');
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
    api.getListing(id).then(setListing).catch(() => setListing(null)).finally(() => setLoading(false));
  }, [id]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    try {
      await api.sendMessage({ listing_id: listing.id, recipient_id: listing.seller_id, content: msg });
      setMsg(''); setSent(true);
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this listing?')) return;
    try {
      await api.deleteListing(listing.id);
      navigate('/my-listings');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0F', color: 'rgba(232,232,240,0.4)' }}>Loading...</div>;
  if (!listing) return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0F', flexDirection: 'column', gap: '1rem' }}><p style={{ color: 'rgba(232,232,240,0.4)' }}>Listing not found.</p><button onClick={() => navigate('/browse')} className="btn-primary">Browse</button></div>;

  const imageSrc = imageFailed ? getListingFallbackImageSrc(listing) : (getListingImageSrc(listing.image, listing) || getListingFallbackImageSrc(listing));
  const isOwner = user?.id === listing.seller_id;

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(232,232,240,0.5)', fontFamily: 'Syne, sans-serif', fontWeight: 600, marginBottom: '1.5rem' }}>
          <ArrowLeft size={15}/> Back
        </button>
        {isOwner && (
          <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
            <button onClick={() => navigate(`/listing/${listing.id}/edit`)} className="btn-primary" style={{ display:'flex', alignItems:'center', gap:'0.45rem' }}>
              <Edit3 size={15}/> Edit Listing
            </button>
            <button onClick={handleDelete} style={{ display:'flex', alignItems:'center', gap:'0.45rem', background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', color:'#F87171', padding:'0.75rem 1.1rem', borderRadius:'8px', cursor:'pointer', fontFamily:'Syne, sans-serif', fontWeight:600 }}>
              <Trash2 size={15}/> Delete
            </button>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
          <div>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', height: '360px', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <img src={imageSrc} alt={listing.title} onError={() => setImageFailed(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span className={`tag ${condTag[listing.condition] || 'tag'}`}>{listing.condition}</span>
                <span className="tag">{listing.brand}</span>
                {listing.storage && <span className="tag">{listing.storage}</span>}
                {listing.color   && <span className="tag">{listing.color}</span>}
              </div>
              <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.6rem', color: '#E8E8F0', margin: '0 0 0.5rem' }}>{listing.title}</h1>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2rem', background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>€{listing.price}</div>
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                {[[<MapPin size={13}/>, listing.location], [<Eye size={13}/>, `${listing.views} views`], [<Calendar size={13}/>, new Date(listing.created_at).toLocaleDateString()]].map(([icon, text], i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(232,232,240,0.4)', fontSize: '0.82rem' }}>{icon}{text}</span>
                ))}
              </div>
              {listing.description && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                  <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#E8E8F0', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Description</h3>
                  <p style={{ color: 'rgba(232,232,240,0.6)', lineHeight: 1.7, fontSize: '0.9rem' }}>{listing.description}</p>
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.25rem' }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#E8E8F0', marginBottom: '1rem', fontSize: '0.95rem' }}>Seller</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#fff', fontSize: '1rem' }}>
                  {listing.seller_name?.[0] || '?'}
                </div>
                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#E8E8F0' }}>{listing.seller_name}</div>
                  <div style={{ color: 'rgba(232,232,240,0.4)', fontSize: '0.8rem' }}>{listing.location}</div>
                </div>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.25rem' }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#E8E8F0', marginBottom: '1rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageCircle size={15} color="#A78BFA"/> Contact Seller
              </h3>
              {sent ? (
                <div style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '8px', padding: '1rem', color: '#34D399', fontFamily: 'Syne, sans-serif', fontWeight: 600, textAlign: 'center' }}>✓ Message sent!</div>
              ) : (
                <form onSubmit={handleSend}>
                  <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder={`Hi, is the ${listing.title} still available?`} required rows={4}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#E8E8F0', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}/>
                  {error && <p style={{ color: '#F87171', fontSize: '0.8rem', marginTop: '0.5rem' }}>{error}</p>}
                  <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.75rem' }}>Send Message</button>
                  {!user && <p style={{ color: 'rgba(232,232,240,0.4)', fontSize: '0.8rem', marginTop: '0.5rem', textAlign: 'center' }}>You'll be asked to login</p>}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
