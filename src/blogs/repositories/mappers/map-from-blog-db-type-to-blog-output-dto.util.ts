import { BlogDBType } from '../types/blog-db.type';
import { BlogOutputDTO } from '../../routes/output-dto/blog.output-dto';

/*Функция для преобразовывания блога из БД в подготовленный для отправки клиенту блог.*/
export const mapFromBlogDBTypeToBlogOutputDTO = (blog: BlogDBType): BlogOutputDTO => {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
};
