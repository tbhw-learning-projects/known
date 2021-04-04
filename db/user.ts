import { Db } from 'mongodb';

export const getUserById = async (db: Db, id: string): Promise<{ _id: string }> => {
  return db.collection('users').findOne({ _id: id });
};
