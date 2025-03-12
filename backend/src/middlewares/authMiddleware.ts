import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware: any = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header (Bearer <token>)

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
    if (!decoded.id) { // Ensure that `id` exists before using it
        res.status(403).json({ error: 'Invalid token structure.' });
        return;
      }

    req.body.userId = decoded.id; // Add userId to request body
    next(); // Continue to the next middleware
  }catch (error) {
    res.status(403).json({ error: 'Invalid or expired token.' });
    return;
  }
};

export default authMiddleware;

