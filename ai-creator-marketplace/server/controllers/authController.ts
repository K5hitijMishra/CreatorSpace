import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { Repository } from '../store/repository';
import { generateToken, AuthRequest } from '../middleware/auth';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role, handle, specialization } = req.body;

    const existingUser = await Repository.findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
      return;
    }

    const cleanHandle = (handle || name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase())
      .replace(/^@/, '')
      .toLowerCase();

    const existingCreator = await Repository.findCreatorByIdOrHandle(cleanHandle);
    if (existingCreator) {
      res.status(400).json({
        success: false,
        message: `The creator handle @${cleanHandle} is already taken. Please choose another.`,
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Repository.createUser({
      name,
      email,
      password: hashedPassword,
      role: role || 'creator',
    });

    let creatorProfile = null;
    if (user.role === 'creator') {
      creatorProfile = await Repository.createCreatorProfile({
        userId: user._id,
        handle: cleanHandle,
        displayName: name,
        avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80`,
        tagline: 'Generative AI Artist & Designer',
        bio: `AI creator specializing in ${specialization || 'Generative Art & Visual Design'}. Crafting cutting-edge visual experiences with neural models.`,
        location: 'Remote',
        specialization: specialization || 'Concept Art & Worldbuilding',
        skills: ['Prompt Engineering', 'Visual Direction', 'Model Tuning'],
        aiTools: ['Midjourney v6', 'Flux.1 Pro'],
        availableForWork: true,
        featured: false,
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      creator: creatorProfile,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await Repository.findUserByEmail(email);
    if (!user || !user.password) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password combination.',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password combination.',
      });
      return;
    }

    const creator = await Repository.findCreatorByUserId(user._id);
    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      creator,
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    res.json({
      success: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
      creator: req.creator || null,
    });
  } catch (err) {
    next(err);
  }
};
