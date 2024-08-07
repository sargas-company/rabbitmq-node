import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  HOST: process.env.HOST || 'http://localhost',
  PORT: process.env.PORT || 3000,

  serverRateLimits: {
    maxRequests: 1000,
    period: 15 * 60 * 1000, // 15 minutes
  },

  ALLOWED_ORIGIN:
    process.env.ALLOWED_ORIGIN ||
    'http://localhost:3001,http://localhost:3000,http://localhost:3002',

  RABBITMQ_URI: process.env.RABBITMQ_URI || 'amqp://localhost:5672',

  SERVICE_NAME: process.env.SERVICE_NAME || 'api-gateway',
  RABBIT_MESSAGE_TIMEOUT: process.env.RABBIT_MESSAGE_TIMEOUT || 10000, // 10 seconds
};
