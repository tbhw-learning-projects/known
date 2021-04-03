import { Db, MongoClient } from 'mongodb';
import { connectToDB } from '../db/connect';

declare global {
  namespace NodeJS {
    interface Global {
      mongo: { db?: Db; client?: MongoClient };
    }
  }
}

export default async function database(req, res, next) {
  const { db, dbClient } = await connectToDB();
  req.db = db;
  req.dbClinet = dbClient;

  next();
}
