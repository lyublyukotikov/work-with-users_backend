import { Request, Response, NextFunction } from 'express'; // Исправьте импорт NextFunction
import { ApiError } from '../exceptions/api-error';

function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  // Логирование ошибки для отладки
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
      timestamp: new Date().toISOString(),
      errorCode: err.code || 'UNKNOWN_ERROR',
    });
  }

  return res.status(500).json({
    status: 500,
    message: 'Internal Server Error',
    timestamp: new Date().toISOString(),
  });
}

export default errorHandler;
