import { Request, Response, NextFunction } from 'express';
import UserService from '../service/user-service';
import { ApiError } from '../exceptions/api-error';
import { UserAttributes } from '../models/user-model';
import validator from 'validator';
import path from 'path';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management operations
 */
class UserController {
  /**
   * @swagger
   * /api/registration:
   *   post:
   *     summary: Register a new user
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: user@example.com
   *                 description: 'Должен быть действительным email адресом'
   *               password:
   *                 type: string
   *                 example: "securePassword123"
   *                 description: 'Пароль должен содержать не менее 8 символов'
   *               role:
   *                 type: string
   *                 enum:
   *                   - ADMIN
   *                   - USER
   *                 description: 'Выберите одну из следующих ролей: ADMIN или USER'
   *                 example: "ADMIN"
   *     responses:
   *       200:
   *         description: User registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: integer
   *                       example: 21
   *                     email:
   *                       type: string
   *                       example: user@example.com
   *                     role:
   *                       type: string
   *                       example: ADMIN
   *                 accessToken:
   *                   type: string
   *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJA0YbRg9C5ZXhhbXBsZS5jb20iLCJpZCI6MjEsInJvbGUiOiJBRE1JTiIsImlhdCI6MTcyNjA5MTMwMCwiZXhwIjoxNzI4NjgzMzAwfQ.-g9Pnj7hKaj383uquQ1kanGG8Xkh5ifkXp_pnfeHj-g"
   *                 refreshToken:
   *                   type: string
   *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJA0YbRg9C5ZXhhbXBsZS5jb20iLCJpZCI6MjEsInJvbGUiOiJBRE1JTiIsImlhdCI6MTcyNjA5MTMwMCwiZXhwIjoxNzI4NjgzMzAwfQ.R9lRvjH9AbpOvQVcm_0SsDQKFJ8PpBFQzY4I3c_-PWQ"
   *       400:
   *         description: Invalid request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 400
   *                 message:
   *                   type: string
   *                   example: 'Email, пароль и роль не могут быть пустыми'
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-09-11T21:48:02.943Z"
   *                 errorCode:
   *                   type: string
   *                   example: "EMPTY_FIELDS"
   *                 errors:
   *                   type: array
   *                   items:
   *                     type: string
   *                   example:
   *                     - 'Неверный формат email'
   *                     - 'Пароль должен содержать не менее 8 символов'
   *                     - 'Пользователь с почтовым адресом user@example.com уже зарегистрирован с другой ролью'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 401
   *                 message:
   *                   type: string
   *                   example: 'Пользователь не авторизован'
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-09-11T21:09:48.396Z"
   *                 errorCode:
   *                   type: string
   *                   example: "UNAUTHORIZED"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 500
   *                 message:
   *                   type: string
   *                   example: 'Внутренняя ошибка сервера'
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-09-11T21:13:39.853Z"
   *                 errorCode:
   *                   type: string
   *                   example: "INTERNAL_SERVER_ERROR"
   */

  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, role } = req.body;
      if (!email || !password || !role) {
        throw ApiError.badRequest('Email, пароль и роль не могут быть пустыми');
      }
      if (!validator.isEmail(email)) {
        throw ApiError.badRequest('Неверный формат email');
      }
      if (!validator.isLength(password, { min: 8 })) {
        throw ApiError.badRequest(
          'Пароль должен содержать не менее 8 символов',
        );
      }

      const userData = await UserService.registration(email, password, role);

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }
  /**
   * @swagger
   * /api/login:
   *   post:
   *     summary: Log in a user
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: userAlex@example.com
   *                 description: 'Должен быть действительным email адресом'
   *               password:
   *                 type: string
   *                 example: "iamAlex123"
   *                 description: 'Пароль должен содержать не менее 8 символов'
   *               role:
   *                 type: string
   *                 enum:
   *                   - ADMIN
   *                   - USER
   *                 example: "ADMIN"
   *                 description: 'Укажите роль пользователя (ADMIN или USER)'
   *     examples:
   *       application/json:
   *         value:
   *           email: "userAlex@example.com"
   *           password: "iamAlex123"
   *           role: "ADMIN"
   *     responses:
   *       200:
   *         description: User logged in successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: integer
   *                       example: 21
   *                     email:
   *                       type: string
   *                       example: "user@example.com"
   *                     role:
   *                       type: string
   *                       example: "ADMIN"
   *                 accessToken:
   *                   type: string
   *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (токен доступа)"
   *                 refreshToken:
   *                   type: string
   *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (токен обновления)"
   *       400:
   *         description: Invalid request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 400
   *                 message:
   *                   type: string
   *                   example: 'Email, пароль и роль не могут быть пустыми'
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-09-11T21:48:02.943Z"
   *                 errorCode:
   *                   type: string
   *                   example: "MISSING_FIELDS"
   *                 errors:
   *                   type: array
   *                   items:
   *                     type: string
   *                   example:
   *                     - 'Неверный формат email'
   *                     - 'Пароль должен содержать не менее 8 символов'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 401
   *                 message:
   *                   type: string
   *                   example: 'Неверный пароль'
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-09-11T21:54:41.808Z"
   *                 errorCode:
   *                   type: string
   *                   example: "INVALID_PASSWORD"
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 404
   *                 message:
   *                   type: string
   *                   example: 'Пользователь не найден'
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-09-11T21:57:10.858Z"
   *                 errorCode:
   *                   type: string
   *                   example: "USER_NOT_FOUND"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 500
   *                 message:
   *                   type: string
   *                   example: 'Внутренняя ошибка сервера'
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-09-11T21:55:05.089Z"
   *                 errorCode:
   *                   type: string
   *                   example: "INTERNAL_SERVER_ERROR"
   */

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, role } = req.body;
      if (!email || !password || !role) {
        throw ApiError.badRequest('Email, пароль и роль не могут быть пустыми');
      }
      if (!validator.isEmail(email)) {
        throw ApiError.badRequest('Неверный формат email');
      }
      if (!validator.isLength(password, { min: 8 })) {
        throw ApiError.badRequest(
          'Пароль должен содержать не менее 8 символов',
        );
      }
      const userData = await UserService.login(email, password, role);

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

/**
 * @swagger
 * /api/refresh:
 *   get:
 *     summary: Refresh user tokens using refreshToken from cookies
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []  # Если токен используется для защиты
 *     parameters:
 *       - in: cookie
 *         name: refreshToken
 *         required: true
 *         schema:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: 'The refresh token in cookies'
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 19
 *                     email:
 *                       type: string
 *                       example: "userAlex@example.com"
 *                     role:
 *                       type: string
 *                       example: "ADMIN"
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Invalid request (e.g. missing or invalid refreshToken)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: 'Некорректный запрос'
 *                 errorCode:
 *                   type: string
 *                   example: 'INVALID_REFRESH_TOKEN'
 *       401:
 *         description: Unauthorized (e.g. refreshToken is missing or invalid)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: 'Кука с refreshToken не найдена или токен недействителен'
 *                 errorCode:
 *                   type: string
 *                   example: 'UNAUTHORIZED'
 *       404:
 *         description: User not found (e.g. invalid user data in token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: 'Пользователь не найден'
 *                 errorCode:
 *                   type: string
 *                   example: 'USER_NOT_FOUND'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: 'Внутренняя ошибка сервера'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-09-11T21:13:39.853Z"
 *                 errorCode:
 *                   type: string
 *                   example: 'INTERNAL_SERVER_ERROR'
 */
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        throw ApiError.unauthorized('Кука с refreshToken не найдена');
      }

      const userData = await UserService.refresh(refreshToken);

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  /**
 * @swagger
 * openapi: 3.0.0
 * info:
 *   title: User API
 *   description: API for managing users
 *   version: 1.0.0
 * servers:
 *   - url: http://localhost:3000/api
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 
 * paths:
 *   /api/user/{id}:
 *     delete:
 *       summary: Delete a user by ID
 *       tags: [Users]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *           description: Unique identifier of the user to be deleted
 *       security:
 *         - bearerAuth: []  # Requires authorization
 *       responses:
 *         200:
 *           description: User deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Пользователь успешно был удален"
 *         400:
 *           description: Invalid request, user ID is not valid
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: integer
 *                     example: 400
 *                   message:
 *                     type: string
 *                     example: "Некорректный идентификатор пользователя"
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-09-11T21:40:43.436Z"
 *                   errorCode:
 *                     type: string
 *                     example: "INVALID_USER_ID"
 *         401:
 *           description: Unauthorized, access token is missing or invalid
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: integer
 *                     example: 401
 *                   message:
 *                     type: string
 *                     example: "Пользователь не авторизован"
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-09-11T21:09:48.396Z"
 *                   errorCode:
 *                     type: string
 *                     example: "UNAUTHORIZED"
 *         404:
 *           description: User not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: integer
 *                     example: 404
 *                   message:
 *                     type: string
 *                     example: "Пользователь не найден"
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-09-11T21:38:45.141Z"
 *                   errorCode:
 *                     type: string
 *                     example: "USER_NOT_FOUND"
 *         500:
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: integer
 *                     example: 500
 *                   message:
 *                     type: string
 *                     example: "Внутренняя ошибка сервера"
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-09-11T21:13:39.853Z"
 *                   errorCode:
 *                     type: string
 *                     example: "INTERNAL_SERVER_ERROR"
 */

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const numericId = Number(id);

      if (isNaN(numericId)) {
        throw ApiError.badRequest('Некорректный индификатор пользователя');
      }

      const user = await UserService.deleteUser(numericId);

      if (!user) {
        throw ApiError.notFound('Пользователь для удаления не найден');
      }

      return res.json({ message: 'Пользователь успешно был удален' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   put:
   *     summary: Update user details
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Unique identifier of the user to be updated
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: user@example.com
   *                 description: New email address for the user. Must be a valid email format.
   *               password:
   *                 type: string
   *                 example: "securePassword123"
   *                 description: New password for the user. Should be at least 8 characters long.
   *               role:
   *                 type: string
   *                 enum: [ADMIN, USER]
   *                 example: "USER"
   *                 description: New role for the user. Must be either ADMIN or USER.
   *     responses:
   *       200:
   *         description: User updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   example: 9
   *                 email:
   *                   type: string
   *                   example: "use23r@example.com"
   *                 password:
   *                   type: string
   *                   example: "$2b$04$KV4jntzCUE2KNV8Z.d3bHeYI2GcGb5Qkg3gW/fY5BHpF/sqOlvDuG"
   *                 role:
   *                   type: string
   *                   example: "USER"
   *                 avatar:
   *                   type: string
   *                   example: "uploads/avatars/1726088772823.png"
   *                 createdAt:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-09-09T15:48:37.740Z"
   *                 updatedAt:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-09-11T21:42:37.659Z"
   *       400:
   *         description: Invalid request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 400
   *                 message:
   *                   type: string
   *                   example: "Некорректный запрос"
   *                 errors:
   *                   type: array
   *                   items:
   *                     type: string
   *                   example:
   *                     - "Пользователь с почтовым адресом user@example.com уже существует"
   *                     - "Пароль должен содержать не менее 8 символов"
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 404
   *                 message:
   *                   type: string
   *                   example: "Пользователь не найден"
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-09-11T21:38:45.141Z"
   *                 errorCode:
   *                   type: string
   *                   example: "UNKNOWN_ERROR"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 500
   *                 message:
   *                   type: string
   *                   example: "Internal Server Error"
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-09-11T21:13:39.853Z"
   */
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { email, password, role } = req.body;
      const numericId = Number(id);

      if (isNaN(numericId)) {
        throw ApiError.badRequest('Некорректный индификатор пользователя');
      }

      const updatedUser = await UserService.updateUser(
        numericId,
        email,
        password,
        role,
      );

      return res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
  /**
   * @swagger
   * /api/users:
   *   get:
   *     summary: Retrieve a list of users with optional filtering, sorting, and pagination
   *     tags: [Users]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Page number for pagination. Default is 1.
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Number of users to return per page. Default is 10.
   *       - in: query
   *         name: sort
   *         schema:
   *           type: string
   *           default: createdAt
   *           enum: [email, role, createdAt, updatedAt]
   *         description: Field by which to sort the users. Default is `createdAt`.
   *       - in: query
   *         name: roleFilter
   *         schema:
   *           type: string
   *           enum: [ADMIN, USER]
   *         description: Filter users by role. Possible values are `ADMIN` or `USER`.
   *       - in: query
   *         name: emailFilter
   *         schema:
   *           type: string
   *         description: Filter users by part of their email address. Supports partial matching.
   *     responses:
   *       200:
   *         description: List of users retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 users:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: integer
   *                         example: 1
   *                       email:
   *                         type: string
   *                         example: user@example.com
   *                       role:
   *                         type: string
   *                         example: USER
   *                       createdAt:
   *                         type: string
   *                         format: date-time
   *                         example: "2024-01-01T00:00:00Z"
   *                       updatedAt:
   *                         type: string
   *                         format: date-time
   *                         example: "2024-01-01T00:00:00Z"
   *                 total:
   *                   type: integer
   *                   description: Total number of users matching the query
   *                   example: 100
   *                 totalPages:
   *                   type: integer
   *                   description: Total number of pages based on the pagination
   *                   example: 10
   *                 currentPage:
   *                   type: integer
   *                   description: Current page number
   *                   example: 1
   *       400:
   *         description: Invalid request parameters
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 400
   *                 message:
   *                   type: string
   *                   example: "Некорректные параметры запроса"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 500
   *                 message:
   *                   type: string
   *                   example: "Внутренняя ошибка сервера"
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-09-11T21:13:39.853Z"
   */
  // Получение всех пользователей
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = 'createdAt',
        roleFilter = '',
        emailFilter = '',
      } = req.query;

      // Определяем допустимые поля для сортировки
      const validSortFields = ['email', 'role', 'createdAt', 'updatedAt'];

      // Проверяем корректность поля сортировки
      if (!validSortFields.includes(sort as string)) {
        throw ApiError.badRequest('Некорректный параметр сортировки ');
      }

      const users = await UserService.getAllUsers(
        parseInt(page as string), 
        parseInt(limit as string), 
        sort as string,
        roleFilter as UserAttributes['role'],
        emailFilter as UserAttributes['email'], 
      );

      return res.json(users);
    } catch (error) {
      next(error);
    }
  }
  /**
   * @swagger
   * /api/users/{id}/avatar:
   *   post:
   *     summary: Загрузить новый аватар для пользователя
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []  # Указывает, что для этого метода требуется авторизация с помощью Bearer Token
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID пользователя, для которого загружается аватар
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               avatar:
   *                 type: string
   *                 format: binary
   *                 description: Файл аватара для загрузки. Должен быть изображением.
   *     responses:
   *       200:
   *         description: Аватар загружен и пользователь обновлен успешно
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   example: 9
   *                 email:
   *                   type: string
   *                   example: "ivan3ADMIN@gmail.com"
   *                 password:
   *                   type: string
   *                   example: "$2b$04$bOvCQ2bglL3vvEwtYDUgWu.A0O/CYmEkJ8cbkmDAW07Z92n6GoKxy"
   *                 role:
   *                   type: string
   *                   example: "USER"
   *                 avatar:
   *                   type: string
   *                   example: "uploads/avatars/1726088772823.png"
   *                 createdAt:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-09-09T15:48:37.740Z"
   *                 updatedAt:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-09-11T21:06:12.954Z"
   *       400:
   *         description: Некорректный запрос или файл не загружен
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 400
   *                 message:
   *                   type: string
   *                   example: "Файл не загружен"
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-09-11T21:12:04.207Z"
   *                 errorCode:
   *                   type: string
   *                   example: "UNKNOWN_ERROR"
   *       401:
   *         description: Неавторизованный доступ, токен доступа отсутствует или недействителен
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 401
   *                 message:
   *                   type: string
   *                   example: "Пользователь не авторизован"
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-09-11T21:09:48.396Z"
   *                 errorCode:
   *                   type: string
   *                   example: "UNKNOWN_ERROR"
   *       404:
   *         description: Пользователь не найден
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 404
   *                 message:
   *                   type: string
   *                   example: "Пользователь не найден"
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-09-11T21:12:27.230Z"
   *                 errorCode:
   *                   type: string
   *                   example: "UNKNOWN_ERROR"
   *       500:
   *         description: Внутренняя ошибка сервера
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 500
   *                 message:
   *                   type: string
   *                   example: "Internal Server Error"
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-09-11T21:13:39.853Z"
   *                 errorCode:
   *                   type: string
   *                   example: "UNKNOWN_ERROR"
   */
  // Загрузка аватара
  async uploadAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.id);
      if (isNaN(userId)) {
        throw ApiError.badRequest('Некорректный индификатор пользователя');
      }

      const file = req.file;
      if (!file) {
        throw ApiError.badRequest('Файл не загружен');
      }

      const avatarPath = path.join('uploads', 'avatars', file.filename);

      // Обновляем информацию о пользователе
      const updatedUser = await UserService.updateUserImage(userId, avatarPath);

      return res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
