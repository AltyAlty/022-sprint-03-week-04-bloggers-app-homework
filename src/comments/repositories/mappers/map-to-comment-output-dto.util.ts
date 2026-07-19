import { CommentOutputDTO, commentLikeStatusOutputDTO } from '../../routes/output-dto/comment.output-dto';
import { CommentDBType } from '../types/comment-db.type';

/*Функция для преобразования комментария из БД в подготовленный для отправки клиенту комментарий.*/
export const mapToCommentOutputDTO = (
  comment: CommentDBType,
  likeStatus: commentLikeStatusOutputDTO
): CommentOutputDTO => {
  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: { userId: comment.commentatorInfo.userId, userLogin: comment.commentatorInfo.userLogin },
    createdAt: comment.createdAt,
    likesInfo: {
      likesCount: comment.likesInfo.likesCount,
      dislikesCount: comment.likesInfo.dislikesCount,
      myStatus: likeStatus,
    },
  };
};
