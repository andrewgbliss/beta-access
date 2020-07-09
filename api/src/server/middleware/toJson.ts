import { Request, Response } from 'express';

const results = (req: Request, res: Response) => {
  res.json(req.results);
};

export default results;
