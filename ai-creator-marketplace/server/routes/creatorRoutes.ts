import { Router } from 'express';
import {
  getCreators,
  getCreatorByHandleOrId,
  updateMyProfile,
  getFilterMetadata,
} from '../controllers/creatorController';
import { requireCreator } from '../middleware/auth';
import { validate, creatorProfileUpdateSchema } from '../middleware/validation';

const router = Router();

router.get('/', getCreators);
router.get('/meta/filters', getFilterMetadata);
router.get('/:handleOrId', getCreatorByHandleOrId);
router.put('/me', requireCreator, validate(creatorProfileUpdateSchema), updateMyProfile);

export default router;
