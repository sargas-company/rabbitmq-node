import { sampleController } from '../../controllers';

interface EventHandlers {
  [key: string]: (data: any) => Promise<any>;
}

const eventHandlers: EventHandlers = {
  getSomeData: sampleController.getSomeData,
};

interface IHandleEvent {
  event: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export const handleEvent = async ({
  event,
  payload,
}: IHandleEvent): Promise<any> => {
  const handler = eventHandlers[event];

  if (!handler) {
    throw new Error(`Invalid event: ${event}`);
  }

  return await handler(payload);
};
