require('dotenv').config();

const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');

const authRoutes = require('./routes/authRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware 

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// ── Routes (handle the routes and everything)

app.use('/api/auth', authRoutes);

// ── Connects to MongoDB then start server 

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });