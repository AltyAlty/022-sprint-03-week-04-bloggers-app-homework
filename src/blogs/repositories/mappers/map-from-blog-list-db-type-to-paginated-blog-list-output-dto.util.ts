import { BlogDBType } from '../types/blog-db.type';
import { BlogListDBType } from '../types/blog-list-db.type';
import { BlogOutputDTO } from '../../routes/output-dto/blog.output-dto';
import { PaginatedBlogListOutputDTO } from '../../routes/output-dto/paginated-blog-list.output-dto';

/*Функция для преобразовывания блогов из БД в подготовленные для отправки клиенту с пагинацией блоги.*/
export const mapFromBlogListDBTypeToPaginatedBlogListOutputDTO = (
  blogs: BlogListDBType,
  meta: { pageNumber: number; pageSize: number; totalCount: number }
): PaginatedBlogListOutputDTO => {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: blogs.map((blog: BlogDBType): BlogOutputDTO => ({
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    })),
  };
};
