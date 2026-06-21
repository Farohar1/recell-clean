import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { Smartphone } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]     = useState({ email:'', password:'' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await login(form.email, form.password); navigate('/'); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const inp = { width:'100%', padding:'0.85rem 1rem', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', background:'rgba(255,255,255,0.05)', color:'#E8E8F0', fontFamily:'DM Sans, sans-serif', fontSize:'0.95rem', outline:'none', boxSizing:'border-box' };
  const lbl = { fontFamily:'Syne, sans-serif', fontWeight:600, fontSize:'0.8rem', color:'rgba(232,232,240,0.6)', display:'block', marginBottom:'0.4rem', textTransform:'uppercase', letterSpacing:'0.05em' };

  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0F', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', position:'relative' }}>
      <div style={{ position:'absolute', top:'20%', left:'50%', transform:'translateX(-50%)', width:'400px', height:'300px', background:'radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)', pointerEvents:'none' }}/>
      <div style={{ width:'100%', maxWidth:'400px', position:'relative' }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ width:48, height:48, borderRadius:'12px', background:'linear-gradient(135deg,#7C3AED,#06B6D4)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem' }}>
            <Smartphone size={22} color="#fff"/>
          </div>
          <h1 style={{ fontFamily:'Syne, sans-serif', fontWeight:800, color:'#E8E8F0', fontSize:'1.75rem', margin:'0 0 0.5rem' }}>Welcome back</h1>
          <p style={{ color:'rgba(232,232,240,0.5)', fontSize:'0.9rem', margin:0 }}>Sign in to your account</p>
        </div>
        <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'16px', padding:'2rem' }}>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div><label style={lbl}>Email</label><input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="you@example.com" style={inp} required/></div>
            <div><label style={lbl}>Password</label><input type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="••••••••" style={inp} required/></div>
            {error && <p style={{ color:'#F87171', fontSize:'0.85rem', margin:0 }}>{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop:'0.5rem', opacity:loading?0.7:1 }}>{loading?'Signing in...':'Sign In →'}</button>
          </form>
          <p style={{ textAlign:'center', color:'rgba(232,232,240,0.4)', fontSize:'0.85rem', marginTop:'1.25rem' }}>
            No account? <Link to="/register" style={{ color:'#A78BFA', textDecoration:'none', fontWeight:600 }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
