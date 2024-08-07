import { appInstance } from './app';
import { config } from './config';
import * as http from 'http';

async function startServer() {
  try {
    await appInstance.initializeRabbitMQ();
    const server = http.createServer(appInstance.app);
    server.listen(config.PORT, () => {
      console.log(
        `${config.SERVICE_NAME} service listening on port ${config.PORT}`,
      );
    });

    process.on('SIGTERM', () => {
      server.close(() => {
        process.exit(0);
      });
    });

    process.on('unhandledRejection', (error) => {
      console.error(error);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();
