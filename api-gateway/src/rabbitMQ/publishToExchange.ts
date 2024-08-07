import { connectRabbitMQ } from './helpers';
import { Channel, Connection } from 'amqplib';
import { config } from '../config';

let connection: Connection | null = null;
let channel: Channel | null = null;

const initRabbitMqConnection = async () => {
  if (!connection || !channel) {
    const rabbitMq = await connectRabbitMQ(config.RABBITMQ_URI);
    connection = rabbitMq.connection;
    channel = await connection.createChannel();
  }
};

export const publishToExchange = async (
  exchangeName: string,
  data: object,
  retryCount = 0,
) => {
  await initRabbitMqConnection();

  if (channel) {
    await channel.assertExchange(exchangeName, 'fanout', { durable: false });
    channel.publish(exchangeName, '', Buffer.from(JSON.stringify(data)), {
      headers: { 'x-retry-count': retryCount },
    });
    console.log(' [x] Sent %s', JSON.stringify(data));
  } else {
    console.error('Failed to initialize channel');
  }
};
