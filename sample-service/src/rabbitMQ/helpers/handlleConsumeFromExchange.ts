import consumeFromExchange from '../consumeFromExchange';
import rabbitMQEvents from '../events';
import { withTryCatch } from './eventTryCatchWrapper';

export const handleConsumeFromExchange = async () => {
  await consumeFromExchange(
    'simpleEvent',
    withTryCatch(rabbitMQEvents.simpleEvent),
  );
};
