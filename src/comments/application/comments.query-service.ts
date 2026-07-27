import { TYPES } from '../../ioc/types';
import { inject, injectable } from 'inversify';
import { CommentsQueryRepository } from '../repositories/comments.query-repository';
import { Result } from '../../core/types/result/result.type';
import { ResultStatuses } from '../../core/types/result/result-statuses.type';
import { CommentDBType } from '../repositories/types/comment-db.type';
import { CommentLikeDataDBType } from '../repositories/types/comment-like-data-db.type';
import { CommentListDBType } from '../repositories/types/comment-list-db.type';
import { GetCommentListByPostIdQueryInputDTO } from '../routes/input-dto/query/get-comment-list-by-post-id-query.input-dto';
import { CommentLikeStatusOutputDTO, CommentOutputDTO } from '../routes/output-dto/comment.output-dto';
import { CommentListOutputDTO } from '../routes/output-dto/comment-list.output-dto';
import { PaginatedCommentListOutputDTO } from '../routes/output-dto/paginated-comment-list.output-dto';
import { mapFromCommentDBTypeToCommentOutputDTO } from '../repositories/mappers/map-from-comment-db-type-to-comment-output-dto.util';
import { mapFromCommentListOutputDTOToPaginatedCommentListOutputDTO } from '../repositories/mappers/map-from-comment-list-output-dto-to-paginated-comment-list-output-dto.util';
import { mapFromCommentListDBTypeToCommentListOutputDTO } from '../repositories/mappers/map-from-comment-list-db-type-to-comment-list-output-dto.utils';

/*Query-сервис для работы с комментариями.*/
@injectable()
export class CommentsQueryService {
  constructor(
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
    let likeStatus: CommentLikeStatusOutputDTO = CommentLikeStatusOutputDTO.None;

    /*Если в запросе был указан AT.*/
    if (userId) {
      /*Просим query-репозиторий "commentsQueryRepository" найти данные о лайке комментария в БД.*/
      const commentLikeDataDB: CommentLikeDataDBType | null =
        await this.commentsQueryRepository.findCommentLikeDataByCommentIdAndUserId(id, userId);

      /*Если данные о лайке комментария были найдены, то получаем статус лайка.*/
      if (commentLikeDataDB) likeStatus = commentLikeDataDB.likeStatus as unknown as CommentLikeStatusOutputDTO;
    }

    /*Если комментарий был найден, то преобразовываем комментарий из БД в подготовленный для отправки клиенту
    комментарий.*/
    const commentOutput: CommentOutputDTO = mapFromCommentDBTypeToCommentOutputDTO(commentDB, likeStatus);
    /*Возвращаем ResultObject с преобразованным комментарием.*/
    return { status: ResultStatuses.Ok, data: { commentOutput }, extensions: [] };
  }

  /*Метод для поиска комментариев по ID поста.*/
  public async findAllByPostId(
    postId: string,
    queryDTO: GetCommentListByPostIdQueryInputDTO,
    userId?: string
  ): Promise<Result<{ paginatedCommentListOutput: PaginatedCommentListOutputDTO } | null>> {
    /*Просим query-репозиторий "commentsQueryRepository" найти комментарии по ID поста в БД.*/
    const { items, totalCount }: { items: CommentListDBType; totalCount: number } =
      await this.commentsQueryRepository.findAllByPostId(postId, queryDTO);

    /*Преобразовываем комментарии из БД в подготовленные для отправки клиенту без пагинации комментарии.*/
    const itemsWithMyStatus: CommentListOutputDTO = await mapFromCommentListDBTypeToCommentListOutputDTO(
      items,
      this.commentsQueryRepository,
      userId
    );

    /*Преобразовываем подготовленные для отправки клиенту без пагинации комментарии в подготовленные для отправки
    клиенту с пагинацией комментарии.*/
    const paginatedCommentListOutput: PaginatedCommentListOutputDTO =
      mapFromCommentListOutputDTOToPaginatedCommentListOutputDTO(itemsWithMyStatus, {
        pageNumber: queryDTO.pageNumber,
        pageSize: queryDTO.pageSize,
        totalCount,
      });

    /*Возвращаем ResultObject с преобразованными для пагинации комментариями.*/
    return { status: ResultStatuses.Ok, data: { paginatedCommentListOutput }, extensions: [] };
  }
}
