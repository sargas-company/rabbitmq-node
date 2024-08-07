import express, { Application } from 'express';
import logger from 'morgan';
import path from 'path';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';

// Import custom modules and configurations
import { config } from './config';

// RabbitMQ
import setupRabbitMQ from './rabbitMQ/setupRabbitMQ';

class App {
  public readonly app: Application;

  constructor() {
    this.app = express();
    this.initializeGlobalVariables();
    this.initializeMiddlewares();
  }

  private initializeGlobalVariables(): void {
    (global as any).appRoot = path.resolve(process.cwd(), '../');
  }

  private initializeMiddlewares(): void {
    const formatsLogger =
      this.app.get('env') === 'development' ? 'dev' : 'short';
    this.app.use(logger(formatsLogger));
    this.app.use(cors({ credentials: true }));
    this.app.use(compression());
    this.app.use(bodyParser.json());
  }

  public async initializeRabbitMQ(): Promise<void> {
    try {
      await setupRabbitMQ(config.RABBITMQ_URI);
    } catch (error) {
      console.error('Failed to connect to RabbitMQ', error);
    }
  }
}

// Create the application instance
export const appInstance = new App();
export const app = appInstance.app;
