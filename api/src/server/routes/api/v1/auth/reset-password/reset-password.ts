import express, { Request, Response } from 'express';
import { asyncEndpoint, toJson } from '../../../../../middleware';

const router = express.Router();

const resetPassword = async (req: Request) => {
  const { Users } = req.app.get('db');
  const email = req.app.get('email');
  const user = await Users.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user) {
    throw {
      status: 404,
      message: 'User not found',
    };
  }
  user.setResetPassword(req.body.timeout || 15);
  await user.save();
  email.resetPassword(user.email, user.resetPasswordHash);
  req.results = {
    resetPasswordHash: user.resetPasswordHash,
  };
};

const verifyHash = async (req: Request, res: Response) => {
  const { Users } = req.app.get('db');
  const user = await Users.findOne({
    where: {
      resetPasswordHash: req.params.hash,
    },
  });
  if (!user) {
    throw {
      status: 404,
      message: 'User not found',
    };
  }
  if (!user.hasValidResetPassword()) {
    throw {
      status: 400,
      message: 'Verification has timed out',
    };
  }
  user.unsetResetPassword();
  user.save();
  res.end();
};

router.put('/', asyncEndpoint(resetPassword), toJson);
router.get('/verify/:hash', asyncEndpoint(verifyHash));

export default router;
