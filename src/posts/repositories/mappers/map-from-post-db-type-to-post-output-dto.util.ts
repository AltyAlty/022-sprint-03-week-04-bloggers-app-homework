import { PostDBType } from '../types/post-db.type';
import {
  NewestPostLikeListOutputDTO,
  NewestPostLikeOutputDTO,
  PostLikeStatusOutputDTO,
  PostOutputDTO,
} from '../../routes/output-dto/post.output-dto';

/*Функция для преобразования поста из БД в подготовленный для отправки клиенту пост.*/
export const mapFromPostDBTypeToPostOutputDTO = (
  post: PostDBType,
  likeStatus: PostLikeStatusOutputDTO,
  newestLikes: NewestPostLikeListOutputDTO
): PostOutputDTO => {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
    extendedLikesInfo: {
      likesCount: post.extendedLikesInfo.likesCount,
      dislikesCount: post.extendedLikesInfo.dislikesCount,
      myStatus: likeStatus,
      newestLikes: newestLikes.map((postLikeData: NewestPostLikeOutputDTO) => ({
        addedAt: postLikeData.addedAt,
        userId: postLikeData.userId,
        login: postLikeData.login,
      })),
    },
  };
};
