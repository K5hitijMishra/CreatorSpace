import { Request, Response, NextFunction } from 'express';
import { uploadMediaToCloudinary, isCloudinaryConfigured } from '../config/cloudinary';

export const handleUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
      return;
    }

    const result = await uploadMediaToCloudinary(file.buffer, file.originalname);

    res.json({
      success: true,
      data: {
        url: result.url,
        isCloudinary: isCloudinaryConfigured,
      },
    });
  } catch (err: any) {
    console.error('Upload handler error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'File upload failed',
    });
  }
};
