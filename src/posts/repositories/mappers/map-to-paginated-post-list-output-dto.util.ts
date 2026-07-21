import { PaginatedPostListOutputDTO } from '../../routes/output-dto/paginated-post-list.output-dto';
import { PostListOutputDTO } from '../../routes/output-dto/post-list.output-dto';

/*Функция для преобразования постов подготовленных для отправки клиенту без пагинации в подготовленные для пагинации
посты.*/
export const mapToPaginatedPostListOutputDTO = (
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
