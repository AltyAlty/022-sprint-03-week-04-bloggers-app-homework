import { PostsService } from '../../posts/application/posts.service';
import { UsersService } from '../../users/application/users.service';
import { CommentsRepository } from '../repositories/comments.repository';
import { UpdateCommentByIdInputDTO } from '../routes/input-dto/update-comment-by-id.input-dto';
import { Result } from '../../core/types/result/result.type';
import { ResultStatuses } from '../../core/types/result/result-statuses';
import { CreateCommentForPostInputDTO } from '../routes/input-dto/create-comment-for-post.input-dto';
import { CommentType } from './types/comment.type';
import { UserOutputDTO } from '../../users/routes/output-dto/user.output-dto';
import { PostOutputDTO } from '../../posts/routes/output-dto/post.output-dto';
import { CommentDBType } from '../repositories/types/comment-db.type';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../ioc/types';
import { lazyInject } from '../../ioc/decorators';
import { CommentLikeStatusInputDTO } from '../routes/input-dto/like-comment-by-id.input-dto';
import { CommentLikeDataDBType } from '../repositories/types/comment-like-data-db.type';
import { CommentLikeStatus } from './types/comment-like-data.type';

/*Сервис для работы с комментариями.*/
@injectable()
export class CommentsService {
  @lazyInject(TYPES.UsersService) private readonly usersService!: UsersService;
  @lazyInject(TYPES.PostsService) private readonly postsService!: PostsService;
  constructor(@inject(TYPES.CommentsRepository) private readonly commentsRepository: CommentsRepository) {}

  /*Метод для добавления комментария в пост.*/
  public async createForPost(
    postId: string,
    userId: string,
    dto: CreateCommentForPostInputDTO
  ): Promise<Result<{ createdCommentId: string } | null>> {
    /*Просим сервис "usersService" найти пользователя по ID.*/
    const userResult: Result<{ userOutput: UserOutputDTO } | null> = await this.usersService.findById(userId);
    /*Если пользователь не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (userResult.status !== ResultStatuses.Ok) return userResult as Result;
    /*Если пользователь был найден, то просим сервис "postsService" найти пост по ID.*/
    const postResult: Result<{ postOutput: PostOutputDTO } | null> = await this.postsService.findById(postId);
    /*Если пост не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (postResult.status !== ResultStatuses.Ok) return postResult as Result;

    /*Если пользователь и пост были найдены, то создаем объект с данными нового комментария.*/
    const newComment: CommentType = {
      content: dto.content,
      postId: postId,
      commentatorInfo: { userId, userLogin: userResult.data!.userOutput.login },
      createdAt: new Date(),
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
      },
    };

    /*Просим репозиторий "commentsRepository" создать комментарий в БД.*/
    const createdCommentId: string = await this.commentsRepository.create(newComment);
    /*Возвращаем ResultObject с ID созданного комментария.*/
    return { status: ResultStatuses.Created, data: { createdCommentId }, extensions: [] };
  }

  /*Метод для изменения комментария по ID.*/
  public async updateById(id: string, dto: UpdateCommentByIdInputDTO, userId?: string): Promise<Result<{} | null>> {
    /*Просим репозиторий "commentsRepository" найти комментарий по ID в БД.*/
    const commentDB: CommentDBType | null = await this.commentsRepository.findById(id);

    /*Если комментарий не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (!commentDB) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'id', message: 'Comment not found' }],
      };
    }

    /*Если комментарий был найден, но пользователь не является его автором, то возвращаем ResultObject с информацией об
    этом.*/
    if (userId && commentDB.commentatorInfo.userId !== userId) {
      return {
        status: ResultStatuses.Forbidden,
        data: null,
        errorMessage: 'Forbidden',
        extensions: [{ field: 'user', message: 'Forbidden' }],
      };
    }

    /*Если пользователь является автором комментария, то просим репозиторий "commentsRepository" изменить комментарий по
    ID в БД.*/
    await this.commentsRepository.updateById(id, dto);

    /*Возвращаем ResultObject с информацией об изменении комментария.*/
    return { status: ResultStatuses.NoContent, data: {}, extensions: [] };
  }

  /*Метод для лайка комментария по ID.*/
  public async likeCommentById(
    id: string,
    userId: string,
    likeStatus: CommentLikeStatusInputDTO
  ): Promise<Result<{} | null>> {
    /*Просим репозиторий "commentsRepository" найти комментарий по ID в БД.*/
    const commentDB: CommentDBType | null = await this.commentsRepository.findById(id);

    /*Если комментарий не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (!commentDB) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'id', message: 'Comment not found' }],
      };
    }

    /*Если комментарий был найден, то просим репозиторий "commentsRepository" найти данные о лайке для комментария по ID
    комментария и ID пользователя в БД.*/
    const commentLikeDB: CommentLikeDataDBType | null =
      await this.commentsRepository.findCommentLikeDataByCommentIdAndUserId(id, userId);

    /*Если пользователь пытается установить повторный статус лайка, то возвращаем ResultObject с информацией об этом.*/
    if (
      (commentLikeDB && (commentLikeDB.likeStatus as string) === (likeStatus as string)) ||
      (!commentLikeDB && likeStatus === CommentLikeStatusInputDTO.None)
    ) {
      return { status: ResultStatuses.NoContent, data: {}, extensions: [] };
    }

    /*Если пользователь хочет убрать лайк/дизлайк.*/
    if (likeStatus === CommentLikeStatusInputDTO.None) {
      /*Просим репозиторий "commentsRepository" удалить данные о лайке по ID комментария и ID пользователя в БД.*/
      await this.commentsRepository.deleteCommentLikeDataByCommentIdAndUserId(id, userId);

      /*Просим репозиторий "commentsRepository" изменить количество лайков/дизлайков у комментария по ID в БД:
      1. Если уже стоял лайк, то уменьшить количество лайков на 1.
      2. Если уже стоял дизлайк, то уменьшить количество дизлайков на 1.*/
      if (commentLikeDB?.likeStatus === CommentLikeStatus.Like) {
        await this.commentsRepository.updateCommentLikesById(id, -1, 0);
      } else {
        await this.commentsRepository.updateCommentLikesById(id, 0, -1);
      }
    }

    /*Если пользователь хочет поставить лайк.*/
    if (likeStatus === CommentLikeStatusInputDTO.Like) {
      /*Если еще не был поставлен лайк/дизлайк.*/
      if (!commentLikeDB) {
        /*Просим репозиторий "commentsRepository" создать данные о лайке комментария в БД.*/
        await this.commentsRepository.createCommentLikeData({
          commentId: id,
          userId,
          likeStatus: likeStatus as unknown as CommentLikeStatus,
        });

        /*Просим репозиторий "commentsRepository" изменить количество лайков/дизлайков у комментария по ID в БД:
        1. Увеличить количество лайков на 1.
        2. Не менять количество дизлайков.*/
        await this.commentsRepository.updateCommentLikesById(id, 1, 0);
        /*Если уже стоял дизлайк.*/
      } else if (commentLikeDB.likeStatus === CommentLikeStatus.Dislike) {
        /*Просим репозиторий "commentsRepository" изменить данные о лайке комментария по ID комментария и ID
        пользователя в БД.*/
        await this.commentsRepository.updateCommentLikeDataByCommentIdAndUserId(
          id,
          userId,
          likeStatus as unknown as CommentLikeStatus
        );

        /*Просим репозиторий "commentsRepository" изменить количество лайков/дизлайков у комментария по ID в БД:
        1. Увеличить количество лайков на 1.
        2. Уменьшить количество дизлайков на 1.*/
        await this.commentsRepository.updateCommentLikesById(id, 1, -1);
      }
    }

    /*Если пользователь хочет поставить дизлайк.*/
    if (likeStatus === CommentLikeStatusInputDTO.Dislike) {
      /*Если еще не был поставлен лайк/дизлайк.*/
      if (!commentLikeDB) {
        /*Просим репозиторий "commentsRepository" создать данные о лайке комментария в БД.*/
        await this.commentsRepository.createCommentLikeData({
          commentId: id,
          userId,
          likeStatus: likeStatus as unknown as CommentLikeStatus,
        });

        /*Просим репозиторий "commentsRepository" изменить количество лайков/дизлайков у комментария по ID в БД:
        1. Не менять количество лайков.
        2. Увеличить количество дизлайков на 1.*/
        await this.commentsRepository.updateCommentLikesById(id, 0, 1);
        /*Если уже стоял лайк.*/
      } else if (commentLikeDB?.likeStatus === CommentLikeStatus.Like) {
        /*Просим репозиторий "commentsRepository" изменить данные о лайке комментария по ID комментария и ID
        пользователя в БД.*/
        await this.commentsRepository.updateCommentLikeDataByCommentIdAndUserId(
          id,
          userId,
          likeStatus as unknown as CommentLikeStatus
        );

        /*Просим репозиторий "commentsRepository" изменить количество лайков/дизлайков у комментария по ID в БД:
        1. Уменьшить количество лайков на 1.
        2. Увеличить количество дизлайков на 1.*/
        await this.commentsRepository.updateCommentLikesById(id, -1, 1);
      }
    }

    /*Возвращаем ResultObject с информацией о лайке комментария.*/
    return { status: ResultStatuses.NoContent, data: {}, extensions: [] };
  }

  /*Метод для удаления комментария по ID.*/
  public async deleteById(id: string, userId?: string): Promise<Result<{} | null>> {
    /*Просим репозиторий "commentsRepository" найти комментарий по ID в БД.*/
    const commentDB: CommentDBType | null = await this.commentsRepository.findById(id);

    /*Если комментарий не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (!commentDB) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'id', message: 'Comment not found' }],
      };
    }

    /*Если комментарий был найден, но пользователь не является его автором, то возвращаем ResultObject с информацией об
    этом.*/
    if (userId && commentDB.commentatorInfo.userId !== userId) {
      return {
        status: ResultStatuses.Forbidden,
        data: null,
        errorMessage: 'Forbidden',
        extensions: [{ field: 'user', message: 'Forbidden' }],
      };
    }

    /*Если пользователь является автором комментария, то просим репозиторий "commentsRepository" удалить комментарий по
    ID в БД.*/
    await this.commentsRepository.deleteById(id);
    /*Просим репозиторий "commentsRepository" удалить данные о лайках комментария по ID комментария в БД.*/
    await this.commentsRepository.deleteAllCommentLikesDataByCommentId(id);
    /*Возвращаем ResultObject с информацией об удалении комментария.*/
    return { status: ResultStatuses.NoContent, data: {}, extensions: [] };
  }

  /*Метод для удаления комментариев по ID поста.*/
  public async deleteAllByPostId(postId: string): Promise<Result<{ deletedCommentsCount: number } | null>> {
    /*Просим репозиторий "commentsRepository" найти комментарии по ID поста в БД.*/
    const commentsDB: CommentDBType[] = await this.commentsRepository.findAllByPostId(postId);
    /*Получаем массив ID комментариев внутри поста.*/
    const commentIds = commentsDB.map((comment: CommentDBType) => comment._id.toString());
    /*Просим репозиторий "commentsRepository" удалить данные о лайках комментариев по ID комментариев в БД.*/
    await this.commentsRepository.deleteAllCommentLikesDataByCommentIds(commentIds);
    /*Если пост был найден, то просим репозиторий "commentsRepository" удалить комментарии по ID поста в БД.*/
    const deletedCommentsCount: number = await this.commentsRepository.deleteAllByPostId(postId);
    /*Возвращаем ResultObject с информацией об удалении комментариев.*/
    return { status: ResultStatuses.NoContent, data: { deletedCommentsCount }, extensions: [] };
  }

  /*Метод для удаления комментариев по ID пользователя.*/
  public async deleteAllByUserId(userId: string): Promise<Result<{ deletedCommentsCount: number }>> {
    /*Просим репозиторий "commentsRepository" удалить данные о лайках комментариев по ID пользователя в БД.*/
    await this.commentsRepository.deleteAllCommentLikesDataByUserId(userId);
    /*Просим репозиторий "commentsRepository" удалить комментарии по ID пользователя в БД.*/
    const deletedCommentsCount: number = await this.commentsRepository.deleteAllByUserId(userId);
    /*Возвращаем ResultObject с информацией об удалении комментариев.*/
    return { status: ResultStatuses.NoContent, data: { deletedCommentsCount }, extensions: [] };
  }

  /*Метод для удаления комментариев по ID постов.*/
  public async deleteAllByPostIds(postIds: string[]): Promise<Result<{ deletedCommentsCount: number } | null>> {
    /*Просим репозиторий "commentsRepository" найти комментарии по ID постов в БД.*/
    const commentsDB: CommentDBType[] = await this.commentsRepository.findAllByPostIds(postIds);
    /*Получаем массив ID комментариев внутри постов.*/
    const commentIds = commentsDB.map((comment: CommentDBType) => comment._id.toString());
    /*Просим репозиторий "commentsRepository" удалить данные о лайках комментариев по ID комментариев в БД.*/
    await this.commentsRepository.deleteAllCommentLikesDataByCommentIds(commentIds);
    /*Просим репозиторий "commentsRepository" удалить комментарии по ID постов в БД.*/
    const deletedCommentsCount: number = await this.commentsRepository.deleteAllByPostIds(postIds);
    /*Возвращаем ResultObject с информацией об удалении комментариев.*/
    return { status: ResultStatuses.NoContent, data: { deletedCommentsCount }, extensions: [] };
  }
}
