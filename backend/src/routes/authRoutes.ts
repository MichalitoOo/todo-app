import { Router } from 'express';
import { register, login, home } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// Protected route
router.get('/home', authMiddleware, home);

export default router;
