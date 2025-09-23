// server.js
const express = require('express');
const cors = require('cors');

const accountsRouter = require('./routes/accounts');
const signinRouter = require('./routes/sign-in');

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/accounts', accountsRouter);
app.use('/api/sign-in', signinRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
