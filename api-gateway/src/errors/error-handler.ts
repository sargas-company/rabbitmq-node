import { Response } from 'express';

export const createErrorResponse = (
  res: Response,
  statusCode: number,
  message: string,
) => {
  return res.json({
    result: {
      message,
      statusCode,
      success: false,
    },
  });
};
