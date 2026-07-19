/*Тип для поля "likeStatus" в типе "LikeCommentByIdInputDTO".*/
export enum CommentLikeStatusInputDTO {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

/*Input DTO для лайка комментария.*/
export type LikeCommentByIdInputDTO = { likeStatus: CommentLikeStatusInputDTO };
