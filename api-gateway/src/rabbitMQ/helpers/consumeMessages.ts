import amqp from 'amqplib';

export const consumeMessages = async (
  channel: amqp.Channel,
  queue: string,
  callback: (msg: amqp.ConsumeMessage | null) => void,
): Promise<void> => {
  await channel.consume(queue, callback, { noAck: true });
};
