import { CommentListDBType } from '../types/comment-list-db.type';
import { CommentsQueryRepository } from '../comments.query-repository';
import { CommentListOutputDTO } from '../../routes/output-dto/comment-list.output-dto';
import { CommentLikeStatusOutputDTO, CommentOutputDTO } from '../../routes/output-dto/comment.output-dto';
import { CommentLikeDataDBType } from '../types/comment-like-data-db.type';
import { mapFromCommentDBTypeToCommentOutputDTO } from './map-from-comment-db-type-to-comment-output-dto.util';
import { CommentDBType } from '../types/comment-db.type';

/*Функция для преобразования комментариев из БД в подготовленные для отправки клиенту без пагинации комментарии.*/
export const mapFromCommentListDBTypeToCommentListOutputDTO = async (
  comments: CommentListDBType,
  commentsQueryRepository: CommentsQueryRepository,
  userId: string | undefined
): Promise<CommentListOutputDTO> => {
  /*Если в виде комментариев был передан пустой массив, то возвращаем пустой массив.*/
  if (comments.length === 0) return [];
  /*Получаем ID комментариев.*/
  const commentIds: string[] = comments.map((comment: CommentDBType): string => comment._id.toString());
  /*Создаем Map формата "commentId: likeStatus", чтобы избежать многочисленных запросов в БД для получения статусов
  лайков пользователя каждого комментария.*/
  let commentLikesDataMap: Map<string, CommentLikeStatusOutputDTO> = new Map<string, CommentLikeStatusOutputDTO>();

  /*Если был передан ID пользователя, то получаем статусы лайков пользователя каждого комментария.*/
  if (userId) {
    /*Просим query-репозиторий "commentsQueryRepository" найти данные о лайках комментариев по ID комментариев и ID
    пользователя в БД.*/
    const commentLikesDataDB: CommentLikeDataDBType[] =
      await commentsQueryRepository.findAllCommentLikesDataByCommentIdsAndUserId(commentIds, userId);

    /*Заполняем Map статусами лайков пользователя каждого комментария, не обращаясь в БД.*/
    commentLikesDataMap = new Map(
      commentLikesDataDB.map((commentLikeDataDB: CommentLikeDataDBType): [string, CommentLikeStatusOutputDTO] => [
        commentLikeDataDB.commentId,
        commentLikeDataDB.likeStatus as unknown as CommentLikeStatusOutputDTO,
      ])
    );
  }

  /*Формируем массив подготовленных для отправки клиенту без пагинации комментариев.*/
  return comments.map((comment: CommentDBType): CommentOutputDTO => {
    /*Получаем статус лайка комментария.*/
    const likeStatus: CommentLikeStatusOutputDTO =
      commentLikesDataMap.get(comment._id.toString()) ?? CommentLikeStatusOutputDTO.None;

    /*Преобразовываем комментарий из БД в подготовленный для отправки клиенту комментарий.*/
    return mapFromCommentDBTypeToCommentOutputDTO(comment, likeStatus);
  });
};
