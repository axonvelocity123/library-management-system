import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function LibrarianDashboard() {
  const [stats, setStats] = useState({ books: 0, members: 0, loans: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const [books, members, loans] = await Promise.all([
          api.get('/books'), api.get('/members'), api.get('/loans')
        ]);
        setStats({ books: books.data.length, members: members.data.length, loans: loans.data.length });
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container" style={{paddingTop:'24px'}}>
      <div className="page-title">Librarian Dashboard</div>
      <div className="stats-grid">
        {[['Total Books', stats.books, '#1a73e8', '/books'], ['Members', stats.members, '#34a853', '/members'], ['Active Loans', stats.loans, '#f57c00', '/loans']].map(([label, val, color, path]) => (
          <div className="stat-card" key={label} style={{cursor:'pointer'}} onClick={() => navigate(path)}>
            <div className="stat-number" style={{color}}>{val}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <h3 style={{marginBottom:'16px'}}>Quick Actions</h3>
        <div style={{display:'flex', gap:'12px', flexWrap:'wrap'}}>
          <button className="btn btn-primary" onClick={() => navigate('/loans')}>Borrow a Book</button>
          <button className="btn btn-success" onClick={() => navigate('/loans')}>Return a Book</button>
          <button className="btn btn-warning" onClick={() => navigate('/members')}>Register Member</button>
          <button className="btn btn-secondary" onClick={() => navigate('/fines')}>View Fines</button>
        </div>
      </div>
    </div>
  );
}
