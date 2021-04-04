import { connectToDB } from '../db/connect';
import { Response, Request } from '../types';

export default async function database(req: Request, res: Response, next: () => void): Promise<void> {
  const { db, dbClient } = await connectToDB();
  req.db = db;
  req.dbClient = dbClient;

  next();
}
