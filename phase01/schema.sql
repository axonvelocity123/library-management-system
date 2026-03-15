-- schema.sql: Library Management System

DROP TABLE IF EXISTS audit_log          CASCADE;
DROP TABLE IF EXISTS fines              CASCADE;
DROP TABLE IF EXISTS reservations       CASCADE;
DROP TABLE IF EXISTS loans              CASCADE;
DROP TABLE IF EXISTS book_category_map  CASCADE;
DROP TABLE IF EXISTS book_copies        CASCADE;
DROP TABLE IF EXISTS books              CASCADE;
DROP TABLE IF EXISTS categories         CASCADE;
DROP TABLE IF EXISTS publishers         CASCADE;
DROP TABLE IF EXISTS members            CASCADE;
DROP TABLE IF EXISTS staff              CASCADE;

DROP VIEW IF EXISTS overdue_loans_report;
DROP VIEW IF EXISTS monthly_fine_revenue;
DROP VIEW IF EXISTS popular_books;

DROP FUNCTION IF EXISTS fn_auto_fine()          CASCADE;
DROP FUNCTION IF EXISTS fn_update_copy_status() CASCADE;


-- TABLES

CREATE TABLE publishers (
    publisher_id   SERIAL        PRIMARY KEY,
    name           VARCHAR(150)  NOT NULL,
    country        VARCHAR(100),
    contact_email  VARCHAR(150)  UNIQUE
);

CREATE TABLE categories (
    category_id   SERIAL       PRIMARY KEY,
    name          VARCHAR(100) NOT NULL UNIQUE,
    description   TEXT
);

CREATE TABLE members (
    member_id       SERIAL       PRIMARY KEY,
    full_name       VARCHAR(150) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    phone           VARCHAR(20),
    address         TEXT,
    membership_date DATE         NOT NULL DEFAULT CURRENT_DATE,
    status          VARCHAR(20)  NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'suspended', 'expired'))
);

CREATE TABLE staff (
    staff_id      SERIAL       PRIMARY KEY,
    full_name     VARCHAR(150) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'librarian'
                  CHECK (role IN ('admin', 'librarian'))
);

CREATE TABLE books (
    book_id        SERIAL        PRIMARY KEY,
    title          VARCHAR(255)  NOT NULL,
    author         VARCHAR(150)  NOT NULL,
    isbn           VARCHAR(20)   NOT NULL UNIQUE,
    publisher_id   INT           REFERENCES publishers(publisher_id) ON DELETE SET NULL,
    published_year INT           CHECK (published_year >= 1000 AND published_year <= 2100),
    total_copies   INT           NOT NULL DEFAULT 1 CHECK (total_copies >= 0)
);

CREATE TABLE book_copies (
    copy_id   SERIAL      PRIMARY KEY,
    book_id   INT         NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
    condition VARCHAR(20) NOT NULL DEFAULT 'good'
              CHECK (condition IN ('good', 'fair', 'damaged')),
    status    VARCHAR(20) NOT NULL DEFAULT 'available'
              CHECK (status IN ('available', 'borrowed', 'reserved', 'lost'))
);

CREATE TABLE book_category_map (
    book_id     INT NOT NULL REFERENCES books(book_id)          ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, category_id)
);

CREATE TABLE loans (
    loan_id     SERIAL PRIMARY KEY,
    member_id   INT    NOT NULL REFERENCES members(member_id)   ON DELETE RESTRICT,
    copy_id     INT    NOT NULL REFERENCES book_copies(copy_id) ON DELETE RESTRICT,
    staff_id    INT    REFERENCES staff(staff_id)               ON DELETE SET NULL,
    borrow_date DATE   NOT NULL DEFAULT CURRENT_DATE,
    due_date    DATE   NOT NULL,
    return_date DATE,
    CHECK (due_date > borrow_date)
);

CREATE TABLE reservations (
    reservation_id SERIAL      PRIMARY KEY,
    member_id      INT         NOT NULL REFERENCES members(member_id) ON DELETE CASCADE,
    book_id        INT         NOT NULL REFERENCES books(book_id)     ON DELETE CASCADE,
    reserved_date  DATE        NOT NULL DEFAULT CURRENT_DATE,
    status         VARCHAR(20) NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'fulfilled', 'cancelled'))
);

CREATE TABLE fines (
    fine_id     SERIAL         PRIMARY KEY,
    loan_id     INT            NOT NULL UNIQUE REFERENCES loans(loan_id)   ON DELETE CASCADE,
    member_id   INT            NOT NULL REFERENCES members(member_id)      ON DELETE CASCADE,
    amount      NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    issued_date DATE           NOT NULL DEFAULT CURRENT_DATE,
    paid        BOOLEAN        NOT NULL DEFAULT FALSE
);

CREATE TABLE audit_log (
    log_id       SERIAL      PRIMARY KEY,
    action       VARCHAR(50) NOT NULL,
    table_name   VARCHAR(50) NOT NULL,
    record_id    INT,
    performed_by INT,
    action_time  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes        TEXT
);


-- INDEXES

CREATE INDEX idx_members_email       ON members(email);
CREATE INDEX idx_books_isbn          ON books(isbn);
CREATE INDEX idx_books_author        ON books(author);
CREATE INDEX idx_loans_member_id     ON loans(member_id);
CREATE INDEX idx_loans_member_return ON loans(member_id, return_date);
CREATE INDEX idx_fines_member_paid   ON fines(member_id, paid);
CREATE INDEX idx_copies_book_status  ON book_copies(book_id, status);


-- TRIGGERS

CREATE OR REPLACE FUNCTION fn_auto_fine()
RETURNS TRIGGER AS $$
DECLARE
    overdue_days INT;
    fine_amount  NUMERIC(10,2);
BEGIN
    IF OLD.return_date IS NULL AND NEW.return_date IS NOT NULL THEN
        overdue_days := NEW.return_date - NEW.due_date;
        IF overdue_days > 0 THEN
            fine_amount := overdue_days * 10.00;
            INSERT INTO fines (loan_id, member_id, amount, issued_date, paid)
            VALUES (NEW.loan_id, NEW.member_id, fine_amount, CURRENT_DATE, FALSE);
            INSERT INTO audit_log (action, table_name, record_id, notes)
            VALUES ('FINE_ISSUED', 'fines', NEW.loan_id,
                    'Overdue by ' || overdue_days || ' days. Fine: PKR ' || fine_amount);
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auto_fine
    AFTER UPDATE ON loans
    FOR EACH ROW
    EXECUTE FUNCTION fn_auto_fine();


CREATE OR REPLACE FUNCTION fn_update_copy_status()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE book_copies SET status = 'borrowed' WHERE copy_id = NEW.copy_id;
        INSERT INTO audit_log (action, table_name, record_id, notes)
        VALUES ('LOAN_CREATED', 'loans', NEW.loan_id,
                'Copy ' || NEW.copy_id || ' marked as borrowed');
    ELSIF TG_OP = 'UPDATE' AND OLD.return_date IS NULL AND NEW.return_date IS NOT NULL THEN
        UPDATE book_copies SET status = 'available' WHERE copy_id = NEW.copy_id;
        INSERT INTO audit_log (action, table_name, record_id, notes)
        VALUES ('LOAN_RETURNED', 'loans', NEW.loan_id,
                'Copy ' || NEW.copy_id || ' marked as available');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_copy_status
    AFTER INSERT OR UPDATE ON loans
    FOR EACH ROW
    EXECUTE FUNCTION fn_update_copy_status();


-- VIEWS

CREATE VIEW overdue_loans_report AS
SELECT
    l.loan_id,
    m.full_name                    AS member_name,
    m.email                        AS member_email,
    b.title                        AS book_title,
    b.isbn,
    l.borrow_date,
    l.due_date,
    CURRENT_DATE - l.due_date      AS days_overdue
FROM loans l
JOIN members     m  ON l.member_id = m.member_id
JOIN book_copies bc ON l.copy_id   = bc.copy_id
JOIN books       b  ON bc.book_id  = b.book_id
WHERE l.return_date IS NULL
  AND l.due_date < CURRENT_DATE;


CREATE VIEW monthly_fine_revenue AS
SELECT
    TO_CHAR(f.issued_date, 'YYYY-MM')                          AS month,
    COUNT(f.fine_id)                                           AS total_fines_issued,
    SUM(f.amount)                                              AS total_amount,
    SUM(CASE WHEN f.paid     THEN f.amount ELSE 0 END)         AS amount_collected,
    SUM(CASE WHEN NOT f.paid THEN f.amount ELSE 0 END)         AS amount_outstanding
FROM fines f
GROUP BY TO_CHAR(f.issued_date, 'YYYY-MM')
ORDER BY month DESC;


CREATE VIEW popular_books AS
SELECT
    b.book_id,
    b.title,
    b.author,
    COUNT(l.loan_id) AS times_borrowed
FROM books b
JOIN book_copies bc ON b.book_id  = bc.book_id
JOIN loans       l  ON bc.copy_id = l.copy_id
GROUP BY b.book_id, b.title, b.author
ORDER BY times_borrowed DESC;


