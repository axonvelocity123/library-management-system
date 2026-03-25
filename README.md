**Library Management System**

Group 46

Team: Zamal Babar

**1. Project Overview:**

This is a Library Management System built for library staff to manage
day-to-day operations. It handles book inventory, member registration,
borrowing and return of books, fine collection, and reservations. The
system is built for a physical library where members come in person and
staff process everything on their behalf. It enforces role based access
so admins and librarians see different controls, and all critical
operations like borrowing and returning are wrapped in ACID compliant
database transactions.

**2. Tech Stack:**

|                   |                                                   |
|-------------------|---------------------------------------------------|
| **Layer**         | **Technology**                                    |
| Frontend          | React, React Router DOM, Axios, Recharts          |
| Backend           | Node.js, Express                                  |
| Database          | PostgreSQL 18                                     |
| Authentication    | JWT (jsonwebtoken), bcryptjs for password hashing |
| API Specification | OpenAPI 3.0 - swagger.yaml                        |
| Tools             | pgAdmin 4, Postman                                |

**3. System Architecture:**

The frontend is a React application running on port 3001. It
communicates with the Express backend on port 3000 through REST API
calls versioned under /api/v1/. The backend connects to a PostgreSQL
database using a connection pool (pg.Pool). When a user logs in, the
backend verifies their password using bcrypt and returns a signed JWT
token. That token is stored in the browser and attached to every
subsequent API request via the Authorization header. The backend
middleware checks the token and the user role before allowing access to
any protected route. Critical operations (borrow, return) use
BEGIN/COMMIT/ROLLBACK transactions directly with a dedicated database
client.

**4. UI Screenshots:**

**Login Page:  **
  
The entry point for all staff. Shows the email and password form with
client-side validation. On successful login the JWT token is stored in
the browser and the user is redirected to their role-specific dashboard,
admin goes to the Admin Dashboard, librarians (ahmed and sara) go to the
Librarian Dashboard. A potential member can pre-register here to be
saved from the hassle of registering irl. Unauthorized access to any
protected route redirects back here.

<img src="media/image1.png" style="width:6.5in;height:5.01458in" />

**Loans Page:**  
  
The most critical page in the system. Contains the borrow and return
forms side by side. The borrow form runs a full ACID transaction it
validates member status, checks for unpaid fines, and locks an available
copy before creating the loan. The result shows inline as either a
success message with loan ID and due date, or a rollback message with
the exact failure reason. The return form triggers automatic fine
calculation via database trigger. Below the forms is the full loans
table with filter by Active, Returned, and Overdue.  
  
<img src="media/image2.png" style="width:6.5in;height:3.55417in" />

**Books Page:**  
  
Shows all books with available copy count. Staff can search by title,
author, or ISBN in real time. Librarians and admins can add or edit
books via a modal form. Admins can also delete books. The available
copies badge turns red when a book has no copies left, giving an
immediate visual indicator for reservation.
<img src="media/image3.png" style="width:6.5in;height:5.51389in" />

**5. Setup and Installation:**

**Prerequisites:**

Node.js v18 or higher, PostgreSQL 18, npm

**Step 1 - Database setup:**

Open pgAdmin and create a new database called library_db. Open the Query
Tool, load database/schema.sql and run it. Then load database/seed.sql
and run it. This creates all 11 tables, indexes, triggers, views, and
inserts the seed data.

**Step 2 - Backend setup:**

Navigate to the backend folder and install dependencies:

cd backend

npm install

Create a .env file by copying .env.example and filling in your values:

|              |                                   |                   |
|--------------|-----------------------------------|-------------------|
| **Variable** | **Description**                   | **Example Value** |
| DB_HOST      | PostgreSQL host                   | localhost         |
| DB_PORT      | PostgreSQL port                   | 5432              |
| DB_NAME      | Database name                     | library_db        |
| DB_USER      | PostgreSQL username               | postgres          |
| DB_PASSWORD  | PostgreSQL password               | Your password     |
| JWT_SECRET   | Secret key for signing JWT tokens | Your key here     |
| PORT         | Port the backend runs on          | 3000              |

Start the backend:

node index.js

The server will start on http://localhost:3000

**Step 3 - Frontend setup:  
  
In another cmd window  
  **
you can create a .env here by simply removing the .example part.

Navigate to the frontend folder and install dependencies:

cd frontend

npm install

npm start

The frontend will start on http://localhost:3001 and automatically
connect to the backend on port 3000.

**6. User Roles:**

|  |  |  |  |
|-------------|-------------------------|--------------------|---------------|
| **Role** | **What they can do** | **What they cannot do** | **Login credentials (from seed.sql)** |
| admin | Full access - manage books, members, loans, fines, view analytics, suspend/activate members, delete books | Nothing restricted | admin@library.com / password123 |
| librarian | Process loans and returns, register members, edit books, mark fines paid, view all records | Cannot delete books, cannot suspend members, cannot view analytics | sara@library.com / password123 ahmed@library.com / password123 |
| member | Pre-register online via /register. Staff manage their account and process borrowing on their behalf | Cannot log in to the system directly. No self-service portal | No login - managed by staff |

**7. Feature Walkthrough:**

|  |  |  |  |
|----------------|------------------------|--------------|------------------|
| **Feature** | **What it does** | **Role access** | **Page / Endpoint** |
| Login | Staff log in with email and password. JWT token is issued and stored in browser. Redirects to role-specific dashboard. | admin, librarian | /login - POST /api/v1/auth/login |
| Pre-registration | Members fill out a form online to pre-register. A librarian activates their account on arrival. | Public (no login) | /register - POST /api/v1/members |
| Logout | Clears the JWT token from browser storage and redirects to login. | admin, librarian | Navbar button |
| Books - View | Lists all books with available copy count. Searchable by title, author, or ISBN. | admin, librarian | /books - GET /api/v1/books |
| Books - Add | Add a new book with title, author, ISBN, year, and copy count. | admin, librarian | /books - POST /api/v1/books |
| Books - Edit | Edit an existing book's details. Uses PUT to update without creating a duplicate. | admin, librarian | /books - PUT /api/v1/books/:id |
| Books - Delete | Permanently delete a book and all its copies. | admin only | /books - DELETE /api/v1/books/:id |
| Members - View | Lists all members. Searchable by name or email. Filterable by status (active/suspended/expired). | admin, librarian | /members - GET /api/v1/members |
| Members - Register | Register a new member with name, email, phone, address. | admin, librarian | /members - POST /api/v1/members |
| Members - Edit | Edit a member's name, phone, and address. | admin, librarian | frontend form |
| Members - Suspend/Activate | Change a member's status to suspended or active. | admin only | /members/:id/status - PATCH |
| Loans - Borrow | Full ACID transaction. Validates member status, unpaid fines, and copy availability before creating a loan. Shows inline success or rollback reason. | admin, librarian | /loans - POST /api/v1/loans/borrow |
| Loans - Return | Updates loan with return date. Triggers auto-calculate fine if overdue. Shows fine amount in response. | admin, librarian | /loans - POST /api/v1/loans/return |
| Loans - View | Lists all loans with filter by Active, Returned, Overdue. | admin, librarian | /loans - GET /api/v1/loans |
| Fines - View | Lists all fines with total outstanding and collected amounts. | admin, librarian | /fines - GET /api/v1/fines |
| Fines - Mark Paid | Marks a specific fine as paid. | admin, librarian | /fines/:id/pay - PATCH |
| Analytics | Bar chart of monthly fine revenue and pie chart of top books by availability. | admin only | /analytics - GET /api/v1/fines/revenue |

**8. Transaction Scenarios:**

**Transaction 1 - Borrow a Book:**

Triggered when a librarian or admin submits the borrow form on the Loans
page (POST /api/v1/loans/borrow, code in backend/routes/loans.js). The
operations bundled atomically are: verifying the member exists and is
active, checking the member has no unpaid fines, locking an available
copy using SELECT FOR UPDATE to prevent double booking, and inserting
the loan record with a due date 14 days from today. The triggers
trg_update_copy_status and audit_log insert also fire within this
transaction. A rollback occurs if the member does not exist, is
suspended or expired, has any unpaid fines, or if no available copies
exist for the requested book.

**Transaction 2 - Return a Book:**

Triggered when a librarian or admin submits the return form on the Loans
page (POST /api/v1/loans/return, code in backend/routes/loans.js). The
operations bundled atomically are: verifying the loan exists and has not
already been returned, updating the loan's return_date to today, and the
two triggers that fire automatically from that single UPDATE -
trg_auto_fine calculates overdue days and inserts a fine at PKR 10 per
day if the return is late, and trg_update_copy_status sets the copy back
to available. A rollback occurs if the loan_id does not exist or if the
loan has already been returned.

**9. ACID Compliance:**

|  |  |
|----------------|--------------------------------------------------------|
| **Property** | **How it is satisfied in this system** |
| Atomicity | Both transactions use explicit BEGIN/COMMIT/ROLLBACK. Every step inside the borrow transaction either all succeeds or all rolls back. If the member check passes but no copy is available, the entire transaction is rolled back and nothing is written to the database. The catch block ensures ROLLBACK is always called on any unhandled error. |
| Consistency | CHECK constraints on the members table enforce that status can only be active, suspended, or expired. CHECK on fines ensures amount is greater than zero. FK constraints ensure loans cannot reference a non-existent member, copy, or staff member. The borrow transaction adds application-level consistency checks on top: member must be active, must have no unpaid fines. |
| Isolation | The borrow transaction uses SELECT FOR UPDATE on the book_copies row. This acquires a row-level lock, preventing a second concurrent transaction from reading that same row until the first commits or rolls back. Without this, two librarians processing a borrow for the last copy simultaneously could both succeed, resulting in double booking. PostgreSQL default isolation level is READ COMMITTED, with the FOR UPDATE clause upgrading locking for the critical copy selection step. |
| Durability | PostgreSQL writes committed transactions to its write-ahead log (WAL) before acknowledging the commit. Once COMMIT returns, the loan record, copy status update, and any fine are guaranteed to survive a server restart or crash. |

**10. Indexing and Performance:**

The following indexes were created in schema.sql. The before/after
EXPLAIN ANALYZE results for three queries are in
database/performance.sql.

|  |  |  |  |  |
|-------------------|-----------|--------------|----------------|--------------|
| **Index Name** | **Table** | **Column(s)** | **Why it was added** | **Performance result (from performance.sql)** |
| idx_members_email | members | email | Every login request queries the staff table by email. | Before: Seq Scan, scans all rows. After: Index Scan, goes directly to matching row. ~60% faster. |
| idx_books_isbn | books | isbn | ISBN is the standard lookup field for books. | Part of general index improvement - reduces scan cost significantly on large tables. |
| idx_books_author | books | author | Author name searches are one of the most common queries in a library system. | Part of general index improvement. |
| idx_loans_member_id | loans | member_id | Fetching all loans for a specific member requires scanning the loans table. | Part of general index improvement. |
| idx_loans_member_return | loans | member_id, return_date | Composite index used to find active loans for a member. | Before: Seq Scan on loans. After: Index Scan using composite key. ~70% faster. |
| idx_fines_member_paid | fines | member_id, paid | The borrow transaction checks for unpaid fines by member. | Part of general index improvement. |
| idx_copies_book_status | book_copies | book_id, status | Finding available copies for a specific book is the most frequent query in the borrow flow. | Before: Seq Scan scanning all 74 copies. After: Index Scan directly retrieves matching copies. ~75% faster. |

**11. API Reference:**

Full specification including request/response schemas and example
payloads is in docs/swagger.yaml.

|  |  |  |  |
|----------|------------------------|----------------|-----------------------|
| **Method** | **Route** | **Auth Required** | **Purpose** |
| POST | /api/v1/auth/login | None | Login with email and password. Returns JWT token, role, and name. |
| GET | /api/v1/books | Any logged-in user | Get all books with available copy count. |
| POST | /api/v1/books | admin, librarian | Add a new book. |
| PUT | /api/v1/books/:id | admin, librarian | Update an existing book's details. |
| DELETE | /api/v1/books/:id | admin only | Delete a book and all its copies. |
| GET | /api/v1/members | admin, librarian | Get all members. |
| POST | /api/v1/members | None | Register a new member (also used for pre-registration). |
| PATCH | /api/v1/members/:id/status | admin only | Update member status to active, suspended, or expired. |
| GET | /api/v1/members/:id/fines | admin, librarian | Get unpaid fines for a specific member. |
| POST | /api/v1/loans/borrow | admin, librarian | Borrow a book. Full ACID transaction with 5-step validation. |
| POST | /api/v1/loans/return | admin, librarian | Return a book. Triggers auto-fine and copy status update. |
| GET | /api/v1/loans | admin, librarian | Get all loans. |
| GET | /api/v1/loans/overdue | admin, librarian | Get all currently overdue loans from the overdue_loans_report view. |
| GET | /api/v1/fines | admin, librarian | Get all fines. |
| PATCH | /api/v1/fines/:id/pay | admin, librarian | Mark a fine as paid. |
| GET | /api/v1/fines/revenue | admin only | Monthly fine revenue from the monthly_fine_revenue database view. |

**12. Known Issues and Limitations:**

None that I know of.  
  
  
**13.Deviations from the structure:  
  **
No controllers folder in backend because the backend follows a routes
only pattern. Controller and model logic is handled directly in the
route files for simplicity.
