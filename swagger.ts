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
      url: process.env.SWAGGER_SERVER_URL,
      description: 'Локальный сервер',
    },
  ],
};

const options: swaggerJsdoc.Options = {
  swaggerDefinition,
  apis: [
    '/app/server/controllers/task-controller.ts', // Обновленный путь
    '/app/server/controllers/user-controller.ts', // Обновленный путь
  ],
};

// Генерация спецификации Swagger
const swaggerSpec = swaggerJsdoc(options);
console.log(JSON.stringify(swaggerSpec, null, 2));
export default swaggerSpec;
