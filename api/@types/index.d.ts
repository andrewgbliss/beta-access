interface SequelizeOptions {
  options: any;
  conditions: any;
}

interface RequestUser {
  id: number;
}

declare namespace Express {
  export interface Request {
    sequelize?: SequelizeOptions;
    results?: any;
    refreshJWT?: Function;
    user?: RequestUser;
  }
}
