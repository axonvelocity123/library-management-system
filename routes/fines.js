const express = require('express');
const router = express.Router();
const pool = require('../db');
const { verifyToken, requireRole } = require('../middleware/auth');

// GET /api/v1/fines - get all fines (admin, librarian)
router.get('/', verifyToken, requireRole('admin', 'librarian'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT f.fine_id, m.full_name AS member_name, f.amount, f.issued_date, f.paid
      FROM fines f
      JOIN members m ON f.member_id = m.member_id
      ORDER BY f.issued_date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/v1/fines/:id/pay - mark fine as paid (librarian, admin)
router.patch('/:id/pay', verifyToken, requireRole('admin', 'librarian'), async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE fines SET paid = TRUE WHERE fine_id = $1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Fine not found.' });
    res.json({ message: 'Fine marked as paid.', fine: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/fines/revenue - monthly revenue from view (admin only)
router.get('/revenue', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM monthly_fine_revenue');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
