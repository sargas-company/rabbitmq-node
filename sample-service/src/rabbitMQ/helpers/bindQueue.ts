import amqp from 'amqplib';

interface QueueParams {
  queue: string;
  exchangeName: string;
  routingKey: string;
}

export const bindQueue = async (
  channel: amqp.Channel,
  queueParams: QueueParams,
): Promise<void> => {
  const { queue, exchangeName, routingKey } = queueParams;
  await channel.bindQueue(queue, exchangeName, routingKey);
};
