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
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://asuragpt-2.onrender.com",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed for origin: " + origin), false);
    }
  },
  credentials: true,
}));

app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, '../public/index.html'));
  }
  next();
});

module.exports = app;
