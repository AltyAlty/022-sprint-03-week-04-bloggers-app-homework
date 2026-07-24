import { PostsQueryRepository } from '../posts.query-repository';
import { PostDBType } from '../types/post-db.type';
import { PostLikeDataDBType } from '../types/post-like-data-db.type';
import { PostListDBType } from '../types/post-list-db.type';
import { PostLikeStatusOutputDTO, PostOutputDTO } from '../../routes/output-dto/post.output-dto';
import { PostListOutputDTO } from '../../routes/output-dto/post-list.output-dto';
import { mapFromPostDBTypeToPostOutputDTO } from './map-from-post-db-type-to-post-output-dto.util';

/*Функция для преобразования постов из БД в подготовленные для отправки клиенту без пагинации посты.*/
export const mapFromPostListDBTypeToPostListOutputDTO = async (
  posts: PostListDBType,
  postsQueryRepository: PostsQueryRepository,
  userId: string | undefined
): Promise<PostListOutputDTO> => {
  /*Если в виде постов был передан пустой массив, то возвращаем пустой массив.*/
  if (posts.length === 0) return [];
  /*Получаем ID постов.*/
  const postIds: string[] = posts.map((post: PostDBType): string => post._id.toString());
  /*Создаем Map формата "postId: likeStatus", чтобы избежать многочисленных запросов в БД для получения статусов лайков
  пользователя каждого поста.*/
  let postLikesDataMap: Map<string, PostLikeStatusOutputDTO> = new Map<string, PostLikeStatusOutputDTO>();

  /*Если был передан ID пользователя, то получаем статусы лайков пользователя каждого поста.*/
  if (userId) {
    /*Просим query-репозиторий "postsQueryRepository" найти данные о лайках постов по ID постов и ID пользователя в
    БД.*/
    const postLikesDataDB: PostLikeDataDBType[] = await postsQueryRepository.findAllPostLikesDataByPostIdsAndUserId(
      postIds,
      userId
    );

    /*Заполняем Map статусами лайков пользователя каждого поста, не обращаясь в БД.*/
    postLikesDataMap = new Map(
      postLikesDataDB.map((postLikeDataDB: PostLikeDataDBType): [string, PostLikeStatusOutputDTO] => [
        postLikeDataDB.postId,
        postLikeDataDB.likeStatus as unknown as PostLikeStatusOutputDTO,
      ])
    );
  }

  /*Создаем Map формата "postId: PostLikeDataDBType[]", чтобы избежать многочисленных запросов в БД для получения
  данных о трех последних лайках каждого поста.*/
  const newestLikesMap: Map<string, PostLikeDataDBType[]> =
    /*Просим query-репозиторий "postsQueryRepository" найти данные о трех последних лайках постов по ID постов в БД.*/
    await postsQueryRepository.findLastThreeLikesForPostsByPostIds(postIds);

  /*Формируем массив подготовленных для отправки клиенту без пагинации постов.*/
  return posts.map((post: PostDBType): PostOutputDTO => {
    /*Получаем ID поста.*/
    const postId: string = post._id.toString();
    /*Получаем статус лайка поста.*/
    const likeStatus: PostLikeStatusOutputDTO = postLikesDataMap.get(postId) ?? PostLikeStatusOutputDTO.None;
    /*Получаем данные о трех последних лайках поста.*/
    const newestLikes: PostLikeDataDBType[] = newestLikesMap.get(postId) ?? [];
    /*Преобразовываем пост из БД в подготовленный для отправки клиенту пост.*/
    return mapFromPostDBTypeToPostOutputDTO(post, likeStatus, newestLikes);
  });
};
