import { PostType } from '../../application/types/post.type';

/*Тип для поля "myStatus" в типе "PostOutputDTO".*/
export enum PostLikeStatusOutputDTO {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

/*Тип для поля "newestLikes" в типе "PostOutputDTO".*/
export type NewestPostLike = {
  addedAt: Date;
  userId: string;
  login: string;
};

/*Output DTO для поста.*/
export type PostOutputDTO = PostType & {
  id: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: PostLikeStatusOutputDTO;
    newestLikes: NewestPostLike[];
  };
};
