import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const styles = {
  nav: { background: '#432818', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '58px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' },
  brand: { color: 'white', fontWeight: '700', fontSize: '18px', textDecoration: 'none', letterSpacing: '0.3px' },
  links: { display: 'flex', gap: '4px', alignItems: 'center' },
  link: { color: 'rgba(255,255,255,0.85)', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '14px', transition: 'background 0.2s' },
  btn: { background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', marginLeft: '8px' },
  userInfo: { color: 'rgba(255,255,255,0.65)', fontSize: '13px', marginRight: '4px' }
};

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name');

  function logout() {
    localStorage.clear();
    navigate('/login');
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>📚 Library MS</Link>
      <div style={styles.links}>
        <Link to="/books" style={styles.link}>Books</Link>
        <Link to="/members" style={styles.link}>Members</Link>
        <Link to="/loans" style={styles.link}>Loans</Link>
        <Link to="/fines" style={styles.link}>Fines</Link>
        {role === 'admin' && <Link to="/analytics" style={styles.link}>Analytics</Link>}
        {role === 'admin' && <Link to="/admin" style={styles.link}>Dashboard</Link>}
        <span style={styles.userInfo}>{name} ({role})</span>
        <button style={styles.btn} onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
