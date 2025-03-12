import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// Protected route
router.get('/home', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Welcome to the protected home page!', user: req.body.userId });
  return;
});

export default router;
