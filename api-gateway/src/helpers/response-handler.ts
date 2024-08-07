import { NextFunction, Request, Response as ExpressResponse } from 'express';

class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message); // Pass the message to the Error constructor
    this.statusCode = statusCode; // Add a statusCode property
  }
}

export const responseHandler = (
  req: Request,
  res: ExpressResponse,
  next: NextFunction,
) => {
  const oldJson = res.json.bind(res);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  res.json = function (data: any) {
    /* eslint-enable @typescript-eslint/no-explicit-any */
    if (typeof data !== 'object' || data === null) {
      return oldJson(data);
    }

    let statusCode = 200;
    const { result } = data;

    if ('statusCode' in data) {
      statusCode = data.statusCode;
    }

    let response = result;
    if (result && typeof result === 'object' && 'statusCode' in result) {
      const { statusCode: resStatusCode, ...rest } = result;
      response = rest;
      statusCode = resStatusCode;
    }
    this.status(statusCode);
    return oldJson(response);
  };

  next();
};
