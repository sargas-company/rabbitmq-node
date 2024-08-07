import { app } from './app';
import { config } from './config';
import * as http from 'http';

const server = http.createServer(app);
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
  console.log(error);
});
