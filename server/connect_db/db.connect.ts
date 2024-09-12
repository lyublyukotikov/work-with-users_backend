import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Загрузка переменных окружения из файла .env
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
  },
  logging: console.log,
});

// Проверка подключения к базе данных
sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL database');
  })
  .catch((error) => {
    console.log('Unable to connect to database:', error);
  });

export default sequelize;
