import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { connectDatabase } from './server/config/db';
import { verifyAuth } from './server/middleware/auth';
import { errorHandler } from './server/middleware/errorHandler';
import authRoutes from './server/routes/authRoutes';
import creatorRoutes from './server/routes/creatorRoutes';
import projectRoutes from './server/routes/projectRoutes';
import uploadRoutes from './server/routes/uploadRoutes';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  // Connect to Database (Atlas or Graceful In-Memory fallback)
  await connectDatabase();

  // Basic Middlewares
  app.use(cors());
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Global Auth Token verification (attaches req.user & req.creator when bearer token present)
  app.use('/api', verifyAuth);

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/creators', creatorRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/upload', uploadRoutes);

  // Health and System Info endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      app: 'Kroma AI Creator Marketplace',
      timestamp: new Date().toISOString(),
      database: process.env.MONGODB_URI ? 'MongoDB Atlas' : 'In-Memory Fast Store',
      mediaProvider: process.env.CLOUDINARY_CLOUD_NAME ? 'Cloudinary' : 'Local/DataURI',
    });
  });

  // Centralized Error Handling
  app.use(errorHandler);

  // Serve static assets or mount Vite dev server
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Kroma Marketplace Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Boot Error:', err);
  process.exit(1);
});
