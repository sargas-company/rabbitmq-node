import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT || 3001,
  RABBITMQ_URI: process.env.RABBITMQ_URI || 'amqp://localhost:5672',
  SERVICE_NAME: process.env.SERVICE_NAME || 'sample-service',
  INITIAL_RETRY_DELAY: 5000,
  MAX_RETRIES: 3,
};
