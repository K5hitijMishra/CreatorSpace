import { v2 as cloudinary } from 'cloudinary';

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log('✅ [Media] Cloudinary configured with active credentials.');
} else {
  console.log('ℹ️ [Media] Cloudinary credentials not detected. Operating with instant media URL & local upload fallback.');
}

export const uploadMediaToCloudinary = async (
  fileBuffer: Buffer,
  filename: string,
  folder = 'creatorspace_portfolios'
): Promise<{ url: string; publicId?: string; format?: string }> => {
  if (!isCloudinaryConfigured) {
    // Fallback: Convert to Data URI so media works without external API keys
    const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
    const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : ext === 'mp4' ? 'video/mp4' : 'image/jpeg';
    const base64 = fileBuffer.toString('base64');
    const dataUri = `data:${mime};base64,${base64}`;
    return { url: dataUri };
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error || !result) {
          console.error('Cloudinary upload stream error:', error);
          return reject(error || new Error('Upload failed'));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
};

export { cloudinary, isCloudinaryConfigured };
