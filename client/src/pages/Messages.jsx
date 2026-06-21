import { useAuth } from '../lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Inbox } from 'lucide-react';
import { api } from '../lib/api';

export default function Messages() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!user) return;
    api.getMessages().then(setMessages).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  if (!user) return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'1rem', background:'#0A0A0F' }}>
      <h2 style={{ fontFamily:'Syne, sans-serif', color:'#E8E8F0' }}>Login required</h2>
      <button onClick={() => navigate('/login')} className="btn-primary">Login</button>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0F', padding:'3rem 1rem' }}>
      <div style={{ maxWidth:'700px', margin:'0 auto' }}>
        <span className="tag" style={{ marginBottom:'1rem', display:'inline-block' }}>Inbox</span>
        <h1 style={{ fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:'2rem', color:'#E8E8F0', marginBottom:'2rem' }}>Messages</h1>
        {loading ? <p style={{ color:'rgba(232,232,240,0.4)' }}>Loading...</p>
        : messages.length === 0 ? (
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px', padding:'4rem', textAlign:'center' }}>
            <Inbox size={44} color="rgba(167,139,250,0.3)" style={{ marginBottom:'1rem' }}/>
            <p style={{ color:'rgba(232,232,240,0.4)', fontFamily:'Syne, sans-serif' }}>No messages yet</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            {messages.map(m => {
              const isSender = m.sender_id === user.id;
              return (
                <div key={m.id} onClick={() => navigate(`/listing/${m.listing_id}`)} className="card-hover"
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'12px', padding:'1.25rem', cursor:'pointer' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.5rem' }}>
                    <span style={{ fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:'0.85rem', color:'#A78BFA' }}>{m.listing_title}</span>
                    <span className="tag" style={{ fontSize:'0.7rem' }}>{isSender ? 'Sent' : 'Received'}</span>
                  </div>
                  <p style={{ color:'rgba(232,232,240,0.6)', fontSize:'0.9rem', margin:0, lineHeight:1.5 }}>{m.content}</p>
                  <p style={{ color:'rgba(232,232,240,0.3)', fontSize:'0.75rem', margin:'0.5rem 0 0' }}>{isSender ? `To: ${m.recipient_name}` : `From: ${m.sender_name}`}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
