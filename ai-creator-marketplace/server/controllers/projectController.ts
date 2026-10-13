import { Request, Response, NextFunction } from 'express';
import { Repository } from '../store/repository';
import { AuthRequest } from '../middleware/auth';

export const getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { search, contentType, tool, aspectRatio, creatorId, sort, page, limit } = req.query;

    const parsedPage = page ? parseInt(page as string, 10) : 1;
    const parsedLimit = limit ? parseInt(limit as string, 10) : 24;

    const result = await Repository.getProjects({
      search: search as string,
      contentType: contentType as string,
      tool: tool as string,
      aspectRatio: aspectRatio as string,
      creatorId: creatorId as string,
      sort: sort as any,
      page: parsedPage,
      limit: parsedLimit,
    });

    res.json({
      success: true,
      data: result.projects,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total: result.total,
        totalPages: Math.ceil(result.total / parsedLimit),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const project = await Repository.findProjectById(id);

    if (!project) {
      res.status(404).json({
        success: false,
        message: 'Portfolio project not found',
      });
      return;
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (err) {
    next(err);
  }
};

export const createProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.creator) {
      res.status(403).json({
        success: false,
        message: 'You need an active creator profile to publish projects.',
      });
      return;
    }

    const projectData = {
      ...req.body,
      creatorId: req.creator._id,
      featured: false,
    };

    const newProject = await Repository.createProject(projectData);

    res.status(201).json({
      success: true,
      message: 'Portfolio project created successfully',
      data: newProject,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.creator) {
      res.status(403).json({
        success: false,
        message: 'Authentication required.',
      });
      return;
    }

    const { id } = req.params;
    const updated = await Repository.updateProject(id, req.creator._id, req.body);

    if (!updated) {
      res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Portfolio project updated successfully',
      data: updated,
    });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED_ACTION') {
      res.status(403).json({
        success: false,
        message: 'You can only edit your own portfolio projects.',
      });
      return;
    }
    next(err);
  }
};

export const deleteProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.creator) {
      res.status(403).json({
        success: false,
        message: 'Authentication required.',
      });
      return;
    }

    const { id } = req.params;
    const deleted = await Repository.deleteProject(id, req.creator._id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Portfolio project deleted successfully.',
    });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED_ACTION') {
      res.status(403).json({
        success: false,
        message: 'You can only delete your own portfolio projects.',
      });
      return;
    }
    next(err);
  }
};

export const likeProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await Repository.toggleLikeProject(id);

    res.json({
      success: true,
      likes: result.likes,
    });
  } catch (err: any) {
    if (err.message === 'NOT_FOUND') {
      res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
      return;
    }
    next(err);
  }
};
