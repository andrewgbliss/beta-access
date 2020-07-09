import express from 'express';
import { loggedInUser } from '../../../../../middleware';

const router = express.Router();

const getMe = (req, res) => {
  res.json(req.user);
};

const updateAccount = async (req, res, next) => {
  try {
    if (req.user.accountId !== Number(req.params.id)) {
      throw {
        message: 'Forbidden',
        status: 403,
      };
    }
    const { Accounts } = req.app.get('db');
    await Accounts.scope('update').update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.end();
  } catch (e) {
    next(e);
  }
};

const updateUser = async (req, res, next) => {
  try {
    if (req.user.id !== Number(req.params.id)) {
      throw {
        message: 'Forbidden',
        status: 403,
      };
    }
    const { Users } = req.app.get('db');
    await Users.scope('update').update(req.body, {
      where: {
        id: req.params.id,
      },
      individualHooks: true,
    });
    res.end();
  } catch (e) {
    next(e);
  }
};

router.get('/', loggedInUser, getMe);
router.put('/', loggedInUser, updateUser);
router.put('/account', loggedInUser, updateAccount);

export default router;
