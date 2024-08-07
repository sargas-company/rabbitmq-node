import amqp from 'amqplib';

export const connectRabbitMQ = async (
  uri: string,
): Promise<{
  connection: amqp.Connection;
  channel: amqp.Channel;
}> => {
  const connection = await amqp.connect(uri);
  const channel = await connection.createChannel();

  return { connection, channel };
};
