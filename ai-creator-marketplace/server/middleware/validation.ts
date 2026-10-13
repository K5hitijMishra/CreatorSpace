import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['creator', 'client']).default('creator'),
  handle: z
    .string()
    .min(3, 'Handle must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Handle can only contain letters, numbers, and underscores')
    .optional(),
  specialization: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const workflowStepSchema = z.object({
  stepNumber: z.number().int().positive(),
  title: z.string().min(2, 'Step title is required'),
  tool: z.string().min(1, 'Tool name is required'),
  description: z.string().min(5, 'Step description is required'),
});

export const projectSchema = z.object({
  title: z.string().min(3, 'Project title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  mediaUrl: z.string().min(1, 'Media URL or upload is required'),
  mediaType: z.enum(['image', 'video']).default('image'),
  thumbnailUrl: z.string().optional(),
  aspectRatio: z.enum(['16:9', '4:3', '1:1', '9:16', '3:4']).default('16:9'),
  contentType: z.enum([
    'Concept Art',
    'Cinematic Film',
    'Editorial Fashion',
    'Architecture',
    'Character Design',
    'Motion Graphic',
  ]),
  toolsUsed: z.array(z.string()).min(1, 'Select or enter at least one AI tool'),
  workflowSteps: z.array(workflowStepSchema).min(1, 'Provide at least one workflow step'),
  commercialUseDisclosure: z.enum([
    'Commercial Use Permitted',
    'Editorial / Non-Commercial Only',
    'Custom License Upon Request',
  ]),
  promptDetails: z
    .object({
      promptSnippet: z.string().optional(),
      negativePrompt: z.string().optional(),
      seed: z.string().optional(),
      cfgScale: z.number().optional(),
      sampler: z.string().optional(),
    })
    .optional(),
  tags: z.array(z.string()).default([]),
});

export const updateProjectSchema = projectSchema.partial();

export const creatorProfileUpdateSchema = z.object({
  displayName: z.string().min(2).optional(),
  tagline: z.string().min(5).optional(),
  bio: z.string().min(10).optional(),
  location: z.string().optional(),
  specialization: z.string().optional(),
  skills: z.array(z.string()).optional(),
  aiTools: z.array(z.string()).optional(),
  avatarUrl: z.string().url().optional(),
  coverUrl: z.string().optional(),
  socialLinks: z
    .object({
      website: z.string().optional(),
      twitter: z.string().optional(),
      instagram: z.string().optional(),
      artstation: z.string().optional(),
      github: z.string().optional(),
    })
    .optional(),
  rates: z
    .object({
      hourly: z.string().optional(),
      projectStartingAt: z.string().optional(),
    })
    .optional(),
  availableForWork: z.boolean().optional(),
});

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.issues.map((i) => ({
          field: i.path.join('.'),
          message: i.message,
        }));
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
        });
        return;
      }
      next(err);
    }
  };
};
