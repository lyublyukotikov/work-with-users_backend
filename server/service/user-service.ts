import bcrypt from 'bcrypt';
import UserDto from '../dtos/user-dto';
import tokenService from './token-service';
import { User, UserAttributes } from '../models/user-model';
import { ApiError } from '../exceptions/api-error';
import { Op, fn, col, FindAndCountOptions, WhereOptions } from 'sequelize';
import validator from 'validator';

class UserService {
  async registration(
    email: string,
    password: string,
    role: UserAttributes['role'],
  ) {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      if (existingUser.role !== role) {
        throw ApiError.badRequest(
          `Пользователь с почтовым адресом ${email} уже зарегистрирован с другой ролью: ${existingUser.role}`,
        );
      } else {
        throw ApiError.badRequest(
          `Пользователь с почтовым адресом ${email} уже существует`,
        );
      }
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const user = await User.create({ email, password: hashPassword, role });
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.unauthorized('Пользователь не авторизирован');
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw ApiError.unauthorized('Пользователь не авторизирован');
    }

    const user = await User.findByPk(userData.id);
    if (!user) {
      throw ApiError.notFound('Пользователь не найден');
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async login(email: string, password: string, role: UserAttributes['role']) {
    const user = await User.findOne({ where: { email, role } });

    if (!user) {
      throw ApiError.notFound('Пользователь не найден');
    }

    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.unauthorized('Неверный пароль');
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async deleteUser(id: number) {
    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
    }

    return user;
  }

  async updateUser(
    id: number,
    email?: string,
    password?: string,
    role?: UserAttributes['role'],
  ) {
    const user = await User.findByPk(id);

    if (!user) {
      throw ApiError.notFound('Пользователь не найден');
    }

    if (email) {
      if (!validator.isEmail(email)) {
        throw ApiError.badRequest('Неверный формат email');
      }
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw ApiError.badRequest(
          `Пользователь с почтовым адресом ${email} уже существует`,
        );
      }
      user.email = email;
    }

    if (password) {
      if (!validator.isLength(password, { min: 8 })) {
        throw ApiError.badRequest(
          'Пароль должен содержать не менее 8 символов',
        );
      }
      const hashPassword = await bcrypt.hash(password, 3);
      user.password = hashPassword;
    }

    if (role) {
      if (!['ADMIN', 'USER'].includes(role)) {
        throw ApiError.badRequest('Роль должна быть либо ADMIN, либо USER');
      }
      user.role = role;
    }

    await user.save();
    return user;
  }
  async getAllUsers(
    page: number,
    limit: number,
    sort: string,
    roleFilter: UserAttributes['role'],
    emailFilter: string,
  ) {
    const offset = (page - 1) * limit;

    // Получение всех уникальных ролей из базы данных
    const roles = await User.findAll({
      attributes: [[fn('DISTINCT', col('role')), 'role']],
      raw: true,
    });

    // Преобразование ролей в массив строк
    const validRoles = roles.map((role) => role.role);

    // Проверка на корректность фильтра по роли
    if (roleFilter && !validRoles.includes(roleFilter)) {
      return {
        users: [],
        total: 0,
        totalPages: 0,
        currentPage: page,
      };
    }

    // Создание объекта для фильтрации
    const whereClause: WhereOptions<User> = {};

    // Применяем фильтр по роли, если он указан
    if (roleFilter) {
      whereClause.role = roleFilter;
    }

    // Применяем фильтр по email, если он указан
    if (emailFilter) {
      whereClause.email = { [Op.iLike]: `%${emailFilter}%` };
    }

    // Получение пользователей с учетом фильтра, сортировки и пагинации
    const users = await User.findAndCountAll({
      where: whereClause, // Применение фильтров
      order: [[sort, 'ASC']], // Сортировка по указанному полю
      limit,
      offset,
    } as FindAndCountOptions<User>);

    // Возврат результата с информацией о пагинации
    return {
      users: users.rows, // Сами пользователи
      total: users.count, // Общее количество пользователей
      totalPages: Math.ceil(users.count / limit), // Общее количество страниц
      currentPage: page, // Текущая страница
    };
  }

  // Обновление пользователя
  async updateUserImage(id: number, avatar: string) {
    const user = await User.findByPk(id);
    if (!user) {
      throw ApiError.notFound('Пользователь не найден');
    }

    if (avatar) user.avatar = avatar;

    await user.save();
    return user;
  }
}

export default new UserService();
