interface SimpleEvent {
  id: string;
  timestamp: Date;
  type: string;
  payload: any;
}

const simpleEventHandler = async (data: SimpleEvent) => {
  try {
    if (!data || !data.id || !data.timestamp || !data.type) {
      console.log('Invalid event data');
    }
    console.log(`Test event payload: ${JSON.stringify(data.payload)}`);
  } catch (error) {
    console.log(
      'Error handling event:',
      error instanceof Error ? error.message : error,
    );
  }
};

export default simpleEventHandler;
