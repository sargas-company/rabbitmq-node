import amqp from 'amqplib';

export const assertExchange = async (
  channel: amqp.Channel,
  exchangeName: string,
): Promise<void> => {
  await channel.assertExchange(exchangeName, 'topic', { durable: true });
};
