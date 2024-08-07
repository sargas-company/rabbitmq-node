import amqp from 'amqplib';

export const publishMessage = async (
  channel: amqp.Channel,
  exchangeName: string,
  routingKey: string,

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  message: any,
  options: amqp.Options.Publish,
): Promise<void> => {
  channel.publish(
    exchangeName,
    routingKey,
    Buffer.from(JSON.stringify(message)),
    options,
  );
};
