import { PostLikeStatusOutputDTO, PostOutputDTO } from '../../routes/output-dto/post.output-dto';
import { PostDBType } from '../types/post-db.type';
import { PostLikeDataDBType } from '../types/post-like-data-db.type';

/*Функция для преобразования поста из БД в подготовленный для отправки клиенту пост.*/
export const mapToPostOutputDTO = (
  post: PostDBType,
  likeStatus: PostLikeStatusOutputDTO,
  newestLikes: PostLikeDataDBType[]
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
      newestLikes: newestLikes.map((like: PostLikeDataDBType) => ({
        addedAt: like.addedAt,
        userId: like.userId,
        login: like.login,
      })),
    },
  };
};
