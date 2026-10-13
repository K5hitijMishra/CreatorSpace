import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  likeProject,
} from '../controllers/projectController';
import { requireCreator } from '../middleware/auth';
import { validate, projectSchema, updateProjectSchema } from '../middleware/validation';

const router = Router();

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', requireCreator, validate(projectSchema), createProject);
router.put('/:id', requireCreator, validate(updateProjectSchema), updateProject);
router.delete('/:id', requireCreator, deleteProject);
router.post('/:id/like', likeProject);

export default router;
