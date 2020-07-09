import { Request, Response, NextFunction } from 'express';

const loggedInUser = async (req: any, res: Response, next: NextFunction) => {
  const { Users, Accounts } = req.app.get('db');
  req.user = await Users.scope('read').findByPk(req.user.id, {
    include: [
      {
        model: Accounts,
        as: 'account',
      },
    ],
  });
  next();
};

export default loggedInUser;
