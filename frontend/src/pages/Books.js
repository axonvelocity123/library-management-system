import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [form, setForm] = useState({ title: '', author: '', isbn: '', published_year: '', total_copies: 1 });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const role = localStorage.getItem('role');

  useEffect(() => { loadBooks(); }, []);

  async function loadBooks() {
    try { const res = await api.get('/books'); setBooks(res.data); }
    catch (err) { setError('Failed to load books.'); }
    finally { setLoading(false); }
  }

  function openAdd() {
    setEditBook(null);
    setForm({ title: '', author: '', isbn: '', published_year: '', total_copies: 1 });
    setError('');
    setShowModal(true);
  }

  function openEdit(book) {
    setEditBook(book);
    setForm({ title: book.title, author: book.author, isbn: book.isbn, published_year: book.published_year || '', total_copies: book.total_copies || 1 });
    setError('');
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.author || !form.isbn) { setError('Title, author, and ISBN are required.'); return; }
    try {
      if (editBook) {
        await api.put(`/books/${editBook.book_id}`, form);
        setSuccess('Book updated.');
      } else {
        await api.post('/books', form);
        setSuccess('Book added successfully.');
      }
      setShowModal(false);
      loadBooks();
    } catch (err) { setError(err.response?.data?.error || 'Failed to save book.'); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this book?')) return;
    try { await api.delete(`/books/${id}`); setSuccess('Book deleted.'); loadBooks(); }
    catch (err) { setError('Failed to delete book.'); }
  }

  const filtered = books.filter(b =>
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.author?.toLowerCase().includes(search.toLowerCase()) ||
    b.isbn?.includes(search)
  );

  return (
    <div className="container" style={{paddingTop:'24px'}}>
      <div className="page-title">Books</div>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="search-bar">
        <input placeholder="Search by title, author or ISBN..." value={search} onChange={e => setSearch(e.target.value)} style={{maxWidth:'320px'}} />
        {(role === 'admin' || role === 'librarian') && <button className="btn btn-primary" onClick={openAdd}>+ Add Book</button>}
      </div>
      <div className="card">
        {loading ? <div className="loading">Loading books...</div> : (
          <table>
            <thead><tr><th>ID</th><th>Title</th><th>Author</th><th>ISBN</th><th>Year</th><th>Available Copies</th>{(role==='admin'||role==='librarian')&&<th>Actions</th>}</tr></thead>
            <tbody>{filtered.map(b => (
              <tr key={b.book_id}>
                <td>{b.book_id}</td>
                <td><strong>{b.title}</strong></td>
                <td>{b.author}</td>
                <td>{b.isbn}</td>
                <td>{b.published_year}</td>
                <td><span className={`badge ${parseInt(b.available_copies) > 0 ? 'badge-active' : 'badge-suspended'}`}>{b.available_copies} available</span></td>
                {(role==='admin'||role==='librarian')&&<td style={{display:'flex',gap:'6px'}}>
                  <button className="btn btn-warning" style={{padding:'4px 10px',fontSize:'12px'}} onClick={() => openEdit(b)}>Edit</button>
                  {role==='admin'&&<button className="btn btn-danger" style={{padding:'4px 10px',fontSize:'12px'}} onClick={() => handleDelete(b.book_id)}>Delete</button>}
                </td>}
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editBook ? 'Edit Book' : 'Add New Book'}</h3>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              {[['Title','title','text'],['Author','author','text'],['ISBN','isbn','text'],['Published Year','published_year','number']].map(([label,key,type]) => (
                <div className="form-group" key={key}>
                  <label>{label}</label>
                  <input type={type} value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})} />
                </div>
              ))}
              <div className="form-group">
                <label>Total Copies</label>
                <input type="number" min="1" value={form.total_copies} onChange={e => setForm({...form,total_copies:e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editBook ? 'Save Changes' : 'Add Book'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
