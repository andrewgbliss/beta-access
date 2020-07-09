import express, { Request } from 'express';
import { asyncEndpoint, toJson } from '../../../../../middleware';

const router = express.Router();

const register = async (req: Request) => {
  const { Users, Accounts } = req.app.get('db');
  const email = req.app.get('email');
  if (!req.body.email) {
    throw {
      status: 400,
      message: `email is required`,
    };
  }
  if (!req.body.password) {
    throw {
      status: 400,
      message: `password is required`,
    };
  }
  const existingUser = await Users.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (existingUser) {
    throw {
      status: 400,
      message: `${req.body.email} already exists`,
    };
  }
  const account = await Accounts.create();
  const data = { accountId: account.id, ...req.body };
  const user = await Users.scope('create').create(data);
  email.register(user.email, user.verificationHash);
  req.results = { verificationHash: user.verificationHash };
};

const completeRegistration = async (req: Request) => {
  const { Users } = req.app.get('db');
  const { verificationHash } = req.params;
  const user = await Users.findOne({
    where: {
      verificationHash,
    },
  });
  if (!user) {
    throw {
      status: 404,
      message: `${verificationHash} not found`,
    };
  }
  await user.update({
    verified: true,
    verificationHash: null,
  });
  const token = req.refreshJWT(user.id);
  req.results = { token };
};

router.post('/', asyncEndpoint(register), toJson);
router.get(
  '/complete/:verificationHash',
  asyncEndpoint(completeRegistration),
  toJson
);

export default router;
