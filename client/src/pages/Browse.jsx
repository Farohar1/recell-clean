import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import { api } from '../lib/api';

const brands     = ['All','Apple','Samsung','Google','OnePlus','Xiaomi','Sony','Nokia','Motorola','Other'];
const conditions = ['All','Like New','Good','Fair','Poor'];
const inp = { padding: '0.65rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#E8E8F0', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', outline: 'none' };

export default function Browse() {
  const [searchParams] = useSearchParams();
  const [search, setSearch]       = useState(searchParams.get('q') || '');
  const [brand, setBrand]         = useState(searchParams.get('brand') || 'All');
  const [condition, setCondition] = useState('All');
  const [maxPrice, setMaxPrice]   = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [listings, setListings]   = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.q = search;
    if (brand !== 'All') params.brand = brand;
    if (condition !== 'All') params.condition = condition;
    if (maxPrice) params.maxPrice = maxPrice;
    api.getListings(params).then(setListings).catch(() => setListings([])).finally(() => setLoading(false));
  }, [search, brand, condition, maxPrice]);

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F' }}>
      <div style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.75rem', color: '#E8E8F0', marginBottom: '1.25rem' }}>Browse Phones</h1>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px', display: 'flex', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', color: 'rgba(232,232,240,0.4)' }}><Search size={16}/></div>
              <input type="text" placeholder="Search brand, model..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ flex: 1, padding: '0.75rem 0', border: 'none', background: 'transparent', color: '#E8E8F0', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', outline: 'none' }} />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} style={{ ...inp, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Syne, sans-serif', fontWeight: 600, background: showFilters ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.06)', color: showFilters ? '#A78BFA' : '#E8E8F0' }}>
              <SlidersHorizontal size={15}/> Filters
            </button>
          </div>
          {showFilters && (
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <select value={brand} onChange={e => setBrand(e.target.value)} style={inp}>{brands.map(b => <option key={b} style={{ background: '#1A1A2E' }}>{b}</option>)}</select>
              <select value={condition} onChange={e => setCondition(e.target.value)} style={inp}>{conditions.map(c => <option key={c} style={{ background: '#1A1A2E' }}>{c}</option>)}</select>
              <input type="number" placeholder="Max price €" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={{ ...inp, width: '140px' }} />
              <button onClick={() => { setBrand('All'); setCondition('All'); setMaxPrice(''); setSearch(''); }} style={{ ...inp, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(232,232,240,0.5)' }}>
                <X size={13}/> Clear
              </button>
            </div>
          )}
        </div>
      </div>
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '2rem 1rem' }}>
        <p style={{ color: 'rgba(232,232,240,0.4)', marginBottom: '1.5rem', fontSize: '0.85rem', fontFamily: 'Syne, sans-serif' }}>
          {loading ? 'Loading...' : `${listings.length} listing${listings.length !== 1 ? 's' : ''} found`}
        </p>
        {!loading && listings.length === 0
          ? <div style={{ textAlign: 'center', padding: '4rem 0', color: 'rgba(232,232,240,0.4)' }}>No listings found.</div>
          : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
              {listings.map(l => <ListingCard key={l.id} listing={l}/>)}
            </div>
        }
      </div>
    </div>
  );
}
