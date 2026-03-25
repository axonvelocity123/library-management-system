const express = require('express');
const router = express.Router();
const pool = require('../db');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.book_id, b.title, b.author, b.isbn, b.published_year,
             p.name AS publisher,
             COUNT(bc.copy_id) FILTER (WHERE bc.status = 'available') AS available_copies
      FROM books b
      LEFT JOIN publishers p ON b.publisher_id = p.publisher_id
      LEFT JOIN book_copies bc ON b.book_id = bc.book_id
      GROUP BY b.book_id, p.name
      ORDER BY b.title
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const book = await pool.query(
      'SELECT b.*, p.name AS publisher FROM books b LEFT JOIN publishers p ON b.publisher_id = p.publisher_id WHERE b.book_id = $1',
      [req.params.id]
    );
    if (book.rows.length === 0) return res.status(404).json({ error: 'Book not found.' });
    const copies = await pool.query(
      'SELECT copy_id, condition, status FROM book_copies WHERE book_id = $1',
      [req.params.id]
    );
    res.json({ ...book.rows[0], copies: copies.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', verifyToken, requireRole('admin', 'librarian'), async (req, res) => {
  const { title, author, isbn, publisher_id, published_year, total_copies } = req.body;
  if (!title || !author || !isbn)
    return res.status(400).json({ error: 'title, author, and isbn are required.' });
  try {
    const result = await pool.query(
      'INSERT INTO books (title, author, isbn, publisher_id, published_year, total_copies) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [title, author, isbn, publisher_id, published_year, total_copies || 1]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', verifyToken, requireRole('admin', 'librarian'), async (req, res) => {
  const { title, author, isbn, published_year, total_copies } = req.body;
  if (!title || !author || !isbn)
    return res.status(400).json({ error: 'title, author, and isbn are required.' });
  try {
    const result = await pool.query(
      'UPDATE books SET title=$1, author=$2, isbn=$3, published_year=$4, total_copies=$5 WHERE book_id=$6 RETURNING *',
      [title, author, isbn, published_year, total_copies, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Book not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM books WHERE book_id = $1', [req.params.id]);
    res.json({ message: 'Book deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
