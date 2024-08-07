import { config } from '../config';
import { assertExchange, connectRabbitMQ, publishMessage } from './helpers';

interface ResponseParams {
  service: string;
  sourceService: string;
  replyTo: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  correlationId: string;
}

const sendResponse = async ({
  service,
  sourceService,
  replyTo,
  data,
  correlationId,
}: ResponseParams): Promise<void> => {
  const { connection, channel } = await connectRabbitMQ(config.RABBITMQ_URI);

  const exchangeName = `${service}_exchange_topic`;
  const responseRoutingKey = `${sourceService}_${service}_response`;

  await assertExchange(channel, exchangeName);

  await publishMessage(channel, exchangeName, responseRoutingKey, data, {
    correlationId,
    replyTo,
  });

  setTimeout(() => {
    connection.close();
  }, 500);
};

export default sendResponse;
