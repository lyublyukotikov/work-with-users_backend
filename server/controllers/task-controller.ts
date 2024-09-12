import { Request, Response, NextFunction } from 'express';
import TaskService from '../service/task-service';
import { ApiError } from '../exceptions/api-error';

class TaskController {
  /**
   * @swagger
   * tags:
   *   name: Tasks
   *   description: Tasks management operations
   */
  // Создание задачи
  /**
   * @swagger
   * /api/tasks:
   *   post:
   *     summary: Create a new task
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *                 example: "Buy groceries"
   *                 description: 'Title of the task'
   *               description:
   *                 type: string
   *                 example: "Buy milk, bread, and eggs."
   *                 description: 'Description of the task'
   *               userId:
   *                 type: integer
   *                 example: 1
   *                 description: 'ID of the user who owns the task'
   *     responses:
   *       200:
   *         description: Task created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   example: 1
   *                 title:
   *                   type: string
   *                   example: "Buy groceries"
   *                 description:
   *                   type: string
   *                   example: "Buy milk, bread, and eggs."
   *                 userId:
   *                   type: integer
   *                   example: 1
   *                 createdAt:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-09-11T21:48:02.943Z"
   *                 updatedAt:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-09-11T21:48:02.943Z"
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
   *                   example: "2024-09-11T22:26:25.608Z"
   *                 errorCode:
   *                   type: string
   *                   example: "UNKNOWN_ERROR"
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
   *                   example: "2024-09-11T22:29:43.695Z"
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
   *                   example: "2024-09-11T21:13:39.853Z"
   *                 errorCode:
   *                   type: string
   *                   example: "INTERNAL_SERVER_ERROR"
   */

  async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, userId } = req.body;
      const task = await TaskService.createTask(title, description, userId);
      return res.json(task);
    } catch (error) {
      next(error);
    }
  }
/**
 * @swagger
 * /api/tasks/user/{userId}:
 *   get:
 *     summary: Get tasks by user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: 'ID of the user whose tasks are being retrieved'
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: 'Page number for pagination'
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: 'Number of tasks per page'
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [title, description, createdAt, updatedAt]  # Выпадающий список для сортировки
 *           example: 'createdAt'
 *         description: 'Field to sort tasks by'
 *       - in: query
 *         name: titleFilter
 *         schema:
 *           type: string
 *           example: 'grocery'
 *         description: 'Filter tasks by title'
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: "Buy groceries"
 *                       description:
 *                         type: string
 *                         example: "Buy milk, bread, and eggs."
 *                       userId:
 *                         type: integer
 *                         example: 1
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-09-11T21:48:02.943Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-09-11T21:48:02.943Z"
 *                 total:
 *                   type: integer
 *                   example: 5
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 currentPage:
 *                   type: integer
 *                   example: 1
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
 *                   example: 'Некорректный параметр сортировки'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-09-11T21:48:02.943Z"
 *                 errorCode:
 *                   type: string
 *                   example: "INVALID_SORT_FIELD"
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
 *                   example: 'Необходима авторизация'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-09-11T21:48:02.943Z"
 *                 errorCode:
 *                   type: string
 *                   example: "UNAUTHORIZED"
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
 *                   example: 'Некорректный идентификатор пользователя'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-09-11T21:48:02.943Z"
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
  // Получение задач пользователя
  async getTasksByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const numericUserId = Number(userId);
  
      if (isNaN(numericUserId)) {
        throw ApiError.notFound(
          'Некорректный идентификатор пользователя',
          'USER_NOT_FOUND',
        );
      }
  
      const {
        page = 1,
        limit = 10,
        sort = 'createdAt',
        titleFilter = '',
      } = req.query;
  
      // Преобразование параметров в числа
      const numericPage = parseInt(page as string);
      const numericLimit = parseInt(limit as string);
  
      
      const validSortFields = [
        'title',
        'description', 
        'createdAt',
        'updatedAt',
      ];
  
      // Проверка корректности поля сортировки
      if (!validSortFields.includes(sort as string)) {
        throw ApiError.badRequest(
          'Некорректный параметр сортировки',
          'INVALID_SORT_FIELD',
        );
      }
  
      // Передача параметров в сервис
      const tasks = await TaskService.getTasksByUser(
        numericUserId,
        numericPage,
        numericLimit,
        sort as string,
        titleFilter as string,
      );
  
      return res.json(tasks);
    } catch (error) {
      next(error);
    }
  }
  /**
   * @swagger
   * /api/tasks/{id}:
   *   put:
   *     summary: Update a task
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *           example: 1
   *         description: 'ID of the task to be updated'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *                 example: "Buy groceries"
   *                 description: 'Title of the task'
   *               description:
   *                 type: string
   *                 example: "Buy milk, bread, and eggs."
   *                 description: 'Description of the task'
   *     responses:
   *       200:
   *         description: Task updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   example: 1
   *                 title:
   *                   type: string
   *                   example: "Buy groceries"
   *                 description:
   *                   type: string
   *                   example: "Buy milk, bread, and eggs."
   *                 userId:
   *                   type: integer
   *                   example: 1
   *                 createdAt:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-09-11T21:48:02.943Z"
   *                 updatedAt:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-09-11T21:48:02.943Z"
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
   *                   example: 'Некорректный индификатор задачи'
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-09-11T21:48:02.943Z"
   *                 errorCode:
   *                   type: string
   *                   example: "INVALID_TASK_ID"
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
   *                   example: 'Необходима авторизация'
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-09-11T21:48:02.943Z"
   *                 errorCode:
   *                   type: string
   *                   example: "UNAUTHORIZED"
   *       404:
   *         description: Task not found
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
   *                   example: 'Задача не найдена'
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-09-11T21:48:02.943Z"
   *                 errorCode:
   *                   type: string
   *                   example: "TASK_NOT_FOUND"
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

  // Обновление задачи
  async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
      const numericId = Number(id);

      if (isNaN(numericId)) {
        throw ApiError.badRequest('Некорректный индификатор задачи');
      }

      const updatedTask = await TaskService.updateTask(
        numericId,
        title,
        description,
      );
      return res.json(updatedTask);
    } catch (error) {
      next(error);
    }
  }
  /**
   * @swagger
   * /api/tasks/{id}:
   *   delete:
   *     summary: Delete a task
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *           example: 1
   *         description: 'ID of the task to be deleted'
   *     responses:
   *       200:
   *         description: Task deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: 'Задача успешно удалена'
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
   *                   example: 'Некорректный индификатор задачи'
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-09-11T21:48:02.943Z"
   *                 errorCode:
   *                   type: string
   *                   example: "INVALID_TASK_ID"
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
   *                   example: 'Необходима авторизация'
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-09-11T21:48:02.943Z"
   *                 errorCode:
   *                   type: string
   *                   example: "UNAUTHORIZED"
   *       404:
   *         description: Task not found
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
   *                   example: 'Задача не найдена'
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-09-11T21:48:02.943Z"
   *                 errorCode:
   *                   type: string
   *                   example: "TASK_NOT_FOUND"
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

  // Удаление задачи
  async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const numericId = Number(id);

      if (isNaN(numericId)) {
        throw ApiError.badRequest('Некорректный индификатор задачи');
      }

      await TaskService.deleteTask(numericId);
      return res.json({ message: 'Задача успешно удалена' });
    } catch (error) {
      next(error);
    }
  }
}

export default new TaskController();
