import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

// Загрузка переменных окружения из файла .env
dotenv.config();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Пользователи и их задачи',
    version: '1.0.0',
    description: 'Документация для API',
  },
  servers: [
    {
      url: process.env.SWAGGER_SERVER_URL || 'http://localhost:5000', // Используем переменную окружения или значение по умолчанию
      description: 'Локальный сервер',
    },
  ],
};

const options: swaggerJsdoc.Options = {
  swaggerDefinition,
  apis: [
    '../src/server/controllers/task-controller.ts',
    '../src/server/controllers/user-controller.ts',
  ],
};

// Генерация спецификации Swagger
const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
