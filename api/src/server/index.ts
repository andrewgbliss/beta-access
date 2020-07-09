import express, { CookieOptions } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import expressjwt from 'express-jwt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import path from 'path';
import socket from 'socket.io';
import db from '../db';
import email from '../email';
import routes from './routes';

const app = express();
const http = require('http').Server(app);

/**
 * Environment ∏
 */
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;
const SESSION_TIMEOUT = process.env.SESSION_TIMEOUT;

/**
 * Express Variables
 */
app.set('port', PORT);
app.set('env', NODE_ENV);
app.set('db', db);
app.set('email', email);

/**
 * Static Server
 */
if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client')));
}

/**
 * Middleware
 */
app.use(cors());
app.use(logger('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/**
 * JWT Authentication
 */
app.use(
  expressjwt({
    algorithms: ['RS256'],
    secret: JWT_SECRET,
    getToken(req) {
      if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
      ) {
        return req.headers.authorization.split(' ')[1];
      } else if (req.query && req.query.token) {
        return req.query.token;
      } else if (req.cookies && req.cookies.token) {
        return req.cookies.token;
      }
      return null;
    },
  }).unless({
    path: [
      '/test',
      '/api/v1/healthcheck',
      '/api/v1/healthcheck/error',
      '/api/v1/info',
      '/api/v1/login',
      '/api/v1/logout',
      '/api/v1/register',
      '/api/v1/register/complete',
      /\/api\/v1\/register\/complete\//i,
      '/api/v1/reset-password',
      /\/api\/v1\/reset-password\//i,
    ],
  })
);

/**
 * Refresh JWT for each use
 */
app.use(async (req, res, next) => {
  req.refreshJWT = (id) => {
    const token = jwt.sign({ id, createdAt: new Date() }, JWT_SECRET, {
      expiresIn: SESSION_TIMEOUT,
    });
    const options: CookieOptions = {
      maxAge: Number(SESSION_TIMEOUT),
      httpOnly: false,
    };
    res.set('JWT_TOKEN', token);
    res.cookie('token', token, options);
    return token;
  };
  if (req.user) {
    req.refreshJWT(req.user.id);
    next();
  } else {
    next();
  }
});

app.use('/', routes);

// If its production then just server the index.html
// if it can't find the route
if (NODE_ENV === 'production') {
  app.use('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
  });
} else {
  // If its not production then throw a 404
  app.use((req, res, next) => {
    const err: any = new Error(`${req.method} ${req.url} Not Found`);
    err.status = 404;
    next(err);
  });
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

const server = app.listen(PORT, () => {
  console.log(
    `Express Server started on Port ${app.get(
      'port'
    )} | Environment : ${app.get('env')}`
  );
});

let io;
(async () => {
  io = await socket(http);
  app.set('socket.io', io);
  // Debug socket io connections
  // socketio.on('connection', (socket) => {
  //   console.log('a user connected');
  //   socket.on('disconnect', () => {
  //     console.log('user disconnected');
  //   });
  //   socket.on('message', (msg) => {
  //     socketio.emit('message', msg);
  //   });
  //   socket.on('info', (msg) => {
  //     socketio.emit('info', {
  //       env: process.env.NODE_ENV,
  //       hostname: require('os').hostname(),
  //     });
  //   });
  // });
  console.log(`Socket Server started | Environment : ${app.get('env')}`);
})();

export default {
  app,
  server,
  io,
};
