const express = require('express');
const router = express.Router();
const pool = require('../db');
const { verifyToken, requireRole } = require('../middleware/auth');

// GET /api/v1/members - get all members (admin, librarian)
router.get('/', verifyToken, requireRole('admin', 'librarian'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT member_id, full_name, email, phone, membership_date, status FROM members ORDER BY full_name'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/members/:id - get single member
router.get('/:id', verifyToken, requireRole('admin', 'librarian'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT member_id, full_name, email, phone, address, membership_date, status FROM members WHERE member_id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Member not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/members - register new member (admin, librarian)
router.post('/', async (req, res) => {
  const { full_name, email, phone, address } = req.body;
  if (!full_name || !email)
    return res.status(400).json({ error: 'full_name and email are required.' });

  try {
    const result = await pool.query(
      'INSERT INTO members (full_name, email, phone, address) VALUES ($1,$2,$3,$4) RETURNING *',
      [full_name, email, phone, address]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/v1/members/:id/status - suspend or activate member (admin only)
router.patch('/:id/status', verifyToken, requireRole('admin'), async (req, res) => {
  const { status } = req.body;
  if (!['active', 'suspended', 'expired'].includes(status))
    return res.status(400).json({ error: 'Invalid status value.' });

  try {
    const result = await pool.query(
      'UPDATE members SET status = $1 WHERE member_id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Member not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/members/:id/fines - get unpaid fines for a member
router.get('/:id/fines', verifyToken, requireRole('admin', 'librarian'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM fines WHERE member_id = $1 AND paid = FALSE ORDER BY issued_date DESC',
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
