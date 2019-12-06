import express from 'express';

import requestHelpersMiddleware from './app/middlewares/requestHelpers';
import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(requestHelpersMiddleware);
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
