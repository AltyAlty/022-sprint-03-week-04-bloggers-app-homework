import { CommentType } from '../../application/types/comment.type';

/*Тип для поля "myStatus" в типе "CommentOutputDTO".*/
export enum CommentLikeStatusOutputDTO {
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
    myStatus: CommentLikeStatusOutputDTO;
  };
};
