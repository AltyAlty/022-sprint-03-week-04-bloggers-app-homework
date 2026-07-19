import { PaginatedCommentListOutputDTO } from '../../routes/output-dto/paginated-comment-list.output-dto';
import { CommentListOutputDTO } from '../../routes/output-dto/comment-list.output-dto';

/*Функция для преобразования комментариев подготовленных для отправки клиенту без пагинации в подготовленные для
пагинации комментарии.*/
export const mapToPaginatedCommentListOutputDTO = (
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
