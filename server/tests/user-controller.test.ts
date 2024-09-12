// import request from 'supertest';
// import express from 'express';
// import UserController from '../controllers/user-controller';
// import  UserService  from '../service/user-service';
// import { describe, it, beforeEach,expect,jest} from '@jest/globals';
// const app = express();
// app.use(express.json());

// // Мокирование UserService
// jest.mock('../service/user-service');
// const mockedUserService = UserService as jest.Mocked<typeof UserService>;

// app.post('/register', UserController.registration);
// app.post('/login', UserController.login);
// app.post('/refresh', UserController.refresh);
// app.delete('/user/:id', UserController.deleteUser);
// app.put('/user/:id', UserController.updateUser);
// app.get('/users', UserController.getUsers);
// app.post('/user/:id/avatar', UserController.uploadAvatar);

// describe('UserController', () => {
//   beforeEach(() => {
//     jest.resetAllMocks();
//   });

//   it('should register a user successfully', async () => {
//     const mockUserData = {
//       id: 1,
//       email: 'test@example.com',
//       role: 'USER',
//       refreshToken: 'mockRefreshToken',
//     };

//     mockedUserService.registration.mockResolvedValue(mockUserData);

//     const response = await request(app)
//       .post('/register')
//       .send({
//         email: 'test@example.com',
//         password: 'password123',
//         role: 'USER',
//       });

//     expect(response.status).toBe(200);
//     expect(response.body).toEqual(mockUserData);
//   });

//   it('should throw error for invalid email format during registration', async () => {
//     const response = await request(app)
//       .post('/register')
//       .send({
//         email: 'invalid-email',
//         password: 'password123',
//         role: 'USER',
//       });

//     expect(response.status).toBe(400);
//     expect(response.body.message).toBe('Неверный формат email');
//   });

//   // Добавьте другие тесты по необходимости
// });
