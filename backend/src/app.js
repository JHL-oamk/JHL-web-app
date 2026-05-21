const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { verifyToken } = require('./middleware/authMiddleware');
const userRoutes = require('./routes/userRoutes');
const claudeRoutes = require('./routes/claudeRoutes');
const chatRoutes = require('./routes/chatRoutes');
const folderRoutes = require('./routes/folderRoutes');

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options(/(.*)/,  cors(corsOptions));

app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

// Protected routes
app.use('/api/users', verifyToken, userRoutes);
app.use('/api/claude', claudeRoutes);
app.use('/api/chats', verifyToken, chatRoutes);
app.use('/api/folders', verifyToken, folderRoutes);

module.exports = app;