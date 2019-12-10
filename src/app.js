import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import Youch from 'youch';
import { resolve } from 'path';

import requestHelpersMiddleware from './app/middlewares/requestHelpers';
import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(requestHelpersMiddleware);
    this.server.use(cors());

    this.server.use(
      '/static',
      express.static(resolve(__dirname, '..', 'public'))
    );
  }

  routes() {
    this.server.use(routes);
  }

  exceptionHandler() {
    // eslint-disable-next-line no-unused-vars
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }
      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
