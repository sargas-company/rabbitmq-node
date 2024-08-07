import { Response } from 'express';
import { sendRequest } from '../rabbitMQ';
import { ServicesEnum, HttpStatusCode } from '../constants';
import { createErrorResponse } from '../errors';

type HandleRequestType = (
  res: Response,
  service: ServicesEnum,
  action: string,
  data?: object,
) => Promise<void>;

const handleRequest: HandleRequestType = async (
  res: Response,
  service: ServicesEnum,
  action: string,
  data: object = {},
) => {
  try {
    const response = await sendRequest(service, { action, ...data });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((response as any).success) {
      res.json({
        result: response,
      });
    } else {
      createErrorResponse(
        res,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (response as any).statusCode ? (response as any).statusCode : 500,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typeof response === 'string' ? response : (response as any).message,
      );
    }
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error,
    });
  }
};

export { handleRequest };
