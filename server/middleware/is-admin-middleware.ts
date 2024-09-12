import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../exceptions/api-error'; // Импорт класса ApiError

// Middleware для проверки, является ли пользователь администратором
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  const user = req.user;

  // Проверяем наличие пользователя и его роли
  if (!user || user.role !== 'ADMIN') {
    return next(
      ApiError.forbidden('Доступ запрещен, требуется роль администратора'),
    ); // Используем ApiError
  }

  // Если все в порядке, передаем управление следующему middleware
  next();
}
