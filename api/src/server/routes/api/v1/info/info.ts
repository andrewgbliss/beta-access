import express, { Request, Response, NextFunction } from 'express';
import { toJson } from '../../../../middleware';

const router = express.Router();

const getInfo = (req: Request, res: Response, next: NextFunction) => {
  req.results = {
    env: process.env.NODE_ENV,
    hostname: require('os').hostname(),
  };
  next();
};

router.get('/', getInfo, toJson);

export default router;
