import express, { Request, Response, NextFunction } from 'express';
import { asyncEndpoint, toJson } from '../../../../../middleware';

const router = express.Router();

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { Users } = req.app.get('db');
  const user = await Users.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user || !user.verifyPassword(req.body.password)) {
    throw {
      status: 403,
      message: 'Email or Password is incorrect',
    };
  }
  const token = req.refreshJWT(user.id);
  req.results = {
    token,
  };
  next();
};

router.post('/', asyncEndpoint(login), toJson);

export default router;
