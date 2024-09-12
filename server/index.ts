import express from 'express';
import sequelize from './connect_db/db.connect'; // Подключение к базе данных
import router from './router/index'; // Роутинг
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler';
import logger from './logger/logger';
import swaggerSpec from '../swagger';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware для логирования
app.use(logger);

// Для работы с JSON
app.use(express.json());

// Cookie-парсер
app.use(cookieParser());

// Маршруты для API
app.use('/api', router);

// Документация Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors({
  origin: '*', // или укажите конкретные разрешенные домены
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Глобальный обработчик ошибок
app.use(errorHandler);

// Синхронизация базы данных
async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
}
syncDatabase();

// Запуск сервера
const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
