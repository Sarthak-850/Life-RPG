import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../config/database.js';
import { ENV } from '../config/env.js';
import { AuthenticatedRequest } from '../types/index.js';

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(24, 'Username cannot exceed 24 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export class AuthController {
  static async register(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { username, email, password } = req.body;

    // Check unique email and username
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email.toLowerCase() }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.email.toLowerCase() === email.toLowerCase()) {
        res.status(409).json({ success: false, message: 'An account with this email already exists.' });
        return;
      }
      res.status(409).json({ success: false, message: 'This username is already taken. Choose another.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Atomically create User, initial Character, and Welcome Activity Log
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username,
          email: email.toLowerCase(),
          passwordHash,
        },
      });

      const character = await tx.character.create({
        data: {
          userId: user.id,
          title: 'Novice Adventurer',
          level: 1,
          xp: 0,
          gold: 50, // Starting gold
          strength: 10,
          intellect: 10,
          agility: 10,
          wisdom: 10,
          discipline: 10,
          currentStreak: 0,
          longestStreak: 0,
        },
      });

      await tx.activityLog.create({
        data: {
          userId: user.id,
          type: 'LEVEL_UP',
          title: 'Journey Begun',
          description: `${username} stepped into the realm of Life RPG.`,
        },
      });

      return { user, character };
    });

    const token = jwt.sign(
      { id: result.user.id, username: result.user.username, email: result.user.email },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account successfully created. Welcome to Life RPG!',
      token,
      user: {
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
        createdAt: result.user.createdAt,
      },
      character: result.character,
    });
  }

  static async login(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { character: true },
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Authentication successful. Welcome back, hero!',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
      character: user.character,
    });
  }

  static async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        character: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
      character: user.character,
    });
  }

  static async logout(_req: AuthenticatedRequest, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Safely disconnected from the Life RPG realm.',
    });
  }
}

export default AuthController;
