import { NextApiRequest, NextApiResponse } from 'next';

interface NextPreviewRequest extends NextApiRequest {
  query: { route: string };
}

export default function (req: NextPreviewRequest, res: NextApiResponse): void {
  res.setPreviewData({});
  res.redirect(req.query.route);
}
