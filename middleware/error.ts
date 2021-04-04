import { Response, Request } from '../types';

export default async function onError(error: string, req: Request, res: Response): Promise<void> {
  console.log(error);
  res.status(500).end();
}
