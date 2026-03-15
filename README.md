 **Library Management System - Backend API:**




 **Requirements:**



\- Node.js

\- PostgreSQL with library\_db database

\- schema.sql and seed.sql must be run before starting



### &nbsp;**Setup:**



##### **1. Install dependencies:**



npm install





##### **2. Create .env file and fill in your details**



DB\_HOST=localhost

DB\_PORT=5432

DB\_NAME=library\_db

DB\_USER=postgres

DB\_PASSWORD=your\_password

JWT\_SECRET=mysecretkey123

PORT=3000





##### **3. Start the server**



node index.js





Server runs at http://localhost:3000



###  **Login:**

POST /api/v1/auth/login with email and password to get a token.

Default credentials: admin@library.com / password123



All other endpoints require the token in the Authorization header:

Authorization: Bearer <token>



####  **Endpoints:**



POST   /api/v1/auth/login

GET    /api/v1/books

GET    /api/v1/books/:id

POST   /api/v1/books

DELETE /api/v1/books/:id

GET    /api/v1/members

GET    /api/v1/members/:id

POST   /api/v1/members

PATCH  /api/v1/members/:id/status

GET    /api/v1/members/:id/fines

POST   /api/v1/loans/borrow

POST   /api/v1/loans/return

GET    /api/v1/loans

GET    /api/v1/loans/overdue

GET    /api/v1/fines

PATCH  /api/v1/fines/:id/pay

GET    /api/v1/fines/revenue



