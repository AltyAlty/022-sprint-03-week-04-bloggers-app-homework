import { CommentType } from '../../application/types/comment.type';

/*Тип для поля "likeStatus" в типе "CommentOutputDTO".*/
export enum commentLikeStatusOutputDTO {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

/*Output DTO для комментария.*/
export type CommentOutputDTO = Omit<CommentType, 'postId'> & {
  id: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: commentLikeStatusOutputDTO;
  };
};
