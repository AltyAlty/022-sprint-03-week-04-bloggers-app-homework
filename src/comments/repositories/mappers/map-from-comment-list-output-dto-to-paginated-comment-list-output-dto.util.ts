import { CommentListOutputDTO } from '../../routes/output-dto/comment-list.output-dto';
import { PaginatedCommentListOutputDTO } from '../../routes/output-dto/paginated-comment-list.output-dto';

/*Функция для преобразования подготовленных для отправки клиенту без пагинации комментариев в подготовленные для
отправки клиенту с пагинацией комментарии.*/
export const mapFromCommentListOutputDTOToPaginatedCommentListOutputDTO = (
  comments: CommentListOutputDTO,
  meta: { pageNumber: number; pageSize: number; totalCount: number }
): PaginatedCommentListOutputDTO => {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: comments,
  };
};
