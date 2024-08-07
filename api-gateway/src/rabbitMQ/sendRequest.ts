import amqp from 'amqplib';
import { config } from '../config';
import { v4 as uuidv4 } from 'uuid';

type RequestInfoMapType = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
};

const requestInfoMap = new Map<string, RequestInfoMapType>();

let connection: amqp.Connection | null = null;
let channel: amqp.Channel | null = null;

const ensureConnection: () => Promise<{
  connection: amqp.Connection | null;
  channel: amqp.Channel | null;
}> = async () => {
  if (connection && channel) {
    return { connection, channel };
  }

  connection = await amqp.connect(config.RABBITMQ_URI);
  channel = await connection.createChannel();
  return { connection, channel };
};

export const createResponseQueue = async (
  channel: amqp.Channel,
  service: string,
  exchange: string,
) => {
  const responseQueue = await channel.assertQueue(
    `gateway_${service}_response`,
    {
      exclusive: false,
    },
  );

  await channel.bindQueue(responseQueue.queue, exchange, responseQueue.queue);

  return responseQueue;
};

export const sendRequest = (
  service: string,
  data: unknown,
): Promise<unknown> => {
  const timeout = Number(config.RABBIT_MESSAGE_TIMEOUT);

  return new Promise(async (resolve, reject) => {
    const asyncExecutor = async () => {
      let timeoutHandle: any;

      try {
        const { channel } = await ensureConnection();

        if (!channel) {
          reject(new Error('Channel is not initialized'));
          return;
        }

        const exchange = `${service}_exchange_topic`;
        const responseQueue = await createResponseQueue(
          channel,
          service,
          exchange,
        );
        const correlationId = uuidv4();

        timeoutHandle = setTimeout(() => {
          requestInfoMap.delete(correlationId);
          reject(new Error('Request timed out'));
        }, timeout);

        requestInfoMap.set(correlationId, {
          resolve: (value) => {
            clearTimeout(timeoutHandle);
            resolve(value);
          },
          reject: (reason) => {
            clearTimeout(timeoutHandle);
            reject(reason);
          },
        });

        await channel.consume(
          responseQueue.queue,
          (msg) => {
            const correlationId = msg?.properties.correlationId;
            const requestInfo = requestInfoMap.get(correlationId);

            if (msg && requestInfo) {
              const response = JSON.parse(msg.content.toString());
              requestInfo.resolve(response);
              requestInfoMap.delete(correlationId);
            }
          },
          { noAck: true },
        );

        const requestRoutingKey = `${service}_request`;
        channel.publish(
          exchange,
          requestRoutingKey,
          Buffer.from(
            JSON.stringify({ ...(data as object), source_service: 'gateway' }),
          ),
          {
            correlationId,
            replyTo: responseQueue.queue,
          },
        );
      } catch (error) {
        clearTimeout(timeoutHandle);
        reject(error);
      }
    };

    await asyncExecutor();
  });
};
