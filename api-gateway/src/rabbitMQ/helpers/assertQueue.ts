import amqp from 'amqplib';

export const assertQueue = async (
  channel: amqp.Channel,
  queueName: string,
  //  If set to true, it indicates that the asserted queue should only be accessible by the current connection.
  exclusive = false,
): Promise<string> => {
  const result = await channel.assertQueue(queueName, { exclusive });

  return result.queue;
};
