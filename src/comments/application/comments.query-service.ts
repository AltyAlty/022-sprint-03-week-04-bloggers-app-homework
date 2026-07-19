import { PostsQueryService } from '../../posts/application/posts.query-service';
import { CommentsQueryRepository } from '../repositories/comments.query-repository';
import { Result } from '../../core/types/result/result.type';
import { commentLikeStatusOutputDTO, CommentOutputDTO } from '../routes/output-dto/comment.output-dto';
import { ResultStatuses } from '../../core/types/result/result-statuses';
import { mapToCommentOutputDTO } from '../repositories/mappers/map-to-comment-output-dto.util';
import { GetCommentListByPostIdQueryInputDTO } from '../routes/input-dto/query/get-comment-list-by-post-id-query.input-dto';
import { PaginatedCommentListOutputDTO } from '../routes/output-dto/paginated-comment-list.output-dto';
import { mapToPaginatedCommentListOutputDTO } from '../repositories/mappers/map-to-paginated-comment-list-output-dto.util';
import { PostOutputDTO } from '../../posts/routes/output-dto/post.output-dto';
import { CommentDBType } from '../repositories/types/comment-db.type';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../ioc/types';
import { CommentListDBType } from '../repositories/types/comment-list-db.type';
import { CommentLikeDataDBType } from '../repositories/types/comment-like-data-db.type';
import { CommentListOutputDTO } from '../routes/output-dto/comment-list.output-dto';
import { mapToCommentListOutputDTO } from '../repositories/mappers/map-to-comment-list-output-dto.utils';

/*Query-сервис для работы с комментариями.*/
@injectable()
export class CommentsQueryService {
  constructor(
    @inject(TYPES.PostsQueryService) private readonly postsQueryService: PostsQueryService,
    @inject(TYPES.CommentsQueryRepository) private readonly commentsQueryRepository: CommentsQueryRepository
  ) {}

  /*Метод для поиска комментария по ID.*/
  public async findById(id: string, userId?: string): Promise<Result<{ commentOutput: CommentOutputDTO } | null>> {
    /*Просим query-репозиторий "commentsQueryRepository" найти комментарий по ID в БД.*/
    const commentDB: CommentDBType | null = await this.commentsQueryRepository.findById(id);

    /*Если комментарий не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (!commentDB) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'id', message: 'Comment not found' }],
      };
    }

    /*Формируем статус лайка комментария.*/
    let likeStatus: commentLikeStatusOutputDTO = commentLikeStatusOutputDTO.None;

    /*Если в запрос был указан AT.*/
    if (userId) {
      /*Просим query-репозиторий "commentsQueryRepository" найти данные о лайке комментария в БД.*/
      const commentLikeDataDB: CommentLikeDataDBType | null =
        await this.commentsQueryRepository.findCommentLikeDataByCommentIdAndUserId(id, userId);

      /*Если данные о лайке комментария были найдены, то получаем статус лайка.*/
      if (commentLikeDataDB) likeStatus = commentLikeDataDB.likeStatus as unknown as commentLikeStatusOutputDTO;
    }

    /*Если комментарий был найден, то преобразовываем комментарий из БД в подготовленный для отправки клиенту
    комментарий.*/
    const commentOutput: CommentOutputDTO = mapToCommentOutputDTO(commentDB, likeStatus);
    /*Возвращаем ResultObject с преобразованным комментарием.*/
    return { status: ResultStatuses.Ok, data: { commentOutput }, extensions: [] };
  }

  /*Метод для поиска комментариев по ID поста.*/
  public async findAllByPostId(
    postId: string,
    queryDTO: GetCommentListByPostIdQueryInputDTO,
    userId?: string
  ): Promise<Result<{ paginatedCommentListOutput: PaginatedCommentListOutputDTO } | null>> {
    /*Просим query-сервис "postsQueryService" найти пост по ID.*/
    const postResult: Result<{ postOutput: PostOutputDTO } | null> = await this.postsQueryService.findById(postId);
    /*Если пост не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (postResult.status !== ResultStatuses.Ok) return postResult as Result;

    /*Если пост был найден, то просим query-репозиторий "commentsQueryRepository" найти комментарии по ID поста в БД.*/
    const { items, totalCount }: { items: CommentListDBType; totalCount: number } =
      await this.commentsQueryRepository.findAllByPostId(postId, queryDTO);

    /*Преобразовываем комментарии из БД в подготовленные для отправки клиенту без пагинации комментарии.*/
    const itemsWithMyStatus: CommentListOutputDTO = await mapToCommentListOutputDTO(
      items,
      this.commentsQueryRepository,
      userId
    );

    /*Преобразовываем комментарии подготовленные для отправки клиенту без пагинации в подготовленные для пагинации
    комментарии.*/
    const paginatedCommentListOutput: PaginatedCommentListOutputDTO = mapToPaginatedCommentListOutputDTO(
      itemsWithMyStatus,
      { pageNumber: queryDTO.pageNumber, pageSize: queryDTO.pageSize, totalCount }
    );

    /*Возвращаем ResultObject с преобразованными для пагинации комментариями.*/
    return { status: ResultStatuses.Ok, data: { paginatedCommentListOutput }, extensions: [] };
  }
}
