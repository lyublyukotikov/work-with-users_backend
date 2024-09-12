import jwt from 'jsonwebtoken';
import { Token } from '../models/token-model';
import { Payload } from '../types/types';
import { ApiError } from '../exceptions/api-error';

// Токенты для валидации
const JWT_ACCESS_SECRET = 'jwt-secret-key';
const JWT_REFRESH_SECRET = 'jwt-refresh-key';

class TokenService {
  generateTokens(payload: Payload) {
    if (!payload) {
      throw ApiError.badRequest('Отсутствует payload для генерации токенов');
    }

    const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
      expiresIn: '30d',
    });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    });

    return { accessToken, refreshToken };
  }

  async saveToken(userId: number, refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.badRequest(
        'Отсутствует refreshToken при сохранении токена',
      );
    }

    const tokenData = await Token.findOne({ where: { user_id: userId } });

    if (tokenData) {
      tokenData.refresh_token = refreshToken;
      return tokenData.save();
    }

    const token = await Token.create({
      user_id: userId,
      refresh_token: refreshToken,
    });
    return token;
  }

  validateRefreshToken(token: string) {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET) as Payload;
    } catch {
      return null;
    }
  }

  validateAccessToken(token: string) {
    try {
      return jwt.verify(token, JWT_ACCESS_SECRET) as Payload;
    } catch {
      return null;
    }
  }

  async findToken(refreshToken: string) {
    try {
      return await Token.findAll({ where: { refresh_token: refreshToken } });
    } catch (error) {
      console.error('Ошибка при поиске токена в базе данных:', error);
      throw ApiError.internal('Ошибка при поиске токена в базе данных');
    }
  }
}

export default new TokenService();
