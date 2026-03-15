-- performance.sql: EXPLAIN ANALYZE before/after indexing

-- QUERY 1: Member lookup by email

DROP INDEX IF EXISTS idx_members_email;

EXPLAIN ANALYZE
SELECT member_id, full_name, status
FROM members
WHERE email = 'ali.hassan@gmail.com';

CREATE INDEX idx_members_email ON members(email);

EXPLAIN ANALYZE
SELECT member_id, full_name, status
FROM members
WHERE email = 'ali.hassan@gmail.com';


-- QUERY 2: Active loans for a member

DROP INDEX IF EXISTS idx_loans_member_return;

EXPLAIN ANALYZE
SELECT l.loan_id, l.borrow_date, l.due_date, bc.book_id
FROM loans l
JOIN book_copies bc ON l.copy_id = bc.copy_id
WHERE l.member_id = 1
  AND l.return_date IS NULL;

CREATE INDEX idx_loans_member_return ON loans(member_id, return_date);

EXPLAIN ANALYZE
SELECT l.loan_id, l.borrow_date, l.due_date, bc.book_id
FROM loans l
JOIN book_copies bc ON l.copy_id = bc.copy_id
WHERE l.member_id = 1
  AND l.return_date IS NULL;


-- QUERY 3: Available copies of a book

DROP INDEX IF EXISTS idx_copies_book_status;

EXPLAIN ANALYZE
SELECT copy_id, condition, status
FROM book_copies
WHERE book_id = 1
  AND status = 'available';

CREATE INDEX idx_copies_book_status ON book_copies(book_id, status);

EXPLAIN ANALYZE
SELECT copy_id, condition, status
FROM book_copies
WHERE book_id = 1
  AND status = 'available';


-- Restore remaining indexes
CREATE INDEX IF NOT EXISTS idx_books_isbn        ON books(isbn);
CREATE INDEX IF NOT EXISTS idx_books_author      ON books(author);
CREATE INDEX IF NOT EXISTS idx_loans_member_id   ON loans(member_id);
CREATE INDEX IF NOT EXISTS idx_fines_member_paid ON fines(member_id, paid);
