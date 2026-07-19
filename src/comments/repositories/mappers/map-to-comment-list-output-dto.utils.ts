import { CommentListDBType } from '../types/comment-list-db.type';
import { CommentsQueryRepository } from '../comments.query-repository';
import { CommentListOutputDTO } from '../../routes/output-dto/comment-list.output-dto';
import { commentLikeStatusOutputDTO, CommentOutputDTO } from '../../routes/output-dto/comment.output-dto';
import { CommentLikeDataDBType } from '../types/comment-like-data-db.type';
import { mapToCommentOutputDTO } from './map-to-comment-output-dto.util';
import { CommentDBType } from '../types/comment-db.type';

/*Функция для преобразования комментариев из БД в подготовленные для отправки клиенту без пагинации комментарии.*/
export const mapToCommentListOutputDTO = async (
  comments: CommentListDBType,
  commentsQueryRepository: CommentsQueryRepository,
  userId: string | undefined
): Promise<CommentListOutputDTO> => {
  if (comments.length === 0) return [];
  const commentIds: string[] = comments.map((comment: CommentDBType): string => comment._id.toString());
  /*Создаем Map: commentId: likeStatus.*/
  let commentLikesDataMap: Map<string, commentLikeStatusOutputDTO> = new Map<string, commentLikeStatusOutputDTO>();

  if (userId) {
    const commentLikesDataDB: CommentLikeDataDBType[] =
      await commentsQueryRepository.findAllCommentLikesDataByCommentIdsAndUserId(commentIds, userId);

    commentLikesDataMap = new Map(
      commentLikesDataDB.map((commentLikeDataDB: CommentLikeDataDBType): [string, commentLikeStatusOutputDTO] => [
        commentLikeDataDB.commentId,
        commentLikeDataDB.likeStatus as unknown as commentLikeStatusOutputDTO,
      ])
    );
  }

  return comments.map((comment: CommentDBType): CommentOutputDTO => {
    const likeStatus: commentLikeStatusOutputDTO =
      commentLikesDataMap.get(comment._id.toString()) ?? commentLikeStatusOutputDTO.None;

    return mapToCommentOutputDTO(comment, likeStatus);
  });
};
