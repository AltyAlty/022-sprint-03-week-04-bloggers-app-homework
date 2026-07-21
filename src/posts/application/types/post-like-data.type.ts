/*Тип для поля "likeStatus" в типе "PostLikeDataType".*/
export enum PostLikeStatus {
  Like = 'Like',
  Dislike = 'Dislike',
}

/*Тип для данных о лайке поста.*/
export type PostLikeDataType = {
  postId: string;
  userId: string;
  login: string;
  likeStatus: PostLikeStatus;
  addedAt: Date;
};
