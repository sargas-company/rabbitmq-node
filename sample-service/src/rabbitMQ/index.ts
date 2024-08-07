import setupRabbitMQ from './setupRabbitMQ';
import sendRequest from './sendRequest';
import sendResponse from './sendResponse';
import { publishToExchange } from './publishToExchange';
import consumeFromExchange from './consumeFromExchange';

const rabbitMQWorkers = {
  setupRabbitMQ,
  sendRequest,
  sendResponse,
  publishToExchange,
  consumeFromExchange,
};

export default rabbitMQWorkers;
