import jwt, { JWT } from 'next-auth/jwt';
// eslint-disable-next-line import/no-unresolved
import { WithAdditionalParams } from 'next-auth/_utils';
import { Request, Response } from '../types';

export default async (req: Request, res: Response, next: () => void): Promise<void> => {
  const token = await jwt.getToken({ req, secret: process.env.JWT_SECRET });

  if (token && hasId(token)) {
    // Signed in
    req.user = token;
    next();
  } else {
    // Not Signed in
    res.status(401);
    res.end();
  }
};

function hasId(token: WithAdditionalParams<JWT>): token is { id: string; email: string } {
  return token.hasOwnProperty('id');
}
