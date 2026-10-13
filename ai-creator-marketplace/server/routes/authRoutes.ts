import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { validate, registerSchema, loginSchema } from '../middleware/validation';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', requireAuth, getMe);

export default router;
