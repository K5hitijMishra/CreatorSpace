import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Unhandled Server Error:', err);

  if (err.message === 'UNAUTHORIZED_ACTION') {
    res.status(403).json({
      success: false,
      message: 'You are not authorized to modify or delete this resource.',
    });
    return;
  }

  if (err.message === 'NOT_FOUND') {
    res.status(404).json({
      success: false,
      message: 'The requested resource was not found.',
    });
    return;
  }

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error occurred',
  });
};
