import { Router } from 'express';
import multer from 'multer';
import { handleUpload } from '../controllers/uploadController';
import { requireAuth } from '../middleware/auth';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit
  },
});

router.post('/', requireAuth, upload.single('media'), handleUpload);

export default router;
