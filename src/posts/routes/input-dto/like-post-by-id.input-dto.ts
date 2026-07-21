/*Тип для поля "likeStatus" в типе "LikePostByIdInputDTO".*/
export enum PostLikeStatusInputDTO {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

/*Input DTO для лайка поста.*/
export type LikePostByIdInputDTO = { likeStatus: PostLikeStatusInputDTO };
