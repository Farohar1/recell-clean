// Sell.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { api } from '../lib/api';
import { CheckCircle, ImagePlus, X } from 'lucide-react';

const brandList = ['Apple','Samsung','Google','OnePlus','Xiaomi','Huawei','Sony','Nokia','Motorola','Other'];
const condList  = ['Like New','Good','Fair','Poor'];
const storList  = ['16GB','32GB','64GB','128GB','256GB','512GB','1TB'];
const maxImageBytes = 25 * 1024 * 1024;
const maxImageDataLength = 1_200_000;
const imageMaxSide = 1000;

const canvasToDataUrl = (canvas, quality) => new Promise(resolve => {
  if (canvas.toBlob) {
    canvas.toBlob(blob => {
      if (!blob) {
        resolve(canvas.toDataURL('image/jpeg', quality));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    }, 'image/jpeg', quality);
    return;
  }

  resolve(canvas.toDataURL('image/jpeg', quality));
});

const compressImage = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = () => reject(new Error('Could not read image'));
  reader.onload = () => {
    const img = new Image();
    img.onerror = () => reject(new Error('Could not load image'));
    img.onload = async () => {
      const scale = Math.min(1, imageMaxSide / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      for (const quality of [0.78, 0.68, 0.58, 0.48]) {
        const dataUrl = await canvasToDataUrl(canvas, quality);
        if (dataUrl.length <= maxImageDataLength) {
          resolve(dataUrl);
          return;
        }
      }

      const smallCanvas = document.createElement('canvas');
      const smallerScale = Math.min(1, 720 / Math.max(canvas.width, canvas.height));
      smallCanvas.width = Math.max(1, Math.round(canvas.width * smallerScale));
      smallCanvas.height = Math.max(1, Math.round(canvas.height * smallerScale));
      smallCanvas.getContext('2d').drawImage(canvas, 0, 0, smallCanvas.width, smallCanvas.height);
      const dataUrl = await canvasToDataUrl(smallCanvas, 0.5);
      if (dataUrl.length <= maxImageDataLength) resolve(dataUrl);
      else reject(new Error('Image is too large to process. Try another photo.'));
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

export default function Sell({ editMode = false }) {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate  = useNavigate();
  const [done, setDone]     = useState(null);
  const [error, setError]   = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(editMode);
  const [form, setForm]     = useState({ title:'', brand:'Apple', model:'', price:'', condition:'Good', storage:'128GB', color:'', description:'', location: user?.location || '', image:'' });

  useEffect(() => {
    if (!editMode || !user) {
      setPageLoading(false);
      return;
    }

    setPageLoading(true);
    api.getListing(id)
      .then(listing => {
        if (listing.seller_id !== user.id) {
          setError('You can only edit your own listings');
          return;
        }
        setForm({
          title: listing.title || '',
          brand: listing.brand || 'Apple',
          model: listing.model || '',
          price: listing.price ?? '',
          condition: listing.condition || 'Good',
          storage: listing.storage || '128GB',
          color: listing.color || '',
          description: listing.description || '',
          location: listing.location || user?.location || '',
          image: listing.image || ''
        });
      })
      .catch(err => setError(err.message))
      .finally(() => setPageLoading(false));
  }, [editMode, id, user]);

  if (!user) return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'1rem', background:'#0A0A0F' }}>
      <h2 style={{ fontFamily:'Syne, sans-serif', color:'#E8E8F0' }}>Login required</h2>
      <button onClick={() => navigate('/login')} className="btn-primary">Login</button>
    </div>
  );

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setFieldErrors(errors => {
      if (!errors[k]) return errors;
      const next = { ...errors };
      delete next[k];
      return next;
    });
  };

  const validateForm = () => {
    const errors = {};
    const price = Number(form.price);

    if (!form.title.trim()) errors.title = 'Listing title is required';
    if (!form.brand.trim()) errors.brand = 'Choose a brand';
    if (!form.condition.trim()) errors.condition = 'Choose the phone condition';
    if (form.price === '') errors.price = 'Price is required';
    else if (!Number.isFinite(price) || price <= 0) errors.price = 'Price must be greater than 0';
    if (form.image && !form.image.startsWith('data:image/')) errors.image = 'Choose a valid image file';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setFieldErrors(errors => ({ ...errors, image: 'Image must be a JPG, PNG or WebP file' }));
      setError('');
      e.target.value = '';
      return;
    }
    if (file.size > maxImageBytes) {
      setFieldErrors(errors => ({ ...errors, image: 'Image is very large. Choose a photo under 25MB.' }));
      setError('');
      e.target.value = '';
      return;
    }

    try {
      const image = await compressImage(file);
      set('image', image);
      setError('');
    } catch (err) {
      setFieldErrors(errors => ({ ...errors, image: err.message }));
      setError('');
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (!validateForm()) return;
    setLoading(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      const listing = editMode ? await api.updateListing(id, payload) : await api.createListing(payload);
      setDone(listing);
      setTimeout(() => navigate(`/listing/${listing.id}`), 1200);
    } catch (err) {
      setFieldErrors(err.fields || {});
      setError(Object.keys(err.fields || {}).length ? '' : err.message);
    }
    finally { setLoading(false); }
  };

  if (done) return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'1rem', background:'#0A0A0F' }}>
      <CheckCircle size={64} color="#34D399"/>
      <h2 style={{ fontFamily:'Syne, sans-serif', color:'#E8E8F0' }}>{editMode ? 'Listing updated!' : 'Listed successfully!'}</h2>
      <p style={{ color:'rgba(232,232,240,0.5)' }}>Redirecting...</p>
    </div>
  );

  if (pageLoading) return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0A0A0F', color:'rgba(232,232,240,0.4)' }}>
      Loading...
    </div>
  );

  const inp = { width:'100%', padding:'0.75rem 1rem', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', background:'rgba(255,255,255,0.05)', color:'#E8E8F0', fontFamily:'DM Sans, sans-serif', fontSize:'0.95rem', outline:'none', boxSizing:'border-box' };
  const lbl = { fontFamily:'Syne, sans-serif', fontWeight:600, fontSize:'0.8rem', color:'rgba(232,232,240,0.6)', display:'block', marginBottom:'0.4rem', textTransform:'uppercase', letterSpacing:'0.05em' };
  const inputStyle = (field) => ({ ...inp, borderColor: fieldErrors[field] ? 'rgba(248,113,113,0.8)' : 'rgba(255,255,255,0.1)' });
  const errText = { color:'#F87171', fontSize:'0.78rem', marginTop:'0.35rem' };
  const fieldError = (field) => fieldErrors[field] ? <p style={errText}>{fieldErrors[field]}</p> : null;

  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0F', padding:'3rem 1rem' }}>
      <div style={{ maxWidth:'580px', margin:'0 auto' }}>
        <span className="tag" style={{ marginBottom:'1rem', display:'inline-block' }}>{editMode ? 'Edit Listing' : 'New Listing'}</span>
        <h1 style={{ fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:'2rem', color:'#E8E8F0', marginBottom:'2rem' }}>{editMode ? 'Edit Your Phone Listing' : 'Sell Your Phone'}</h1>
        <form onSubmit={handleSubmit} noValidate style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div><label style={lbl}>Brand</label><select value={form.brand} onChange={e=>set('brand',e.target.value)} aria-invalid={Boolean(fieldErrors.brand)} style={inputStyle('brand')}>{brandList.map(b=><option key={b} style={{background:'#1A1A2E'}}>{b}</option>)}</select>{fieldError('brand')}</div>
            <div><label style={lbl}>Condition</label><select value={form.condition} onChange={e=>set('condition',e.target.value)} aria-invalid={Boolean(fieldErrors.condition)} style={inputStyle('condition')}>{condList.map(c=><option key={c} style={{background:'#1A1A2E'}}>{c}</option>)}</select>{fieldError('condition')}</div>
          </div>
          <div><label style={lbl}>Listing Title</label><input value={form.title} onChange={e=>set('title',e.target.value)} aria-invalid={Boolean(fieldErrors.title)} placeholder="e.g. iPhone 14 Pro 256GB" style={inputStyle('title')}/>{fieldError('title')}</div>
          <div><label style={lbl}>Model</label><input value={form.model} onChange={e=>set('model',e.target.value)} placeholder="e.g. iPhone 14 Pro" style={inputStyle('model')}/>{fieldError('model')}</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div><label style={lbl}>Price (€)</label><input type="number" value={form.price} onChange={e=>set('price',e.target.value)} aria-invalid={Boolean(fieldErrors.price)} placeholder="650" style={inputStyle('price')}/>{fieldError('price')}</div>
            <div><label style={lbl}>Storage</label><select value={form.storage} onChange={e=>set('storage',e.target.value)} aria-invalid={Boolean(fieldErrors.storage)} style={inputStyle('storage')}>{storList.map(s=><option key={s} style={{background:'#1A1A2E'}}>{s}</option>)}</select>{fieldError('storage')}</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div><label style={lbl}>Color</label><input value={form.color} onChange={e=>set('color',e.target.value)} aria-invalid={Boolean(fieldErrors.color)} placeholder="Midnight" style={inputStyle('color')}/>{fieldError('color')}</div>
            <div><label style={lbl}>Location</label><input value={form.location} onChange={e=>set('location',e.target.value)} aria-invalid={Boolean(fieldErrors.location)} placeholder="Berlin" style={inputStyle('location')}/>{fieldError('location')}</div>
          </div>
          <div>
            <label style={lbl}>Image</label>
            {form.image ? (
              <div style={{ position:'relative', height:'220px', border:`1px solid ${fieldErrors.image ? 'rgba(248,113,113,0.8)' : 'rgba(255,255,255,0.1)'}`, borderRadius:'8px', overflow:'hidden', background:'rgba(255,255,255,0.05)' }}>
                <img src={form.image} alt="Listing preview" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                <button type="button" onClick={() => set('image', '')} aria-label="Remove image" title="Remove image" style={{ position:'absolute', top:10, right:10, width:34, height:34, borderRadius:'8px', border:'1px solid rgba(248,113,113,0.35)', background:'rgba(15,15,24,0.82)', color:'#F87171', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                  <X size={16}/>
                </button>
              </div>
            ) : (
              <label style={{ minHeight:'150px', border:`1px dashed ${fieldErrors.image ? 'rgba(248,113,113,0.8)' : 'rgba(167,139,250,0.45)'}`, borderRadius:'8px', background:'rgba(255,255,255,0.04)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.6rem', color:'rgba(232,232,240,0.55)', cursor:'pointer', textAlign:'center', padding:'1.25rem' }}>
                <ImagePlus size={32} color="#A78BFA"/>
                <span style={{ fontFamily:'Syne, sans-serif', fontWeight:700, color:'#E8E8F0' }}>Add phone image</span>
                <span style={{ fontSize:'0.82rem' }}>JPG, PNG or WebP. Large photos are optimized automatically.</span>
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImage} style={{ display:'none' }}/>
              </label>
            )}
            {fieldError('image')}
          </div>
          <div><label style={lbl}>Description</label><textarea value={form.description} onChange={e=>set('description',e.target.value)} rows={4} aria-invalid={Boolean(fieldErrors.description)} placeholder="Describe condition, battery health, what's included..." style={{...inputStyle('description'),resize:'vertical'}}/>{fieldError('description')}</div>
          {error && <p style={{ color:'#F87171', fontSize:'0.85rem' }}>{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary" style={{ opacity:loading?0.7:1 }}>{loading ? (editMode ? 'Saving...' : 'Publishing...') : (editMode ? 'Save Changes →' : 'Publish Listing →')}</button>
        </form>
      </div>
    </div>
  );
}
