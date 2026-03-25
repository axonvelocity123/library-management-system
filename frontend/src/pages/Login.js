import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f0eb' },
  card: { background: 'white', padding: '44px', borderRadius: '12px', boxShadow: '0 4px 24px rgba(67,40,24,0.15)', width: '400px', borderTop: '4px solid #432818' },
  logo: { fontSize: '28px', fontWeight: '800', marginBottom: '6px', color: '#432818', textAlign: 'center' },
  subtitle: { color: '#888', fontSize: '14px', textAlign: 'center', marginBottom: '32px' },
  btn: { width: '100%', padding: '12px', background: '#432818', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' },
  link: { display: 'block', textAlign: 'center', marginTop: '16px', color: '#432818', fontSize: '14px', textDecoration: 'none' },
  hint: { marginTop: '12px', fontSize: '12px', color: '#aaa', textAlign: 'center' }
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) { setError('Email and password are required.'); return; }
    setLoading(true); setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name);
      navigate(res.data.role === 'admin' ? '/admin' : '/librarian');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally { setLoading(false); }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>📚 Library Management</div>
        <div style={styles.subtitle}>Staff portal — sign in to continue</div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@library.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button style={styles.btn} disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <div style={styles.hint}>Default: admin@library.com / password123</div>
        <Link to="/register" style={styles.link}>New member? Pre-register online →</Link>
      </div>
    </div>
  );
}
