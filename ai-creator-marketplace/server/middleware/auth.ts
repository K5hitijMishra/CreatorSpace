import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Repository } from '../store/repository';
import { IUser, ICreatorProfile } from '../models/types';

const JWT_SECRET = process.env.JWT_SECRET || 'kroma_super_secure_jwt_secret_key_2026_hackathon';

export interface AuthRequest extends Request {
  user?: IUser;
  creator?: ICreatorProfile;
}

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
  } as jwt.SignOptions);
};

export const verifyAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    const user = await Repository.findUserById(decoded.id);

    if (user) {
      req.user = user;
      const creator = await Repository.findCreatorByUserId(user._id);
      if (creator) {
        req.creator = creator;
      }
    }

    next();
  } catch (err) {
    // Expired or invalid token, continue without auth
    next();
  }
};

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in to proceed.',
    });
    return;
  }
  next();
};

export const requireCreator = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in.',
    });
    return;
  }

  if (!req.creator) {
    res.status(403).json({
      success: false,
      message: 'Access restricted to creator accounts with an established profile.',
    });
    return;
  }

  next();
};
