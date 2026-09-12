import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ENV } from './config/env.js';
import errorHandler from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import questRoutes from './routes/questRoutes.js';
import characterRoutes from './routes/characterRoutes.js';
import shopRoutes from './routes/shopRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

export const createApp = () => {
  const app = express();

  // Security Headers
  app.use(helmet());

  // CORS Configuration
  app.use(
    cors({
      origin: [ENV.CORS_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body Parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Rate Limiting for Auth
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
    message: {
      success: false,
      message: 'Too many authentication attempts. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Routes
  app.use('/api', healthRoutes);
  app.use('/api/auth', authLimiter, authRoutes);
  app.use('/api/quests', questRoutes);
  app.use('/api/character', characterRoutes);
  app.use('/api/shop', shopRoutes);
  app.use('/api/inventory', inventoryRoutes);
  app.use('/api/achievements', achievementRoutes);
  app.use('/api/history', historyRoutes);

  // 404 Route Handler
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      message: 'Endpoint not found in the Life RPG realm.',
    });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};

export default createApp;
