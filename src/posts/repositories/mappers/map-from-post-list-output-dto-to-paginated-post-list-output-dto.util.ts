import { PaginatedPostListOutputDTO } from '../../routes/output-dto/paginated-post-list.output-dto';
import { PostListOutputDTO } from '../../routes/output-dto/post-list.output-dto';

/*Функция для преобразования подготовленных для отправки клиенту без пагинации постов в подготовленные для отправки
клиенту с пагинацией посты.*/
export const mapFromPostListOutputDTOToPaginatedPostListOutputDTO = (
  posts: PostListOutputDTO,
  meta: { pageNumber: number; pageSize: number; totalCount: number }
): PaginatedPostListOutputDTO => {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: posts,
  };
};
