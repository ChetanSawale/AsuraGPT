const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path')

const authRoutes = require('./routes/auth.route');
const chatRoutes = require('./routes/chat.route');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Enable CORS so frontend can call API
app.use(cors({
  origin: [
    "http://localhost:5173",            // Local dev
    "https://asuragpt-1.onrender.com"   // Render frontend
  ],
  credentials: true,
}));
app.use(express.static(path.join(__dirname, '../public')))

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

app.get("*name", (req,res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;
