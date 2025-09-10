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
  "https://asuragpt-1.onrender.com"
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed for this origin: " + origin), false);
    }
  },
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
