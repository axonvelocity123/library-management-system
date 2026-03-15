const express = require('express');
const router = express.Router();
const pool = require('../db');
const { verifyToken, requireRole } = require('../middleware/auth');

// POST /api/v1/loans/borrow - borrow a book (librarian, admin)
// Full ACID transaction: check member -> check fines -> lock copy -> create loan
router.post('/borrow', verifyToken, requireRole('admin', 'librarian'), async (req, res) => {
  const { member_id, book_id } = req.body;
  if (!member_id || !book_id)
    return res.status(400).json({ error: 'member_id and book_id are required.' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Step 1: Check member exists and is active
    const memberResult = await client.query(
      'SELECT * FROM members WHERE member_id = $1',
      [member_id]
    );
    if (memberResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Member not found.' });
    }
    const member = memberResult.rows[0];
    if (member.status !== 'active') {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: `Member account is ${member.status}. Cannot borrow.` });
    }

    // Step 2: Check member has no unpaid fines
    const finesResult = await client.query(
      'SELECT COALESCE(SUM(amount), 0) AS total FROM fines WHERE member_id = $1 AND paid = FALSE',
      [member_id]
    );
    if (parseFloat(finesResult.rows[0].total) > 0) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: `Member has unpaid fines of PKR ${finesResult.rows[0].total}. Clear fines before borrowing.` });
    }

    // Step 3: Find an available copy and lock it (SELECT FOR UPDATE prevents double booking)
    const copyResult = await client.query(
      `SELECT copy_id FROM book_copies
       WHERE book_id = $1 AND status = 'available'
       LIMIT 1
       FOR UPDATE`,
      [book_id]
    );
    if (copyResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'No available copies. Please make a reservation.' });
    }
    const copy_id = copyResult.rows[0].copy_id;

    // Step 4: Create the loan (due date = 14 days from today)
    const loanResult = await client.query(
      `INSERT INTO loans (member_id, copy_id, staff_id, borrow_date, due_date)
       VALUES ($1, $2, $3, CURRENT_DATE, CURRENT_DATE + 14)
       RETURNING *`,
      [member_id, copy_id, req.user.id]
    );

    // Steps 5 & 6: Triggers handle copy status update and audit_log automatically

    await client.query('COMMIT');
    res.status(201).json({ message: 'Book borrowed successfully.', loan: loanResult.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Transaction failed. Rolled back.', detail: err.message });
  } finally {
    client.release();
  }
});

// POST /api/v1/loans/return - return a book (librarian, admin)
// Full ACID transaction: update loan -> trigger auto-fine -> trigger update copy status
router.post('/return', verifyToken, requireRole('admin', 'librarian'), async (req, res) => {
  const { loan_id } = req.body;
  if (!loan_id)
    return res.status(400).json({ error: 'loan_id is required.' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Step 1: Verify loan exists and is not already returned
    const loanResult = await client.query(
      'SELECT * FROM loans WHERE loan_id = $1',
      [loan_id]
    );
    if (loanResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Loan not found.' });
    }
    if (loanResult.rows[0].return_date !== null) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'This loan has already been returned.' });
    }

    // Step 2: Set return date — this fires both triggers automatically:
    //   trg_auto_fine: calculates fine if overdue, inserts into fines
    //   trg_update_copy_status: sets copy back to 'available'
    const updatedLoan = await client.query(
      'UPDATE loans SET return_date = CURRENT_DATE WHERE loan_id = $1 RETURNING *',
      [loan_id]
    );

    // Step 3: Check if a fine was generated
    const fineResult = await client.query(
      'SELECT * FROM fines WHERE loan_id = $1',
      [loan_id]
    );

    // Step 4: Check for pending reservations for this book
    const reservationResult = await client.query(
      `SELECT r.reservation_id, r.member_id
       FROM reservations r
       JOIN book_copies bc ON bc.book_id = r.book_id
       WHERE bc.copy_id = $1 AND r.status = 'pending'
       ORDER BY r.reserved_date ASC
       LIMIT 1`,
      [updatedLoan.rows[0].copy_id]
    );

    await client.query('COMMIT');

    res.json({
      message: 'Book returned successfully.',
      loan: updatedLoan.rows[0],
      fine: fineResult.rows[0] || null,
      next_reservation: reservationResult.rows[0] || null
    });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Transaction failed. Rolled back.', detail: err.message });
  } finally {
    client.release();
  }
});

// GET /api/v1/loans - get all active loans (admin, librarian)
router.get('/', verifyToken, requireRole('admin', 'librarian'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT l.loan_id, m.full_name AS member_name, b.title AS book_title,
             l.borrow_date, l.due_date, l.return_date
      FROM loans l
      JOIN members m ON l.member_id = m.member_id
      JOIN book_copies bc ON l.copy_id = bc.copy_id
      JOIN books b ON bc.book_id = b.book_id
      ORDER BY l.borrow_date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/loans/overdue - get overdue loans from view (admin, librarian)
router.get('/overdue', verifyToken, requireRole('admin', 'librarian'), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM overdue_loans_report');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
