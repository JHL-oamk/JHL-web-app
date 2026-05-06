const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { verifyToken } = require('./middleware/authMiddleware');
const userRoutes = require('./routes/userRoutes');
const queryRoutes = require('./routes/queryRoutes');
const resultRoutes = require('./routes/resultRoutes');
const claudeRoutes = require('./routes/claudeRoutes');


const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

// Suojatut reitit
app.use('/api/users', verifyToken, userRoutes);
app.use('/api/queries', verifyToken, queryRoutes);
app.use('/api/results', verifyToken, resultRoutes);
app.use('/api/claude', claudeRoutes);

module.exports = app;