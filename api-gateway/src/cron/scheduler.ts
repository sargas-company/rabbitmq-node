import cron from 'node-cron';
import simpleEvent from './jobs/simple-event';

export const runSimpleEvent = () => {
  cron.schedule('* * * * *', simpleEvent);
};
