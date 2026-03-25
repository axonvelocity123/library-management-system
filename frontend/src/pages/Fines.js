import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Fines() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { loadFines(); }, []);

  async function loadFines() {
    try { const res = await api.get('/fines'); setFines(res.data); }
    catch (err) { setError('Failed to load fines.'); }
    finally { setLoading(false); }
  }

  async function handlePay(id) {
    try { await api.patch(`/fines/${id}/pay`); setSuccess('Fine marked as paid.'); loadFines(); }
    catch (err) { setError('Failed to update fine.'); }
  }

  const total = fines.reduce((sum, f) => sum + parseFloat(f.amount), 0);
  const unpaid = fines.filter(f => !f.paid).reduce((sum, f) => sum + parseFloat(f.amount), 0);

  return (
    <div className="container" style={{paddingTop:'24px'}}>
      <div className="page-title">Fines</div>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="stats-grid" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
        <div className="stat-card"><div className="stat-number">{fines.length}</div><div className="stat-label">Total Fines</div></div>
        <div className="stat-card"><div className="stat-number" style={{color:'#ea4335'}}>PKR {unpaid.toFixed(0)}</div><div className="stat-label">Outstanding</div></div>
        <div className="stat-card"><div className="stat-number" style={{color:'#34a853'}}>PKR {(total-unpaid).toFixed(0)}</div><div className="stat-label">Collected</div></div>
      </div>
      <div className="card">
        {loading ? <div className="loading">Loading fines...</div> : (
          <table>
            <thead><tr><th>Fine ID</th><th>Member</th><th>Amount</th><th>Issued</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{fines.map(f => (
              <tr key={f.fine_id}>
                <td>{f.fine_id}</td>
                <td>{f.member_name}</td>
                <td><strong>PKR {f.amount}</strong></td>
                <td>{f.issued_date?.split('T')[0]}</td>
                <td><span className={`badge ${f.paid?'badge-paid':'badge-unpaid'}`}>{f.paid?'Paid':'Unpaid'}</span></td>
                <td>{!f.paid && <button className="btn btn-success" style={{padding:'4px 10px',fontSize:'12px'}} onClick={() => handlePay(f.fine_id)}>Mark Paid</button>}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}
