import { Db } from 'mongodb';
import { nanoid } from 'nanoid';

export interface Doc {
  _id: string;
  name: string;
  folder: string;
  createdBy: string;
  createdAt: string;
  content: Record<string, unknown>;
}

export const getOneDoc = async (db: Db, id: string): Promise<Doc> => {
  return db.collection('docs').findOne({ _id: id });
};

export const getDocsByFolder = async (db: Db, folderId: string): Promise<Doc[]> => {
  return db.collection('docs').find({ folder: folderId }).toArray();
};

export const createDoc = async (
  db: Db,
  doc: { createdBy: string; folder: string; name: string; content?: any },
): Promise<Doc> => {
  return db
    .collection('docs')
    .insertOne({
      _id: nanoid(12),
      ...doc,
      createdAt: new Date().toDateString(),
    })
    .then(({ ops }) => ops[0]);
};

export const updateOne = async (db: Db, id: string, updates: Record<string, unknown>): Promise<Doc> => {
  const operation = await db.collection('docs').updateOne(
    {
      _id: id,
    },
    { $set: updates },
  );

  if (!operation.result.ok) {
    throw new Error('Could not update document');
  }

  const updated = await db.collection('docs').findOne({ _id: id });
  return updated;
};
