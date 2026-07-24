import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import { authRouter } from './auth/routes/auth.router';
import { blogsRouter } from './blogs/routes/blogs.router';
import { commentsRouter } from './comments/routes/comments.router';
import { postsRouter } from './posts/routes/posts.router';
import { securityDevicesRouter } from './security-devices/routes/security-devices.router';
import { testingRouter } from './testing/routes/testing.router';
import { usersRouter } from './users/routes/users.router';
import { HttpStatuses } from './core/types/http-statuses.type';
import { setupSwagger } from './core/swagger/setup-swagger.util';
import { SETTINGS } from './core/settings/settings';

/*Функция для конфигурирования экземпляров приложения Express.js.*/
export const setupApp = async (app: Express): Promise<Express> => {
  /*Подключаем middleware, разрешающий кросс-доменные запросы.*/
  app.use(cors());
  /*Подключаем middleware для парсинга JSON в теле запроса.*/
  app.use(express.json());
  /*Подключаем middleware для работы с cookies.*/
  app.use(cookieParser());
  /*Просим Express.js доверять заголовкам от прокси, чтобы правильно определять реальный IP пользователя и протокол
  вместо того, чтобы видеть IP самого прокси-сервера.*/
  app.set('trust proxy', true);
  /*GET-запрос по получению главной страницы.*/
  app.get('/', (req: Request, res: Response) => res.status(HttpStatuses.Ok_200).send('Hello World!'));
  /*Подключаем роутеры.*/
  app.use(SETTINGS.BLOGS_PATH, blogsRouter);
  app.use(SETTINGS.POSTS_PATH, postsRouter);
  app.use(SETTINGS.COMMENTS_PATH, commentsRouter);
  app.use(SETTINGS.USERS_PATH, usersRouter);
  app.use(SETTINGS.AUTH_PATH, authRouter);
  app.use(SETTINGS.SECURITY_DEVICES_PATH, securityDevicesRouter);
  app.use(SETTINGS.TESTING_PATH, testingRouter);
  /*Инициализируем документацию Swagger.*/
  setupSwagger(app);
  return app;
};
