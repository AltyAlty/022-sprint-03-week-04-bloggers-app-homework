import { BlogsQueryService } from '../../blogs/application/blogs.query-service';
import { PostsQueryRepository } from '../repositories/posts.query-repository';
import { GetPostListQueryInputDTO } from '../routes/input-dto/query/get-post-list-query.input-dto';
import { mapFromPostListOutputDTOToPaginatedPostListOutputDTO } from '../repositories/mappers/map-from-post-list-output-dto-to-paginated-post-list-output-dto.util';
import { PaginatedPostListOutputDTO } from '../routes/output-dto/paginated-post-list.output-dto';
import { mapFromPostDBTypeToPostOutputDTO } from '../repositories/mappers/map-from-post-db-type-to-post-output-dto.util';
import { PostLikeStatusOutputDTO, PostOutputDTO } from '../routes/output-dto/post.output-dto';
import { ResultStatuses } from '../../core/types/result/result-statuses';
import { Result } from '../../core/types/result/result.type';
import { BlogOutputDTO } from '../../blogs/routes/output-dto/blog.output-dto';
import { PostDBType } from '../repositories/types/post-db.type';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../ioc/types';
import { PostListDBType } from '../repositories/types/post-list-db.type';
import { PostLikeDataDBType } from '../repositories/types/post-like-data-db.type';
import { PostListOutputDTO } from '../routes/output-dto/post-list.output-dto';
import { mapFromPostListDBTypeToPostListOutputDTO } from '../repositories/mappers/map-from-post-list-db-type-to-post-list-output-dto.utils';

/*Query-сервис для работы с постами.*/
@injectable()
export class PostsQueryService {
  constructor(
    @inject(TYPES.BlogsQueryService) private readonly blogsQueryService: BlogsQueryService,
    @inject(TYPES.PostsQueryRepository) private readonly postsQueryRepository: PostsQueryRepository
  ) {}

  /*Метод для поиска поста по ID.*/
  public async findById(id: string, userId?: string): Promise<Result<{ postOutput: PostOutputDTO } | null>> {
    /*Просим query-репозиторий "postsQueryRepository" найти пост по ID в БД.*/
    const postDB: PostDBType | null = await this.postsQueryRepository.findById(id);

    /*Если пост не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (!postDB) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'id', message: 'Post not found' }],
      };
    }

    /*Формируем статус лайка поста.*/
    let likeStatus: PostLikeStatusOutputDTO = PostLikeStatusOutputDTO.None;

    /*Если в запросе был указан AT.*/
    if (userId) {
      /*Просим query-репозиторий "postsQueryRepository" найти данные о лайке поста в БД.*/
      const postLikeDataDB: PostLikeDataDBType | null =
        await this.postsQueryRepository.findPostLikeDataByPostIdAndUserId(id, userId);

      /*Если данные о лайке поста были найдены, то получаем статус лайка.*/
      if (postLikeDataDB) likeStatus = postLikeDataDB.likeStatus as unknown as PostLikeStatusOutputDTO;
    }

    /*Просим query-репозиторий "postsQueryRepository" найти данные о трех последних лайках поста по ID поста в БД.*/
    const newestLikes: PostLikeDataDBType[] = await this.postsQueryRepository.findLastThreePostLikes(id);
    /*Если пост был найден, то преобразовываем пост из БД в подготовленный для отправки клиенту пост.*/
    const postOutput: PostOutputDTO = mapFromPostDBTypeToPostOutputDTO(postDB, likeStatus, newestLikes);
    /*Возвращаем ResultObject с преобразованным постом.*/
    return { status: ResultStatuses.Ok, data: { postOutput }, extensions: [] };
  }

  /*Метод для поиска постов.*/
  public async findAll(
    queryDTO: GetPostListQueryInputDTO,
    blogId?: string,
    userId?: string
  ): Promise<Result<{ paginatedPostListOutput: PaginatedPostListOutputDTO } | null>> {
    /*Если был указан ID блога, то проверяем существует ли он.*/
    if (blogId) {
      /*Просим query-сервис "blogsQueryService" найти блог по ID.*/
      const blogResult: Result<{ blogOutput: BlogOutputDTO } | null> = await this.blogsQueryService.findById(blogId);
      /*Если блог не был найден, то возвращаем ResultObject с информацией об этом.*/
      if (blogResult.status !== ResultStatuses.Ok) return blogResult as Result;
    }

    /*Просим query-репозиторий "postsQueryRepository" найти посты в БД.*/
    const { items, totalCount }: { items: PostListDBType; totalCount: number } =
      await this.postsQueryRepository.findAll(queryDTO, blogId);

    /*Преобразовываем посты из БД в подготовленные для отправки клиенту без пагинации посты.*/
    const itemsWithMyStatusAndNewestLikes: PostListOutputDTO = await mapFromPostListDBTypeToPostListOutputDTO(
      items,
      this.postsQueryRepository,
      userId
    );

    /*Преобразовываем подготовленные для отправки клиенту без пагинации посты в подготовленные для отправки клиенту с
    пагинацией посты.*/
    const paginatedPostListOutput: PaginatedPostListOutputDTO = mapFromPostListOutputDTOToPaginatedPostListOutputDTO(
      itemsWithMyStatusAndNewestLikes,
      { pageNumber: queryDTO.pageNumber, pageSize: queryDTO.pageSize, totalCount }
    );

    /*Возвращаем ResultObject с преобразованными для пагинации постами.*/
    return { status: ResultStatuses.Ok, data: { paginatedPostListOutput }, extensions: [] };
  }
}
