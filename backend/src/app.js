const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { verifyToken } = require('./middleware/authMiddleware');
const userRoutes = require('./routes/userRoutes');
const claudeRoutes = require('./routes/claudeRoutes');
const chatRoutes = require('./routes/chatRoutes');
const folderRoutes = require('./routes/folderRoutes');
const lawSourceRoutes = require('./routes/lawSourceRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options(/(.*)/,  cors(corsOptions));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

// Protected routes
app.use('/api/users', verifyToken, userRoutes);
app.use('/api/claude', claudeRoutes);
app.use('/api/chats', verifyToken, chatRoutes);
app.use('/api/folders', verifyToken, folderRoutes);
app.use('/api/law-sources', verifyToken, lawSourceRoutes);
app.use('/api/admin', verifyToken, adminRoutes);

module.exports = app;