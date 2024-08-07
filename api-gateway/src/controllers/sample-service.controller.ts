import { Request, Response } from 'express';

import { handleRequest } from '../helpers';
import { ServicesEnum } from '../constants';

class SampleServiceController {
  public async getSomeData(req: Request, res: Response): Promise<void> {
    await handleRequest(res, ServicesEnum.SAMPLE_SERVICE, 'getSomeData');
  }
}

export const sampleServiceController = new SampleServiceController();
