import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Browse from './pages/Browse';
import ListingDetail from './pages/ListingDetail';
import Sell from './pages/Sell';
import Messages from './pages/Messages';
import MyListings from './pages/MyListings';
import Login from './pages/Login';
import Register from './pages/Register';

function Layout({ children }) {
  return (
    <>
      <Navbar/>
      <main>{children}</main>
      <footer style={{ background:'rgba(255,255,255,0.02)', borderTop:'1px solid rgba(255,255,255,0.06)', padding:'2rem 1rem', textAlign:'center' }}>
        <p style={{ color:'rgba(232,232,240,0.3)', fontFamily:'Syne, sans-serif', fontSize:'0.85rem', margin:0 }}>
          © 2024 ReCell Mobile — Buy & sell phones you can trust.
        </p>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login"    element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/"           element={<Layout><Home/></Layout>}/>
          <Route path="/browse"     element={<Layout><Browse/></Layout>}/>
          <Route path="/listing/:id" element={<Layout><ListingDetail/></Layout>}/>
          <Route path="/listing/:id/edit" element={<Layout><Sell editMode/></Layout>}/>
          <Route path="/sell"       element={<Layout><Sell/></Layout>}/>
          <Route path="/messages"   element={<Layout><Messages/></Layout>}/>
          <Route path="/my-listings" element={<Layout><MyListings/></Layout>}/>
          <Route path="*" element={<Layout><div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(232,232,240,0.3)',fontFamily:'Syne,sans-serif',fontSize:'3rem',fontWeight:800}}>404</div></Layout>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
