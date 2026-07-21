import { Filter } from 'mongodb';
import { PostType } from '../application/types/post.type';
import { GetPostListQueryInputDTO } from '../routes/input-dto/query/get-post-list-query.input-dto';
import { SortDirection } from '../../core/types/pagination/sort-direction';
import { PostSortFieldQueryInputDTO } from '../routes/input-dto/query/post-sort-field-query.input-dto';
import { PostDBType } from './types/post-db.type';
import { injectable } from 'inversify';
import { PostListDBType } from './types/post-list-db.type';
import { PostModel } from './models/post.model';
import { PostLikeDataDBType } from './types/post-like-data-db.type';
import { PostLikeDataModel } from './models/post-like-data.model';
import { PostLikeStatus } from '../application/types/post-like-data.type';

/*Query-репозиторий для работы с постами в БД.*/
@injectable()
export class PostsQueryRepository {
  /*Метод для поиска поста по ID в БД.*/
  public async findById(id: string): Promise<PostDBType | null> {
    /*Просим модель "PostModel" найти пост по ID в БД.*/
    const post: PostDBType | null = await PostModel.findById(id).lean();
    /*Если пост был найден, то возвращаем его, иначе возвращаем null.*/
    return post ?? null;
  }

  /*Метод для поиска постов в БД.*/
  public async findAll(
    queryDTO: GetPostListQueryInputDTO,
    blogId?: string
  ): Promise<{ items: PostListDBType; totalCount: number }> {
    /*Создаем переменные на основе параметра "queryDTO" при помощи деструктуризации.*/
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    }: {
      pageNumber: number;
      pageSize: number;
      sortBy: PostSortFieldQueryInputDTO;
      sortDirection: SortDirection;
    } = queryDTO;

    /*Переменная "skip" обозначает сколько записей надо пропустить перед тем, как начать отдавать запрошенную страницу
    "pageNumber".*/
    const skip: number = (pageNumber - 1) * pageSize;
    /*Динамически собираем фильтр для поиска в MongoDB. Начинаем с пустого фильтра.*/
    const filter: Filter<PostType> = {};
    /*Если был указан ID блога, то добавляем его в фильтр.*/
    if (blogId) filter.blogId = blogId;

    /*Просим модель "PostModel" найти посты в БД и подсчитать общее количество документов, подходящих под фильтр, без
    учета пагинации.*/
    const [items, totalCount]: [PostListDBType, number] = await Promise.all([
      PostModel.find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      PostModel.countDocuments(filter),
    ]);

    /*Возвращаем данные по постам.*/
    return { items, totalCount };
  }

  /*Метод для поиска данных о лайке поста по ID поста и ID пользователя в БД.*/
  public async findPostLikeDataByPostIdAndUserId(postId: string, userId: string): Promise<PostLikeDataDBType | null> {
    /*Просим модель "PostLikeDataModel" найти данные о лайке поста по ID поста и ID пользователя в БД.*/
    const postLikeData: PostLikeDataDBType | null = await PostLikeDataModel.findOne({ postId, userId }).lean();
    /*Если данные о лайке поста были найдены, то возвращаем их, иначе null.*/
    return postLikeData ?? null;
  }

  /*Метод для поиска данных о трех последних лайках поста по ID поста в БД.*/
  public async findLastThreePostLikes(postId: string): Promise<PostLikeDataDBType[]> {
    /*Просим модель "PostLikeDataModel" найти данные о трех последних лайках поста по ID поста в БД.*/
    return PostLikeDataModel.find(
      { postId, likeStatus: PostLikeStatus.Like },
      { addedAt: 1, userId: 1, login: 1, _id: 0 }
    )
      .sort({ addedAt: -1 })
      .limit(3)
      .lean();
  }

  /*Метод для поиска данных о лайках постов по ID постов и ID пользователя в БД.*/
  public async findAllPostLikesDataByPostIdsAndUserId(
    postIds: string[],
    userId: string
  ): Promise<PostLikeDataDBType[]> {
    /*Просим модель "PostLikeDataModel" найти данные о лайках постов по ID постов и ID пользователя в БД.*/
    return await PostLikeDataModel.find({ postId: { $in: postIds }, userId }).lean();
  }

  /*Метод для поиска данных о трех последних лайках постов по ID постов в БД.*/
  public async findLastThreeLikesForPostsByPostIds(postIds: string[]): Promise<Map<string, PostLikeDataDBType[]>> {
    /*Просим модель "PostLikeDataModel" найти данные о трех последних лайках постов по ID постов в БД.*/
    const postLikesData = await PostLikeDataModel.find({ postId: { $in: postIds }, likeStatus: PostLikeStatus.Like })
      .sort({ addedAt: -1 })
      .lean();

    /*Создаем Map: postId: PostLikeDataDBType[].*/
    const map: Map<string, PostLikeDataDBType[]> = new Map<string, PostLikeDataDBType[]>();

    /*Для каждого ID поста оставляем только данные о трех последних лайках поста.*/
    for (const postLikeData of postLikesData) {
      const postId: string = postLikeData.postId;
      if (!map.has(postId)) map.set(postId, []);
      const postLikesDataArray = map.get(postId)!;
      if (postLikesDataArray.length < 3) postLikesDataArray.push(postLikeData);
    }

    /*Возвращаем данные о трех последних лайках постов.*/
    return map;
  }
}
