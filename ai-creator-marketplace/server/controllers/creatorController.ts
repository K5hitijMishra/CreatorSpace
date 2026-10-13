import { Request, Response, NextFunction } from 'express';
import { Repository } from '../store/repository';
import { AuthRequest } from '../middleware/auth';

export const getCreators = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { search, specialization, skill, tool, availableOnly, page, limit } = req.query;

    const parsedPage = page ? parseInt(page as string, 10) : 1;
    const parsedLimit = limit ? parseInt(limit as string, 10) : 24;

    const result = await Repository.getCreators({
      search: search as string,
      specialization: specialization as string,
      skill: skill as string,
      tool: tool as string,
      availableOnly: availableOnly === 'true',
      page: parsedPage,
      limit: parsedLimit,
    });

    res.json({
      success: true,
      data: result.creators,
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

export const getCreatorByHandleOrId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { handleOrId } = req.params;
    const creator = await Repository.findCreatorByIdOrHandle(handleOrId);

    if (!creator) {
      res.status(404).json({
        success: false,
        message: 'Creator profile not found',
      });
      return;
    }

    // Also fetch their portfolio projects
    const { projects } = await Repository.getProjects({
      creatorId: creator._id,
      limit: 50,
    });

    res.json({
      success: true,
      data: {
        ...creator,
        projects,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateMyProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.creator) {
      res.status(404).json({
        success: false,
        message: 'Creator profile not found for this account',
      });
      return;
    }

    const updated = await Repository.updateCreatorProfile(req.creator._id, req.body);

    res.json({
      success: true,
      message: 'Creator profile successfully updated',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const getFilterMetadata = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const meta = await Repository.getFilterMetadata();
    res.json({
      success: true,
      data: meta,
    });
  } catch (err) {
    next(err);
  }
};
