/*Тип для поля "likeStatus" в типе "CommentLikeDataType".*/
export enum CommentLikeStatus {
  Like = 'Like',
  Dislike = 'Dislike',
}

/*Тип для данных о лайке комментария.*/
export type CommentLikeDataType = {
  commentId: string;
  userId: string;
  likeStatus: CommentLikeStatus;
};
