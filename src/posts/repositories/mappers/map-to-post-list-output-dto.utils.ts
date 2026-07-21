import { PostListDBType } from '../types/post-list-db.type';
import { PostsQueryRepository } from '../posts.query-repository';
import { PostListOutputDTO } from '../../routes/output-dto/post-list.output-dto';
import { PostDBType } from '../types/post-db.type';
import { PostLikeStatusOutputDTO, PostOutputDTO } from '../../routes/output-dto/post.output-dto';
import { PostLikeDataDBType } from '../types/post-like-data-db.type';
import { mapToPostOutputDTO } from './map-to-post-output-dto.util';

/*Функция для преобразования постов из БД в подготовленные для отправки клиенту без пагинации посты.*/
export const mapToPostListOutputDTO = async (
  posts: PostListDBType,
  postsQueryRepository: PostsQueryRepository,
  userId: string | undefined
): Promise<PostListOutputDTO> => {
  if (posts.length === 0) return [];
  const postIds: string[] = posts.map((post: PostDBType): string => post._id.toString());
  /*Создаем Map: postId: likeStatus.*/
  let postLikesDataMap: Map<string, PostLikeStatusOutputDTO> = new Map<string, PostLikeStatusOutputDTO>();

  if (userId) {
    const postLikesDataDB: PostLikeDataDBType[] = await postsQueryRepository.findAllPostLikesDataByPostIdsAndUserId(
      postIds,
      userId
    );

    postLikesDataMap = new Map(
      postLikesDataDB.map((postLikeDataDB: PostLikeDataDBType): [string, PostLikeStatusOutputDTO] => [
        postLikeDataDB.postId,
        postLikeDataDB.likeStatus as unknown as PostLikeStatusOutputDTO,
      ])
    );
  }

  /*Создаем Map: postId: PostLikeDataDBType[].*/
  const newestLikesMap: Map<string, PostLikeDataDBType[]> =
    await postsQueryRepository.findLastThreeLikesForPostsByPostIds(postIds);

  return posts.map((post: PostDBType): PostOutputDTO => {
    const postId: string = post._id.toString();
    const likeStatus: PostLikeStatusOutputDTO = postLikesDataMap.get(postId) ?? PostLikeStatusOutputDTO.None;
    const newestLikes: PostLikeDataDBType[] = newestLikesMap.get(postId) ?? [];
    return mapToPostOutputDTO(post, likeStatus, newestLikes);
  });
};
