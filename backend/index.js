const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth',    require('./routes/auth'));
app.use('/api/v1/books',   require('./routes/books'));
app.use('/api/v1/members', require('./routes/members'));
app.use('/api/v1/loans',   require('./routes/loans'));
app.use('/api/v1/fines',   require('./routes/fines'));

// Health check
app.get('/', (req, res) => res.json({ message: 'Library API is running.' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
