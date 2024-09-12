import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express'; // Добавляем тип Request
import path from 'path';
import fs from 'fs';

// Определение абсолютного пути к папке для хранения аватаров
const storagePath = path.join(__dirname, 'uploads', 'avatars');

// Проверка и создание папки, если она не существует
if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath, { recursive: true });
}

// Настройка хранилища для загруженных файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storagePath); // Указываем путь до папки uploads/avatars
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Генерация уникального имени файла
  },
});

// Фильтр для проверки типа файла
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Если тип файла допустим, продолжаем загрузку
  } else {
    cb(null, false); // Недопустимый тип файла, загрузка отклонена
  }
};

// Создание экземпляра multer с настройками
const upload = multer({ storage, fileFilter });

export default upload;
