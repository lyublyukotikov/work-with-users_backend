import express from 'express';
import sequelize from './connect_db/db.connect'; // Sequelize connection
import router from './router/index'; // Ensure file is properly referenced
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler';
import logger from './logger/logger';
import swaggerSpec from '../swagger';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000; 

app.use(logger);

app.use(express.json());


app.use(cookieParser());


app.use('/api', router);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(errorHandler);


async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
}
syncDatabase();


const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
