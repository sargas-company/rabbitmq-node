import { StatusCodes } from 'http-status-codes';

export function handleError(
  statusCode?: number,
  message?: string,
): {
  statusCode: number;
  success: boolean;
  message: string;
} {
  return {
    statusCode: statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    success: false,
    message: message || 'Internal server error',
  };
}
