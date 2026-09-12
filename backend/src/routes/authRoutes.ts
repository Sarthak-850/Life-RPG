import { Router } from 'express';
import { AuthController, registerSchema, loginSchema } from '../controllers/authController.js';
import { validateBody } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', validateBody(registerSchema), AuthController.register);
router.post('/login', validateBody(loginSchema), AuthController.login);
router.get('/me', requireAuth, AuthController.getMe);
router.post('/logout', requireAuth, AuthController.logout);

export default router;
