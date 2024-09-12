# Используем официальный образ Node.js
FROM node:18

# Устанавливаем pnpm глобально
RUN npm install -g pnpm

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем файлы package.json и pnpm-lock.yaml в контейнер
COPY package.json pnpm-lock.yaml ./

# Устанавливаем зависимости через pnpm
RUN pnpm install

# Копируем остальные файлы проекта в контейнер
COPY . .

# Компилируем TypeScript в JavaScript
RUN pnpm run build

# Указываем порт, который будет использоваться в контейнере
EXPOSE 5000

# Запускаем приложение
CMD ["pnpm", "start"]
