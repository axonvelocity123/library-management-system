import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f0eb' },
  card: { background: 'white', padding: '44px', borderRadius: '12px', boxShadow: '0 4px 24px rgba(67,40,24,0.15)', width: '420px', borderTop: '4px solid #432818' },
  logo: { fontSize: '26px', fontWeight: '800', marginBottom: '6px', color: '#432818', textAlign: 'center' },
  subtitle: { color: '#888', fontSize: '13px', textAlign: 'center', marginBottom: '28px', lineHeight: '1.5' },
  btn: { width: '100%', padding: '12px', background: '#432818', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' },
  link: { display: 'block', textAlign: 'center', marginTop: '16px', color: '#432818', fontSize: '14px', textDecoration: 'none' }
};

export default function Register() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    if (!form.full_name || !form.email) { setError('Name and email are required.'); return; }
    setLoading(true); setError('');
    try {
      await api.post('/members', form);
      setSuccess('Pre-registration successful! Visit the library with your ID to activate your card.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Email may already be registered.');
    } finally { setLoading(false); }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>📚 Library Management</div>
        <div style={styles.subtitle}>Skip the queue — pre-register for your library card online.<br/>A librarian will activate your account within 24 hours.</div>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleRegister}>
          {[['Full Name','full_name','text'],['Email Address','email','email'],['Phone Number','phone','text'],['Address','address','text']].map(([label,key,type]) => (
            <div className="form-group" key={key}>
              <label>{label}</label>
              <input type={type} value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})} placeholder={label} />
            </div>
          ))}
          <button style={styles.btn} disabled={loading}>{loading ? 'Registering...' : 'Pre-Register'}</button>
        </form>
        <Link to="/login" style={styles.link}>← Back to staff login</Link>
      </div>
    </div>
  );
}
