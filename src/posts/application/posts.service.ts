import { lazyInject } from '../../ioc/decorators';
import { TYPES } from '../../ioc/types';
import { inject, injectable } from 'inversify';
import { BlogsService } from '../../blogs/application/blogs.service';
import { CommentsService } from '../../comments/application/comments.service';
import { PostsRepository } from '../repositories/posts.repository';
import { Result } from '../../core/types/result/result.type';
import { ResultStatuses } from '../../core/types/result/result-statuses.type';
import { PostDBType } from '../repositories/types/post-db.type';
import { PostLikeDataDBType } from '../repositories/types/post-like-data-db.type';
import { PostListDBType } from '../repositories/types/post-list-db.type';
import { PostType } from './types/post.type';
import { PostLikeStatus } from './types/post-like-data.type';
import { CreatePostInputDTO } from '../routes/input-dto/create-post.input-dto';
import { PostLikeStatusInputDTO } from '../routes/input-dto/like-post-by-id.input-dto';
import { UpdatePostByIdInputDTO } from '../routes/input-dto/update-post-by-id.input-dto';
import { BlogOutputDTO } from '../../blogs/routes/output-dto/blog.output-dto';
import {
  NewestPostLikeListOutputDTO,
  PostLikeStatusOutputDTO,
  PostOutputDTO,
} from '../routes/output-dto/post.output-dto';
import { mapFromPostDBTypeToPostOutputDTO } from '../repositories/mappers/map-from-post-db-type-to-post-output-dto.util';

/*Сервис для работы с постами.*/
@injectable()
export class PostsService {
  @lazyInject(TYPES.BlogsService) private readonly blogsService!: BlogsService;
  @lazyInject(TYPES.CommentsService) private readonly commentsService!: CommentsService;
  constructor(@inject(TYPES.PostsRepository) private readonly postsRepository: PostsRepository) {}

  /*Метод для добавления поста.*/
  public async create(dto: CreatePostInputDTO): Promise<Result<{ createdPostId: string } | null>> {
    /*Просим сервис "blogsService" найти блог по ID.*/
    const blogResult: Result<{ blogOutput: BlogOutputDTO } | null> = await this.blogsService.findById(dto.blogId);
    /*Если блог не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (blogResult.status !== ResultStatuses.Ok) return blogResult as Result;

    /*Если блог был найден, то создаем объект с данными нового поста.*/
    const newPost: PostType = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blogResult.data!.blogOutput.name,
      createdAt: new Date(),
      extendedLikesInfo: { likesCount: 0, dislikesCount: 0 },
    };

    /*Просим репозиторий "postsRepository" создать пост в БД.*/
    const createdPostId: string = await this.postsRepository.create(newPost);
    /*Возвращаем ResultObject с ID созданного поста.*/
    return { status: ResultStatuses.Created, data: { createdPostId }, extensions: [] };
  }

  /*Метод для поиска поста по ID.*/
  public async findById(id: string, userId?: string): Promise<Result<{ postOutput: PostOutputDTO } | null>> {
    /*Просим репозиторий "postsRepository" найти пост по ID в БД.*/
    const postDB: PostDBType | null = await this.postsRepository.findById(id);

    /*Если пост не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (!postDB) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'id', message: 'Post not found' }],
      };
    }

    /*Формируем статус лайка поста.*/
    let likeStatus: PostLikeStatusOutputDTO = PostLikeStatusOutputDTO.None;

    /*Если в запросе был указан AT.*/
    if (userId) {
      /*Просим репозиторий "postsRepository" найти данные о лайке поста в БД.*/
      const postLikeDataDB: PostLikeDataDBType | null = await this.postsRepository.findPostLikeDataByPostIdAndUserId(
        id,
        userId
      );

      /*Если данные о лайке поста были найдены, то получаем статус лайка.*/
      if (postLikeDataDB) likeStatus = postLikeDataDB.likeStatus as unknown as PostLikeStatusOutputDTO;
    }

    /*Просим репозиторий "postsQueryRepository" найти данные о трех последних лайках поста по ID поста в БД.*/
    const newestLikes: NewestPostLikeListOutputDTO = await this.postsRepository.findLastThreePostLikes(id);

    /*Если пост был найден, то преобразовываем пост из БД в подготовленный для отправки клиенту пост.*/
    const postOutput: PostOutputDTO = mapFromPostDBTypeToPostOutputDTO(postDB, likeStatus, newestLikes);
    /*Возвращаем ResultObject с преобразованным постом.*/
    return { status: ResultStatuses.Ok, data: { postOutput }, extensions: [] };
  }

  /*Метод для изменения поста по ID.*/
  public async updateById(id: string, dto: UpdatePostByIdInputDTO): Promise<Result<{} | null>> {
    /*Просим репозиторий "postsRepository" изменить данные поста по ID в БД.*/
    const updatedPostCount: number = await this.postsRepository.updateById(id, dto);

    /*Если пост не был изменен, то возвращаем ResultObject с информацией об этом.*/
    if (updatedPostCount < 1) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'id', message: 'Post not found' }],
      };
    }

    /*Если пост был изменен, то возвращаем ResultObject с информацией об этом.*/
    return { status: ResultStatuses.NoContent, data: {}, extensions: [] };
  }

  /*Метод для лайка поста по ID.*/
  public async likePostById(
    id: string,
    userId: string,
    login: string,
    likeStatus: PostLikeStatusInputDTO
  ): Promise<Result<{} | null>> {
    /*Просим репозиторий "postsRepository" найти пост по ID в БД.*/
    const postDB: PostDBType | null = await this.postsRepository.findById(id);

    /*Если пост не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (!postDB) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'id', message: 'Post not found' }],
      };
    }

    /*Если пост был найден, то просим репозиторий "postsRepository" найти данные о лайке для поста по ID поста и ID
    пользователя в БД.*/
    const postLikeDB: PostLikeDataDBType | null = await this.postsRepository.findPostLikeDataByPostIdAndUserId(
      id,
      userId
    );

    /*Если пользователь пытается установить повторный статус лайка, то возвращаем ResultObject с информацией об этом.*/
    if (
      (postLikeDB && (postLikeDB.likeStatus as string) === (likeStatus as string)) ||
      (!postLikeDB && likeStatus === PostLikeStatusInputDTO.None)
    ) {
      return { status: ResultStatuses.NoContent, data: {}, extensions: [] };
    }

    /*Если пользователь хочет убрать лайк/дизлайк.*/
    if (likeStatus === PostLikeStatusInputDTO.None) {
      /*Просим репозиторий "postsRepository" удалить данные о лайке по ID поста и ID пользователя в БД.*/
      await this.postsRepository.deletePostLikeDataByPostIdAndUserId(id, userId);

      /*Просим репозиторий "postsRepository" изменить количество лайков/дизлайков у поста по ID в БД:
      1. Если уже стоял лайк, то уменьшить количество лайков на 1.
      2. Если уже стоял дизлайк, то уменьшить количество дизлайков на 1.*/
      if (postLikeDB?.likeStatus === PostLikeStatus.Like) {
        await this.postsRepository.updatePostLikesById(id, -1, 0);
      } else {
        await this.postsRepository.updatePostLikesById(id, 0, -1);
      }
    }

    /*Если пользователь хочет поставить лайк.*/
    if (likeStatus === PostLikeStatusInputDTO.Like) {
      /*Если еще не был поставлен лайк/дизлайк.*/
      if (!postLikeDB) {
        /*Просим репозиторий "postsRepository" создать данные о лайке поста в БД.*/
        await this.postsRepository.createPostLikeData({
          postId: id,
          userId,
          login,
          likeStatus: likeStatus as unknown as PostLikeStatus,
          addedAt: new Date(),
        });

        /*Просим репозиторий "postsRepository" изменить количество лайков/дизлайков у поста по ID в БД:
        1. Увеличить количество лайков на 1.
        2. Не менять количество дизлайков.*/
        await this.postsRepository.updatePostLikesById(id, 1, 0);
        /*Если уже стоял дизлайк.*/
      } else if (postLikeDB.likeStatus === PostLikeStatus.Dislike) {
        /*Просим репозиторий "postsRepository" изменить данные о лайке поста по ID поста и ID пользователя в БД.*/
        await this.postsRepository.updatePostLikeDataByPostIdAndUserId(
          id,
          userId,
          likeStatus as unknown as PostLikeStatus
        );

        /*Просим репозиторий "postsRepository" изменить количество лайков/дизлайков у поста по ID в БД:
        1. Увеличить количество лайков на 1.
        2. Уменьшить количество дизлайков на 1.*/
        await this.postsRepository.updatePostLikesById(id, 1, -1);
      }
    }

    /*Если пользователь хочет поставить дизлайк.*/
    if (likeStatus === PostLikeStatusInputDTO.Dislike) {
      /*Если еще не был поставлен лайк/дизлайк.*/
      if (!postLikeDB) {
        /*Просим репозиторий "postsRepository" создать данные о лайке поста в БД.*/
        await this.postsRepository.createPostLikeData({
          postId: id,
          userId,
          login,
          likeStatus: likeStatus as unknown as PostLikeStatus,
          addedAt: new Date(),
        });

        /*Просим репозиторий "postsRepository" изменить количество лайков/дизлайков у поста по ID в БД:
        1. Не менять количество лайков.
        2. Увеличить количество дизлайков на 1.*/
        await this.postsRepository.updatePostLikesById(id, 0, 1);
        /*Если уже стоял лайк.*/
      } else if (postLikeDB?.likeStatus === PostLikeStatus.Like) {
        /*Просим репозиторий "postsRepository" изменить данные о лайке поста по ID поста и ID пользователя в БД.*/
        await this.postsRepository.updatePostLikeDataByPostIdAndUserId(
          id,
          userId,
          likeStatus as unknown as PostLikeStatus
        );

        /*Просим репозиторий "postsRepository" изменить количество лайков/дизлайков у поста по ID в БД:
        1. Уменьшить количество лайков на 1.
        2. Увеличить количество дизлайков на 1.*/
        await this.postsRepository.updatePostLikesById(id, -1, 1);
      }
    }

    /*Возвращаем ResultObject с информацией о лайке поста.*/
    return { status: ResultStatuses.NoContent, data: {}, extensions: [] };
  }

  /*Метод для удаления поста по ID.*/
  public async deleteById(id: string): Promise<Result<{} | null>> {
    /*Просим сервис "commentsService" удалить комментарии в посте по ID.*/
    await this.commentsService.deleteAllByPostId(id);
    /*Просим репозиторий "postsRepository" удалить пост по ID в БД.*/
    const deletedPostCount: number = await this.postsRepository.deleteById(id);

    /*Если пост не был удален, то возвращаем ResultObject с информацией об этом.*/
    if (deletedPostCount < 1) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'id', message: 'Post not found' }],
      };
    }

    /*Если пост был удален, то возвращаем ResultObject с информацией об этом.*/
    return { status: ResultStatuses.NoContent, data: {}, extensions: [] };
  }

  /*Метод для удаления постов по ID блога.*/
  public async deleteAllByBlogId(blogId: string): Promise<Result<{ deletedPostsCount: number } | null>> {
    /*Просим репозиторий "postsRepository" найти посты в блоге по ID в БД.*/
    const postsDB: PostListDBType | null = await this.postsRepository.findAllByBlogId(blogId);

    /*Если посты в блоге были найдены, то удаляем комментарии внутри постов.*/
    if (postsDB) {
      /*Получаем массив ID постов внутри блога.*/
      const postIds: string[] = postsDB.map(post => post._id.toString());
      /*Просим сервис "commentsService" удалить комментарии по ID постов.*/
      await this.commentsService.deleteAllByPostIds(postIds);
    }

    /*Просим репозиторий "postsRepository" удалить посты по ID блога в БД.*/
    const deletedPostsCount: number = await this.postsRepository.deleteAllByBlogId(blogId);
    /*Возвращаем ResultObject с информацией об удалении постов.*/
    return { status: ResultStatuses.NoContent, data: { deletedPostsCount }, extensions: [] };
  }
}
