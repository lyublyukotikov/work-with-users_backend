import { Router } from 'express';
import UserController from '../controllers/user-controller';
import TaskController from '../controllers/task-controller';
import authMiddleware from '../middleware/auth-middleware';
import { isAdmin } from '../middleware/is-admin-middleware';
import upload from '../middleware/upload';
const router = Router();

// Роут для регистрации пользователя
router.post('/registration', UserController.registration);
// Роут для логина
router.post('/login', UserController.login);
// Роут для обновления токена
router.get('/refresh', UserController.refresh);
// удаление пользователей доступное только администратором(создал 2 middleware чтобы понять авторизован пользователь? имеет ли он роль админа? )
router.delete('/user/:id', authMiddleware, isAdmin, UserController.deleteUser);
// обновление данных о пользователи доступное всем пользователям
// Обновление пользователя
router.put('/users/:id', UserController.updateUser);
// Роут для получения списка пользователей с фильтрацией, сортировкой и пагинацией
router.get('/users', UserController.getUsers);

// Создание задачи (требуется авторизация)
router.post('/tasks', authMiddleware, TaskController.createTask);

// Получение задач пользователя (требуется авторизация)
router.get(
  '/tasks/user/:userId',
  authMiddleware,
  TaskController.getTasksByUser,
);

// Обновление задачи (требуется авторизация)
router.put('/tasks/:id', authMiddleware, TaskController.updateTask);

// Удаление задачи (требуется авторизация)
router.delete('/tasks/:id', authMiddleware, TaskController.deleteTask);

// Роут для загрузки аватара (требуется авторизация)
router.post(
  '/users/:id/avatar',
  authMiddleware,
  upload.single('avatar'),
  UserController.uploadAvatar,
);

export default router;
