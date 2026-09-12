import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { AuthenticatedRequest, AuthUser } from '../types/index.js';

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if ((req as any).cookies && (req as any).cookies.token) {
    token = (req as any).cookies.token;
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: Authentication token is required.',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as AuthUser;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or expired session token.',
    });
    return;
  }
};

export default requireAuth;
