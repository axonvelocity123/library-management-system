import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ books: 0, members: 0, loans: 0, fines: 0 });
  const [overdue, setOverdue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [books, members, loans, fines, overdueRes] = await Promise.all([
          api.get('/books'), api.get('/members'), api.get('/loans'),
          api.get('/fines'), api.get('/loans/overdue')
        ]);
        setStats({ books: books.data.length, members: members.data.length, loans: loans.data.length, fines: fines.data.length });
        setOverdue(overdueRes.data.slice(0, 5));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="container" style={{paddingTop:'24px'}}>
      <div className="page-title">Admin Dashboard</div>
      <div className="stats-grid">
        {[['Total Books', stats.books, '#1a73e8'], ['Members', stats.members, '#34a853'], ['Active Loans', stats.loans, '#f57c00'], ['Fines Issued', stats.fines, '#ea4335']].map(([label, val, color]) => (
          <div className="stat-card" key={label}>
            <div className="stat-number" style={{color}}>{val}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <h3 style={{marginBottom:'16px', fontSize:'16px', fontWeight:'600'}}>Overdue Loans</h3>
        {overdue.length === 0 ? <p style={{color:'#666'}}>No overdue loans.</p> : (
          <table>
            <thead><tr><th>Member</th><th>Book</th><th>Due Date</th><th>Days Overdue</th></tr></thead>
            <tbody>{overdue.map(l => (
              <tr key={l.loan_id}>
                <td>{l.member_name}</td>
                <td>{l.book_title}</td>
                <td>{l.due_date?.split('T')[0]}</td>
                <td><span style={{color:'#ea4335', fontWeight:'600'}}>{l.days_overdue} days</span></td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}
