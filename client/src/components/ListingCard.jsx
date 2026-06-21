import { Link } from 'react-router-dom';
import { MapPin, Eye } from 'lucide-react';
import { useState } from 'react';
import { getListingFallbackImageSrc, getListingImageSrc } from '../lib/listingImages';

const conditionTag = { 'Like New': 'tag-green', 'Good': 'tag', 'Fair': 'tag', 'Poor': 'tag-rust' };
const brandColors  = { Apple: '#6366F1', Samsung: '#06B6D4', Google: '#22D3EE', OnePlus: '#F87171', default: '#A78BFA' };

export default function ListingCard({ listing }) {
  const tagClass   = conditionTag[listing.condition] || 'tag';
  const brandColor = brandColors[listing.brand] || brandColors.default;
  const [imageFailed, setImageFailed] = useState(false);
  const imageSrc = imageFailed ? getListingFallbackImageSrc(listing) : (getListingImageSrc(listing.image, listing) || getListingFallbackImageSrc(listing));

  return (
    <Link to={`/listing/${listing.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div className="card-hover" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden', height: '100%' }}>
        <div style={{ height: '200px', overflow: 'hidden', position: 'relative', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <img src={imageSrc} alt={listing.title} onError={() => setImageFailed(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', top: 10, left: 10 }}>
            <span className={`tag ${tagClass}`}>{listing.condition}</span>
          </div>
          <div style={{ position: 'absolute', top: 10, right: 10, background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', color: '#fff', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
            €{listing.price}
          </div>
        </div>
        <div style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.7rem', fontFamily: 'Syne, sans-serif', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: brandColor, marginBottom: '0.3rem' }}>{listing.brand}</div>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#E8E8F0', margin: '0 0 0.5rem', lineHeight: 1.3 }}>{listing.title}</h3>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            {listing.storage && <span className="tag">{listing.storage}</span>}
            {listing.color   && <span className="tag">{listing.color}</span>}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(232,232,240,0.4)', fontSize: '0.8rem' }}><MapPin size={11}/>{listing.location}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(232,232,240,0.4)', fontSize: '0.8rem' }}><Eye size={11}/>{listing.views}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
