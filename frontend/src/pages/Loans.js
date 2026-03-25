import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [borrowForm, setBorrowForm] = useState({ member_id: '', book_id: '' });
  const [returnLoanId, setReturnLoanId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [borrowResult, setBorrowResult] = useState(null);
  const [returnResult, setReturnResult] = useState(null);

  useEffect(() => { loadLoans(); }, []);

  async function loadLoans() {
    try { const res = await api.get('/loans'); setLoans(res.data); }
    catch (err) { setError('Failed to load loans.'); }
    finally { setLoading(false); }
  }

  async function handleBorrow(e) {
    e.preventDefault();
    if (!borrowForm.member_id || !borrowForm.book_id) { setError('Member ID and Book ID are required.'); return; }
    setError(''); setSuccess(''); setBorrowResult(null);
    try {
      const res = await api.post('/loans/borrow', { member_id: parseInt(borrowForm.member_id), book_id: parseInt(borrowForm.book_id) });
      setBorrowResult({ type: 'success', data: res.data });
      setSuccess('Book borrowed successfully!');
      setBorrowForm({ member_id: '', book_id: '' });
      loadLoans();
    } catch (err) {
      setBorrowResult({ type: 'error', message: err.response?.data?.error || 'Transaction failed and rolled back.' });
      setError(err.response?.data?.error || 'Borrow failed.');
    }
  }

  async function handleReturn(e) {
    e.preventDefault();
    if (!returnLoanId) { setError('Loan ID is required.'); return; }
    setError(''); setSuccess(''); setReturnResult(null);
    try {
      const res = await api.post('/loans/return', { loan_id: parseInt(returnLoanId) });
      setReturnResult({ type: 'success', data: res.data });
      setSuccess('Book returned successfully!');
      setReturnLoanId('');
      loadLoans();
    } catch (err) {
      setReturnResult({ type: 'error', message: err.response?.data?.error || 'Return failed.' });
      setError(err.response?.data?.error || 'Return failed.');
    }
  }

  const today = new Date().toISOString().split('T')[0];
  const filtered = loans.filter(l => {
    if (filter === 'active') return !l.return_date && l.due_date?.split('T')[0] >= today;
    if (filter === 'returned') return !!l.return_date;
    if (filter === 'overdue') return !l.return_date && l.due_date?.split('T')[0] < today;
    return true;
  });

  return (
    <div className="container" style={{paddingTop:'24px'}}>
      <div className="page-title">Loans</div>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'24px'}}>
        <div className="card">
          <h3 style={{marginBottom:'16px', fontSize:'16px', fontWeight:'600'}}>Borrow a Book</h3>
          <form onSubmit={handleBorrow}>
            <div className="form-group">
              <label>Member ID</label>
              <input type="number" placeholder="e.g. 1" value={borrowForm.member_id} onChange={e => setBorrowForm({...borrowForm,member_id:e.target.value})} />
            </div>
            <div className="form-group">
              <label>Book ID</label>
              <input type="number" placeholder="e.g. 1" value={borrowForm.book_id} onChange={e => setBorrowForm({...borrowForm,book_id:e.target.value})} />
            </div>
            <button type="submit" className="btn btn-primary" style={{width:'100%'}}>Borrow Book</button>
          </form>
          {borrowResult && (
            <div style={{marginTop:'12px'}} className={`alert ${borrowResult.type==='success'?'alert-success':'alert-error'}`}>
              {borrowResult.type==='success'
                ? `Loan created. Loan ID: ${borrowResult.data.loan?.loan_id}, Due: ${borrowResult.data.loan?.due_date?.split('T')[0]}`
                : `Rolled back: ${borrowResult.message}`}
            </div>
          )}
        </div>
        <div className="card">
          <h3 style={{marginBottom:'16px', fontSize:'16px', fontWeight:'600'}}>Return a Book</h3>
          <form onSubmit={handleReturn}>
            <div className="form-group">
              <label>Loan ID</label>
              <input type="number" placeholder="e.g. 1" value={returnLoanId} onChange={e => setReturnLoanId(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-success" style={{width:'100%'}}>Return Book</button>
          </form>
          {returnResult && (
            <div style={{marginTop:'12px'}} className={`alert ${returnResult.type==='success'?'alert-success':'alert-error'}`}>
              {returnResult.type==='success'
                ? `Returned. ${returnResult.data.fine ? `Fine: PKR ${returnResult.data.fine.amount}` : 'No fine.'}`
                : `Rolled back: ${returnResult.message}`}
            </div>
          )}
        </div>
      </div>
      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px'}}>
          <h3 style={{fontSize:'16px', fontWeight:'600'}}>All Loans</h3>
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{width:'160px'}}>
            <option value="all">All Loans</option>
            <option value="active">Active</option>
            <option value="returned">Returned</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
        {loading ? <div className="loading">Loading...</div> : (
          <table>
            <thead><tr><th>Loan ID</th><th>Member</th><th>Book</th><th>Borrowed</th><th>Due</th><th>Status</th></tr></thead>
            <tbody>{filtered.map(l => (
              <tr key={l.loan_id}>
                <td>{l.loan_id}</td>
                <td>{l.member_name}</td>
                <td>{l.book_title}</td>
                <td>{l.borrow_date?.split('T')[0]}</td>
                <td>{l.due_date?.split('T')[0]}</td>
                <td>{l.return_date
                  ? <span className="badge badge-active">Returned</span>
                  : l.due_date?.split('T')[0] < today
                    ? <span className="badge badge-suspended">Overdue</span>
                    : <span className="badge badge-borrowed">Active</span>}
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}
