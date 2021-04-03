import nc from 'next-connect';
import middlewares from '../../../middleware/all';
import { error } from '../../../middleware';
import { doc } from '../../../db';
import { Request } from '../../../types';
import { request } from 'http';

const handler = nc({
  onError: error,
});

handler.use(middlewares);

handler.post(async (req: Request, res) => {
  const newDoc = await doc.createDoc(req.db, { ...req.body, createdBy: req.user.id });

  res.send({ data: newDoc });
});

export default handler;
