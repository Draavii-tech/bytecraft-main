import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seeders/seed.js';
import User from './models/User.js';
import Post from './models/Post.js';

import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import seoRoutes from './routes/seoRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Permissive CORS middleware for cross-origin frontend-backend deployment
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploads if directory exists (development fallback)
const uploadsDir = path.join(__dirname, 'uploads');
if (fs.existsSync(uploadsDir)) {
  app.use('/uploads', express.static(uploadsDir));
}

// Database auto-connection and auto-seed middleware for serverless invocations
let isSeededOrChecked = false;
app.use(async (req, res, next) => {
  // Allow root and health check to respond even if DB is still establishing connection
  if (req.path === '/' || req.path === '/api/health') {
    return next();
  }

  try {
    await connectDB();

    // Auto-seed empty database on first active request
    if (!isSeededOrChecked && mongoose.connection.readyState === 1) {
      isSeededOrChecked = true;
      try {
        const userCount = await User.countDocuments();
        const postCount = await Post.countDocuments();
        if (userCount === 0 || postCount === 0) {
          console.log('Database empty. Running initial database seed...');
          await seedDatabase();
        }
      } catch (seedErr) {
        console.warn('Initial seeding check error (ignored):', seedErr.message);
      }
    }
    next();
  } catch (error) {
    console.error('Database connection middleware error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Database connection failed: ' + error.message,
    });
  }
});

// Root API overview endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'ByteCraft Blog API',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      posts: '/api/posts',
      categories: '/api/categories',
      sitemap: '/sitemap.xml',
      robots: '/robots.txt',
    },
  });
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    if (mongoose.connection.readyState === 1) {
      dbStatus = 'connected';
    } else {
      await connectDB();
      dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'connecting';
    }
  } catch (err) {
    dbStatus = 'error: ' + err.message;
  }

  res.json({
    status: dbStatus === 'connected' ? 'ok' : 'degraded',
    database: dbStatus,
    message: 'ByteCraft MERN Blog API is operational',
    timestamp: new Date().toISOString(),
  });
});

// SEO routes (Sitemap & Robots)
app.use('/', seoRoutes);

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Only start the HTTP listener if running directly (e.g. local node), not inside Vercel serverless
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  const startServer = async () => {
    try {
      await connectDB();

      const userCount = await User.countDocuments();
      const postCount = await Post.countDocuments();

      if (userCount === 0 || postCount === 0) {
        console.log('Database is empty or missing seed data. Running automatic seeding...');
        await seedDatabase();
      } else {
        console.log(`Database ready. Found ${userCount} users and ${postCount} posts.`);
      }

      app.listen(PORT, () => {
        console.log(`===============================================`);
        console.log(`ByteCraft Server running on http://localhost:${PORT}`);
        console.log(`API Health: http://localhost:${PORT}/api/health`);
        console.log(`Sitemap:    http://localhost:${PORT}/sitemap.xml`);
        console.log(`Robots:     http://localhost:${PORT}/robots.txt`);
        console.log(`===============================================`);
      });
    } catch (error) {
      console.error('Local server startup failure:', error);
    }
  };

  startServer();
}

export default app;
