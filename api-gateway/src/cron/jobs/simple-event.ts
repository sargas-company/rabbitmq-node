import { publishToExchange } from '../../rabbitMQ/publishToExchange';
import { v4 as uuidv4 } from 'uuid';

interface SimpleEvent {
  id: string;
  timestamp: Date;
  type: string;
  payload: any;
}

/**
 * Publishes a test event to the RabbitMQ fanout exchange.
 *
 * @async
 * @returns {Promise<void>} - A promise that resolves when the event is published.
 * @throws {Error} - Throws an error if the publishing fails.
 */
const simpleEvent = async (): Promise<void> => {
  try {
    const data: SimpleEvent = {
      id: uuidv4(),
      timestamp: new Date(),
      type: 'SIMPLE_EVENT_TYPE',
      payload: {
        message: 'This is a test payload',
        userId: uuidv4(),
      },
    };

    await publishToExchange('simpleEvent', data);
  } catch (error) {
    console.error('Error:', error);
  }
};

export default simpleEvent;
