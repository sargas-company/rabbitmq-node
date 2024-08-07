import { config } from '../config';
import { v4 as uuidv4 } from 'uuid';
import {
  assertExchange,
  assertQueue,
  bindQueue,
  connectRabbitMQ,
  consumeMessages,
  publishMessage,
} from './helpers';

// Define the structure of the request parameters
interface RequestParams {
  service: string;
  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any;
    event: string;
  };
}

// Define the structure of the request information stored in correlationIds
interface RequestInfo {
  resolve: (response: any) => void;
  reject: (error: Error) => void;
  timeoutId: NodeJS.Timeout;
}

// Map to store correlation IDs and their associated request information
const correlationIds = new Map<string, RequestInfo>();

// Function to send a request to RabbitMQ
const sendRequest = async ({ service, data }: RequestParams): Promise<any> => {
  const { connection, channel } = await connectRabbitMQ(config.RABBITMQ_URI);

  const exchangeName = `${service}_exchange_topic`;
  const requestRoutingKey = `${service}_request`;
  const responseRoutingKey = `${config.SERVICE_NAME}_${service}_response`;

  // Ensure the exchange and queues are properly set up
  await assertExchange(channel, exchangeName);

  const { queue } = await channel.assertQueue('', { exclusive: true });
  const responseQueue = await assertQueue(
    channel,
    `${config.SERVICE_NAME}_${service}_response`,
  );

  await bindQueue(channel, {
    queue,
    exchangeName,
    routingKey: responseRoutingKey,
  });

  await bindQueue(channel, {
    queue: responseQueue,
    exchangeName,
    routingKey: responseRoutingKey,
  });

  // Generate a unique correlation ID for the request
  const correlationId = uuidv4();

  // Set up a promise to handle the response
  new Promise((resolve, reject) => {
    // Consume messages from the response queue
    consumeMessages(channel, responseQueue, (msg) => {
      if (msg && correlationIds.has(msg.properties.correlationId)) {
        // Retrieve the resolve, reject, and timeoutId associated with the correlationId
        const {
          resolve: resolveFn,
          reject: rejectFn,
          timeoutId,
        } = correlationIds.get(msg.properties.correlationId);

        // Delete the correlationId from the map and clear the timeout
        correlationIds.delete(msg.properties.correlationId);
        clearTimeout(timeoutId);

        // Parse the response content and resolve the promise with the response
        const response = JSON.parse(msg.content.toString());
        resolveFn(response);

        // Close the connection after a short delay (500ms)
        setTimeout(() => {
          connection.close();
        }, 500);
      }
    });
  });

  // Initialize the request information with an empty object
  correlationIds.set(correlationId, {} as RequestInfo);

  const timeoutDuration = 10000; // Set the timeout duration in milliseconds (e.g., 10 seconds)

  // Create a new promise to handle the request
  const response = await new Promise(async (resolve, reject) => {
    try {
      // Set a timeout for the request
      const timeoutId = setTimeout(() => {
        const errorMessage = 'Request timed out.';
        reject(new Error(errorMessage));

        // Delete the correlationId from the map and log the error
        correlationIds.delete(correlationId);
        console.error(errorMessage);
      }, timeoutDuration);

      // Store the resolve, reject, and timeoutId in the correlationIds map
      correlationIds.set(correlationId, {
        resolve,
        reject,
        timeoutId,
      });

      // Publish the request message to the exchange
      await publishMessage(
        channel,
        exchangeName,
        requestRoutingKey,
        { ...data, source_service: config.SERVICE_NAME },
        {
          correlationId,
          replyTo: queue,
        },
      );
    } catch (error) {
      reject(error);
    }
  });

  // Delete the correlationId from the map
  correlationIds.delete(correlationId);

  return response;
};

export default sendRequest;
