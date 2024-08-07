import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import * as helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import path from 'path';

import { responseHandler } from './helpers';

//cron
import { runSimpleEvent } from './cron/scheduler';

import { sampleServiceRouter } from './routes';

const serverRequestLimit = rateLimit({
  max: config.serverRateLimits.maxRequests,
  windowMs: config.serverRateLimits.period,
});

class App {
  public readonly app: express.Application = express();
  constructor() {
    (global as any).appRoot = path.resolve(process.cwd(), '../');

    this.app.use(helmet.default());
    const formatsLogger =
      this.app.get('env') === 'development' ? 'dev' : 'short';
    this.app.use(logger(formatsLogger));
    this.app.set('trust proxy', true);
    this.app.use(
      cors({
        origin: this.configureCors,
      }),
    );
    this.app.use(serverRequestLimit);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(
      express.static(path.resolve((global as any).appRoot, 'public')),
    );

    this.mountRoutes();
    this.configureMiddleware();

    runSimpleEvent();
  }

  private configureMiddleware(): void {
    this.app.use(responseHandler);
  }

  private configureCors = (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ): void => {
    const whiteList = config.ALLOWED_ORIGIN.split(',');

    if (!origin) {
      return callback(null, true);
    }

    if (!whiteList.includes(origin)) {
      return callback(new Error('Cors not allowed'));
    }

    return callback(null, true);
  };

  private mountRoutes(): void {
    this.app.use('/sample-service', sampleServiceRouter);
  }
}

export const app = new App().app;
