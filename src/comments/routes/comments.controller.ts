import { Request, Response } from 'express';
import { CommentsService } from '../application/comments.service';
import { CommentsQueryService } from '../application/comments.query-service';
import { UpdateCommentByIdUriInputDTO } from './input-dto/uri/update-comment-by-id-uri.input-dto';
import { UpdateCommentByIdInputDTO } from './input-dto/update-comment-by-id.input-dto';
import { ExtensionType, Result } from '../../core/types/result/result.type';
import { HttpStatuses } from '../../core/types/http-statuses';
import { mapResultCodeToHttpStatus } from '../../core/utils/result/mappers/map-result-code-to-http-status';
import { errorsHandler } from '../../core/errors/errors.handler';
import { DeleteCommentByIdUriInputDTO } from './input-dto/uri/delete-comment-by-id-uri.input-dto';
import { GetCommentByIdUriInputDTO } from './input-dto/uri/get-comment-by-id-uri.input-dto';
import { CommentOutputDTO } from './output-dto/comment.output-dto';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../ioc/types';
import { LikeCommentByIdUriInputDTO } from './input-dto/uri/like-comment-by-id-uri.input-dto';
import { LikeCommentByIdInputDTO, CommentLikeStatusInputDTO } from './input-dto/like-comment-by-id.input-dto';

/*Контроллер для работы с комментариями.*/
@injectable()
export class CommentsController {
  constructor(
    @inject(TYPES.CommentsService) private readonly commentsService: CommentsService,
    @inject(TYPES.CommentsQueryService) private readonly commentsQueryService: CommentsQueryService
  ) {}

  /*Метод-обработчик для PUT-запросов по изменению комментария по ID, используя URI-параметры.*/
  public async updateCommentByIdHandler(
    req: Request<UpdateCommentByIdUriInputDTO, {}, UpdateCommentByIdInputDTO>,
    res: Response<void | ExtensionType[]>
  ): Promise<void | Response<void | ExtensionType[]>> {
    try {
      /*Получаем ID комментария.*/
      const commentId: string = req.params.id;
      /*Получаем ID пользователя.*/
      const userId: string = req.userId!.id;

      /*Просим сервис "commentsService" изменить комментарий по ID.*/
      const updatedCommentResult: Result<{} | null> = await this.commentsService.updateById(
        commentId,
        req.body,
        userId
      );

      /*Получаем HTTP-статус операции по изменению комментария по ID.*/
      const updatedCommentResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(updatedCommentResult.status);

      /*Если комментарий не был изменен, то сообщаем об этом клиенту.*/
      if (updatedCommentResultHttpStatus !== HttpStatuses.NoContent_204) {
        return res.status(updatedCommentResultHttpStatus).send(updatedCommentResult.extensions);
      }

      /*Если комментарий был изменен, то сообщаем об этом клиенту.*/
      return res.sendStatus(updatedCommentResultHttpStatus);
    } catch (error: unknown) {
      /*Если была перехвачена ошибка, то обрабатываем ее.*/
      return errorsHandler(error, res);
    }
  }

  /*Метод-обработчик для DELETE-запросов по удалению комментария по ID, используя URI-параметры.*/
  public async deleteCommentByIdHandler(
    req: Request<DeleteCommentByIdUriInputDTO>,
    res: Response<void | ExtensionType[]>
  ): Promise<void | Response<void | ExtensionType[]>> {
    try {
      /*Получаем ID комментария.*/
      const commentId: string = req.params.id;
      /*Получаем ID пользователя.*/
      const userId: string = req.userId!.id;
      /*Просим сервис "commentsService" удалить комментарий по ID.*/
      const deletedCommentResult: Result<{} | null> = await this.commentsService.deleteById(commentId, userId);
      /*Получаем HTTP-статус операции по удалению комментария по ID.*/
      const deletedCommentResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(deletedCommentResult.status);

      /*Если комментарий не был удален, то сообщаем об этом клиенту.*/
      if (deletedCommentResultHttpStatus !== HttpStatuses.NoContent_204) {
        return res.status(deletedCommentResultHttpStatus).send(deletedCommentResult.extensions);
      }

      /*Если комментарий был удален, то сообщаем об этом клиенту.*/
      return res.sendStatus(deletedCommentResultHttpStatus);
    } catch (error: unknown) {
      /*Если была перехвачена ошибка, то обрабатываем ее.*/
      return errorsHandler(error, res);
    }
  }

  /*Метод-обработчик для GET-запросов по получению комментария по ID, используя URI-параметры.*/
  public async getCommentByIdHandler(
    req: Request<GetCommentByIdUriInputDTO>,
    res: Response<CommentOutputDTO | ExtensionType[]>
  ): Promise<void | Response<CommentOutputDTO | ExtensionType[]>> {
    try {
      /*Получаем ID комментария.*/
      const commentId: string = req.params.id;
      /*Получаем ID пользователя.*/
      const userId: string | undefined = req.userId?.id;

      /*Просим query-сервис "commentsQueryService" найти комментарий по ID.*/
      const commentResult: Result<{ commentOutput: CommentOutputDTO } | null> =
        await this.commentsQueryService.findById(commentId, userId);

      /*Получаем HTTP-статус операции по поиску комментария по ID.*/
      const commentResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(commentResult.status);

      /*Если комментарий не был найден, то сообщаем об этом клиенту.*/
      if (commentResultHttpStatus !== HttpStatuses.Ok_200) {
        return res.status(commentResultHttpStatus).send(commentResult.extensions);
      }

      /*Если комментарий был найден, то отправляем его клиенту.*/
      return res.status(commentResultHttpStatus).send(commentResult.data!.commentOutput);
    } catch (error: unknown) {
      /*Если была перехвачена ошибка, то обрабатываем ее.*/
      return errorsHandler(error, res);
    }
  }

  /*Метод-обработчик для PUT-запросов по лайку комментария по ID, используя URI-параметры.*/
  public async likeCommentByIdHandler(
    req: Request<LikeCommentByIdUriInputDTO, {}, LikeCommentByIdInputDTO>,
    res: Response<void | ExtensionType[]>
  ): Promise<void | Response<void | ExtensionType[]>> {
    try {
      /*Получаем ID комментария.*/
      const commentId: string = req.params.id;
      /*Получаем ID пользователя.*/
      const userId: string = req.userId!.id;
      /*Получаем статус лайка комментария.*/
      const likeStatus: CommentLikeStatusInputDTO = req.body.likeStatus!;

      /*Просим сервис "commentsService" добавить лайк комментарию по ID.*/
      const likedCommentResult: Result<{} | null> = await this.commentsService.likeCommentById(
        commentId,
        userId,
        likeStatus
      );

      /*Получаем HTTP-статус операции по добавлению лайка комментарию по ID.*/
      const likedCommentResultHttpStatus: HttpStatuses = mapResultCodeToHttpStatus(likedCommentResult.status);

      /*Если лайк комментарию не был добавлен, то сообщаем об этом клиенту.*/
      if (likedCommentResultHttpStatus !== HttpStatuses.NoContent_204) {
        return res.status(likedCommentResultHttpStatus).send(likedCommentResult.extensions);
      }

      /*Если лайк комментарию был добавлен, то сообщаем об этом клиенту.*/
      return res.sendStatus(likedCommentResultHttpStatus);
    } catch (error: unknown) {
      /*Если была перехвачена ошибка, то обрабатываем ее.*/
      return errorsHandler(error, res);
    }
  }
}
