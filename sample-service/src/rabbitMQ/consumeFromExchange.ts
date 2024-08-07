import { config } from '../config';
import { Channel, Connection, ConsumeMessage } from 'amqplib';
import { connectRabbitMQ } from './helpers';

interface ErrorMessage {
  name?: string;
  message: string;
  code?: string;
  stack?: string;
}

let connection: Connection | null = null;
let channel: Channel | null = null;

const initRabbitMqConnection = async (): Promise<void> => {
  if (!connection || !channel) {
    const rabbitMq = await connectRabbitMQ(config.RABBITMQ_URI);
    connection = rabbitMq.connection;
    channel = await connection.createChannel();
  }
};

const isMongooseError = (error: ErrorMessage): boolean => {
  return (
    error.name === 'MongooseError' || error.code === 'SOME_SPECIFIC_ERROR_CODE'
  );
};

const calculateRetryDelay = (retryCount: number): number => {
  return config.INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
};

const handleError = async (
  error: ErrorMessage,
  msg: ConsumeMessage,
  channel: Channel,
  exchangeName: string,
  deadLetterQueue: string,
) => {
  console.error('Error processing message:', error);

  const headers = msg.properties.headers;
  const retryCount = headers['x-retry-count'] ? headers['x-retry-count'] : 0;

  if (isMongooseError(error) && retryCount < config.MAX_RETRIES) {
    const data = JSON.parse(msg.content.toString());
    headers['x-retry-count'] = retryCount + 1;

    setTimeout(() => {
      channel.publish(exchangeName, '', Buffer.from(JSON.stringify(data)), {
        headers,
      });
    }, calculateRetryDelay(retryCount));

    channel.ack(msg);
  } else {
    const dlqMessage = {
      originalMessage: JSON.parse(msg.content.toString()),
      errorDetails: {
        errorMessage: error.message,
        errorStack: error.stack,
      },
      exchangeName,
      errorTimestamp: new Date().toISOString(),
    };

    console.error('Message will be sent to the dead-letter queue.');
    channel.sendToQueue(
      deadLetterQueue,
      Buffer.from(JSON.stringify(dlqMessage)),
    );
    channel.ack(msg);
  }
};
const consumeFromExchange = async (
  exchangeName: string,
  callback: (data: unknown) => Promise<void>,
): Promise<void> => {
  await initRabbitMqConnection();

  if (!channel) {
    console.error('Channel is not available.');
    return;
  }

  const dlx = `${exchangeName}.${config.SERVICE_NAME}.dlx`;
  const deadLetterQueue = `${exchangeName}.${config.SERVICE_NAME}.dead`;

  await channel.assertExchange(exchangeName, 'fanout', { durable: false });

  await channel.assertExchange(dlx, 'direct', { durable: true });
  await channel.assertQueue(deadLetterQueue, { durable: true });
  await channel.bindQueue(deadLetterQueue, dlx, '');

  const qok = await channel.assertQueue('', { exclusive: false });
  await channel.bindQueue(qok.queue, exchangeName, '');

  console.log(` [*] Waiting for messages in ${exchangeName}`);

  await channel.consume(
    qok.queue,
    async (msg: ConsumeMessage | null) => {
      if (!msg) return;
      try {
        const data = JSON.parse(msg.content.toString());
        console.log(
          ` [x] Received event: ${exchangeName}`,
          JSON.stringify(data),
        );

        await callback(data);
        channel.ack(msg);
      } catch (error) {
        await handleError(
          error as ErrorMessage,
          msg,
          channel,
          exchangeName,
          deadLetterQueue,
        );
      }
    },
    { noAck: false },
  );
};

export default consumeFromExchange;
