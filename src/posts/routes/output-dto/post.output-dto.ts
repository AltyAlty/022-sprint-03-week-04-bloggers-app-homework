import { PostType } from '../../application/types/post.type';

/*Тип для поля "myStatus" в типе "PostOutputDTO".*/
export enum PostLikeStatusOutputDTO {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export type NewestPostLikeOutputDTO = {
  addedAt: Date;
  userId: string;
  login: string;
};

/*Тип для поля "newestLikes" в типе "PostOutputDTO".*/
export type NewestPostLikeListOutputDTO = NewestPostLikeOutputDTO[];

/*Output DTO для поста.*/
export type PostOutputDTO = PostType & {
  id: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: PostLikeStatusOutputDTO;
    newestLikes: NewestPostLikeListOutputDTO;
  };
};
