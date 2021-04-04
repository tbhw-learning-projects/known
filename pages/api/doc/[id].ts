import nc from 'next-connect';
import middlewares from '../../../middleware/all';
import { error } from '../../../middleware';
import { doc } from '../../../db';
import { Request } from '../../../types';

const handler = nc({
  onError: error,
});

handler.use(middlewares);

handler.put(async (req: Request, res) => {
  const updatedDoc = await doc.updateOne(req.db, req.query.id.toString(), req.body);

  res.send({ data: updatedDoc });
});

export default handler;
