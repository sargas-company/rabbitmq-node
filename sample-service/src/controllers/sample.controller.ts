import { handleError } from '../errors';
import { StatusCodes } from 'http-status-codes';

class SampleController {
  getSomeData = async () => {
    try {
      const data = {
        id: 1,
        name: 'Sample Data',
        description: 'This is a sample description of the data.',
      };

      return {
        data,
        statusCode: StatusCodes.OK,
        success: true,
      };
    } catch (error) {
      console.log(error);
      return handleError();
    }
  };
}

export const sampleController = new SampleController();
