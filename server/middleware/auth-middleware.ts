import { Request, Response, NextFunction } from 'express';
import tokenService from '../service/token-service';
import { UserAttributes } from '../models/user-model';
import { ApiError } from '../exceptions/api-error';

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw ApiError.unauthorized('Пользователь не авторизован');
    }

    const accessToken = authorizationHeader.split(' ')[1];

    if (!accessToken) {
      throw ApiError.unauthorized('Пользователь не авторизован');
    }

    const userData = tokenService.validateAccessToken(accessToken);

    if (!userData) {
      throw ApiError.unauthorized('Неверный токен');
    }

    if (
      typeof userData === 'object' &&
      'id' in userData &&
      'email' in userData &&
      'role' in userData
    ) {
      req.user = userData as UserAttributes;
    } else {
      throw ApiError.unauthorized('Неверный токен');
    }

    next();
  } catch (e) {
    next(e);
  }
}
