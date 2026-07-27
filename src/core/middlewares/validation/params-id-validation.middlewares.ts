import { TYPES } from '../../../ioc/types';
import { NextFunction, Request, Response } from 'express';
/*Импортируем метод "param()" из библиотеки express-validator, чтобы проверять ID.*/
import { param, ValidationChain } from 'express-validator';
import { inject, injectable } from 'inversify';
import { BlogsRepository } from '../../../blogs/repositories/blogs.repository';
import { PostsRepository } from '../../../posts/repositories/posts.repository';
import { BlogDBType } from '../../../blogs/repositories/types/blog-db.type';
import { PostDBType } from '../../../posts/repositories/types/post-db.type';
import { HttpStatuses } from '../../types/http-statuses.type';

export const idValidation: ValidationChain = param('id')
  .exists()
  .withMessage('Field "id" is required')
  .isString()
  .withMessage('Field "id" must be a string')
  .trim()
  .notEmpty()
  .withMessage('Field "id" must not be empty')
  .isMongoId()
  .withMessage('Field "id" must be an ObjectId');

export const blogIdValidation: ValidationChain = param('blogId')
  .exists()
  .withMessage('Field "blogId" is required')
  .isString()
  .withMessage('Field "blogId" must be a string')
  .trim()
  .notEmpty()
  .withMessage('Field "blogId" must not be empty')
  .isMongoId()
  .withMessage('Field "blogId" must be an ObjectId');

export const postIdValidation: ValidationChain = param('postId')
  .exists()
  .withMessage('Field "postId" is required')
  .isString()
  .withMessage('Field "postId" must be a string')
  .trim()
  .notEmpty()
  .withMessage('Field "postId" must not be empty')
  .isMongoId()
  .withMessage('Field "postId" must be an ObjectId');

/*Middleware для проверки существования блога по ID.*/
@injectable()
export class BlogExistsMiddleware {
  constructor(@inject(TYPES.BlogsRepository) private readonly blogsRepository: BlogsRepository) {}

  public async execute(req: Request<any, any, any, any>, res: Response, next: NextFunction): Promise<void | Response> {
    /*Получаем ID блога.*/
    const blogId: string | undefined = req.params.blogId || req.body.blogId;
    /*Если ID блога не был найден, то сообщаем об этом клиенту.*/
    if (!blogId) return res.sendStatus(HttpStatuses.NotFound_404);
    /*Если ID блога был найден, то просим репозиторий "blogsRepository" найти блог по ID в БД.*/
    const blogDB: BlogDBType | null = await this.blogsRepository.findById(blogId);
    /*Если блог не был найден, то сообщаем об этом клиенту.*/
    if (!blogDB) return res.sendStatus(HttpStatuses.NotFound_404);
    /*Если блог был найден, то прикрепляем имя блога к запросу.*/
    req.blogName = blogDB.name as string;
    /*Разрешаем дальнейшее выполнение запроса при помощи функции "next()".*/
    next();
  }
}

/*Middleware для проверки существования поста по ID.*/
@injectable()
export class PostExistsMiddleware {
  constructor(@inject(TYPES.PostsRepository) private readonly postsRepository: PostsRepository) {}

  public async execute(
    req: Request<{ postId: string }, {}, {}, {}>,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    /*Получаем ID поста.*/
    const postId: string | undefined = req.params.postId;
    /*Если ID поста не был найден, то сообщаем об этом клиенту.*/
    if (!postId) return res.sendStatus(HttpStatuses.NotFound_404);
    /*Если ID поста был найден, то просим репозиторий "postsRepository" найти пост по ID в БД.*/
    const postDB: PostDBType | null = await this.postsRepository.findById(postId);
    /*Если пост не был найден, то сообщаем об этом клиенту.*/
    if (!postDB) return res.sendStatus(HttpStatuses.NotFound_404);
    /*Если пост был найден, то разрешаем дальнейшее выполнение запроса при помощи функции "next()".*/
    next();
  }
}
