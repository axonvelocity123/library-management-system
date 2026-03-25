import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const role = localStorage.getItem('role');

  useEffect(() => { loadMembers(); }, []);

  async function loadMembers() {
    try { const res = await api.get('/members'); setMembers(res.data); }
    catch (err) { setError('Failed to load members.'); }
    finally { setLoading(false); }
  }

  function openAdd() {
    setEditMember(null);
    setForm({ full_name: '', email: '', phone: '', address: '' });
    setError('');
    setShowModal(true);
  }

  function openEdit(member) {
    setEditMember(member);
    setForm({ full_name: member.full_name, email: member.email, phone: member.phone || '', address: member.address || '' });
    setError('');
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.full_name || !form.email) { setError('Name and email are required.'); return; }
    try {
      await api.post('/members', form);
      setSuccess(editMember ? 'Member updated.' : 'Member registered.');
      setShowModal(false);
      setForm({ full_name: '', email: '', phone: '', address: '' });
      loadMembers();
    } catch (err) { setError(err.response?.data?.error || 'Failed to save member.'); }
  }

  async function handleStatusChange(id, status) {
    try { await api.patch(`/members/${id}/status`, { status }); setSuccess('Status updated.'); loadMembers(); }
    catch (err) { setError('Failed to update status.'); }
  }

  const filtered = members.filter(m => {
    const matchSearch = m.full_name?.toLowerCase().includes(search.toLowerCase()) || m.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="container" style={{paddingTop:'24px'}}>
      <div className="page-title">Members</div>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="search-bar">
        <input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} style={{maxWidth:'260px'}} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{maxWidth:'160px'}}>
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="expired">Expired</option>
        </select>
        <button className="btn btn-primary" onClick={openAdd}>+ Register Member</button>
      </div>
      <div className="card">
        {loading ? <div className="loading">Loading members...</div> : (
          <table>
<thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Member Since</th><th>Status</th><th>Actions</th></tr></thead>            <tbody>{filtered.map(m => (
              <tr key={m.member_id}>
<td>{m.member_id}</td>
<td><strong>{m.full_name}</strong></td>                <td>{m.email}</td>
                <td>{m.phone || '—'}</td>
                <td>{m.membership_date?.split('T')[0]}</td>
                <td><span className={`badge badge-${m.status}`}>{m.status}</span></td>
                <td style={{display:'flex',gap:'6px'}}>
                  <button className="btn btn-warning" style={{padding:'4px 8px',fontSize:'12px'}} onClick={() => openEdit(m)}>Edit</button>
                  {role==='admin' && m.status!=='active' && <button className="btn btn-success" style={{padding:'4px 8px',fontSize:'12px'}} onClick={()=>handleStatusChange(m.member_id,'active')}>Activate</button>}
                  {role==='admin' && m.status==='active' && <button className="btn btn-danger" style={{padding:'4px 8px',fontSize:'12px'}} onClick={()=>handleStatusChange(m.member_id,'suspended')}>Suspend</button>}
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editMember ? 'Edit Member' : 'Register New Member'}</h3>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              {[['Full Name','full_name'],['Email','email'],['Phone','phone'],['Address','address']].map(([label,key]) => (
                <div className="form-group" key={key}>
                  <label>{label}</label>
                  <input type={key==='email'?'email':'text'} value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})} />
                </div>
              ))}
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editMember ? 'Save Changes' : 'Register'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
