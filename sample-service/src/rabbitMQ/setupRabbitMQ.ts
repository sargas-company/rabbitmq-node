import sendResponse from './sendResponse';
import { config } from '../config';
import {
  assertExchange,
  assertQueue,
  bindQueue,
  connectRabbitMQ,
  consumeMessages,
  handleConsumeFromExchange,
  handleEvent,
} from './helpers';
import { Channel } from 'amqplib';

const setupRabbitMQ = async (rabbitmqUri: string): Promise<void> => {
  let channel: Channel;

  try {
    const connectionResult = await connectRabbitMQ(rabbitmqUri);
    channel = connectionResult.channel;
  } catch (RabbitConnectionError) {
    console.log(
      `An error occurred while connecting to RabbitMQ: ${RabbitConnectionError}`,
    );
    process.exit(-1);
  }

  // Ensure channel is not undefined before proceeding
  if (!channel) {
    console.log('Failed to create a channel to RabbitMQ');
    process.exit(-1);
  }

  handleConsumeFromExchange();

  const queueName = `${config.SERVICE_NAME}_request_queue`;
  const exchangeName = `${config.SERVICE_NAME}_exchange_topic`;
  const requestRoutingKey = `${config.SERVICE_NAME}_request`;

  const requestQueue = await assertQueue(channel, queueName);
  await assertExchange(channel, exchangeName);
  await bindQueue(channel, {
    exchangeName,
    queue: requestQueue,
    routingKey: requestRoutingKey,
  });

  await consumeMessages(channel, requestQueue, async (msg) => {
    if (msg && msg.fields.routingKey === requestRoutingKey) {
      const data = JSON.parse(msg.content.toString());
      const sourceService = data.source_service;

      try {
        const response = await handleEvent({
          event: data.event || data.action,
          payload: data,
        });

        await sendResponse({
          correlationId: msg.properties.correlationId,
          data: response,
          replyTo: msg.properties.replyTo,
          service: config.SERVICE_NAME,
          sourceService,
        });
      } catch (error) {
        console.error('Error handling action:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        await sendResponse({
          service: config.SERVICE_NAME,
          sourceService,
          replyTo: msg.properties.replyTo,
          data: errorMessage,
          correlationId: msg.properties.correlationId,
        });
      }
    }
  });
};

export default setupRabbitMQ;
