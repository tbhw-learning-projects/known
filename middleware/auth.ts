import jwt from 'next-auth/jwt';
import { Request, Response } from '../types';

export default async (req: Request, res: Response, next: () => void): Promise<void> => {
  const token = await jwt.getToken({ req, secret: process.env.JWT_SECRET });

  if (token) {
    // Signed in
    req.user = token;
    next();
  } else {
    // Not Signed in
    res.status(401);
    res.end();
  }
};
