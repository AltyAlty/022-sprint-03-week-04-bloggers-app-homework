import { Filter } from 'mongodb';
import { PostType } from '../application/types/post.type';
import { GetPostListQueryInputDTO } from '../routes/input-dto/query/get-post-list-query.input-dto';
import { SortDirection } from '../../core/types/pagination/sort-direction';
import { PostSortFieldQueryInputDTO } from '../routes/input-dto/query/post-sort-field-query.input-dto';
import { PostDBType } from './types/post-db.type';
import { injectable } from 'inversify';
import { PostListDBType } from './types/post-list-db.type';
import { PostModel } from './models/post.model';

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
}
