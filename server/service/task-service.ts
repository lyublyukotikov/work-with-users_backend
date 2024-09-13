import { Task } from '../models/task-model';
import { User } from '../models/user-model';
import { ApiError } from '../exceptions/api-error';
import { Op } from 'sequelize';

class TaskService {
  async createTask(title: string, description: string, userId: number) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw ApiError.notFound('Пользователь не найден', 'USER_NOT_FOUND');
    }

    const task = await Task.create({
      title,
      description,
      userId,
    });

    return task;
  }

  async getTasksByUser(
    userId: number,
    page: number,
    limit: number,
    sort: string,
    titleFilter: string,
  ) {
    const offset = (page - 1) * limit;

    // Создание объекта для фильтрации
    const whereClause: { userId: number; title?: { [Op.iLike]: string } } = {
      userId,
    };

    // Применяем фильтр по названию задачи, если он указан
    if (titleFilter) {
      whereClause.title = { [Op.iLike]: `%${titleFilter}%` };
    }

    // Получение задач с учетом фильтра, сортировки и пагинации
    const tasks = await Task.findAndCountAll({
      where: whereClause,
      order: [[sort, 'ASC']],
      limit,
      offset,
    });

    return {
      tasks: tasks.rows,
      total: tasks.count,
      totalPages: Math.ceil(tasks.count / limit),
      currentPage: page,
    };
  }

  async updateTask(id: number, title?: string, description?: string) {
    const task = await Task.findByPk(id);
    if (!task) {
      throw ApiError.notFound('Задача не найдена', 'TASK_NOT_FOUND');
    }

    if (title) {
      task.title = title;
    }
    if (description) {
      task.description = description;
    }

    await task.save();

    return task;
  }

  async deleteTask(id: number) {
    const task = await Task.findByPk(id);
    if (!task) {
      throw ApiError.notFound('Задача не найдена', 'TASK_NOT_FOUND');
    }

    await task.destroy();

    return task;
  }
}

export default new TaskService();
