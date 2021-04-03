import nc from 'next-connect';
import middlewares from '../../../middleware/all';
import { error } from '../../../middleware';
import { folder } from '../../../db';
import { Request } from '../../../types';

const handler = nc({
  onError: error,
});

handler.use(middlewares);

handler.post(async (req: Request, res) => {
  const newFolder = await folder.createFolder(req.db, { ...req.body, createdBy: req.user.id });

  res.send({ data: newFolder });
});

export default handler;
