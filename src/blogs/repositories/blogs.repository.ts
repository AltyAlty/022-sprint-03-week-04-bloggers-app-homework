import { BlogType } from '../application/types/blog.type';
import { UpdateBlogByIdInputDTO } from '../routes/input-dto/update-blog-by-id.input-dto';
import { BlogDBType } from './types/blog-db.type';
import { injectable } from 'inversify';
import { BlogModel } from './models/blog.model';
import { HydratedDocument } from 'mongoose';
import { DeleteResult } from 'mongodb';

/*Репозиторий для работы с блогами в БД.*/
@injectable()
export class BlogsRepository {
  /*Метод для добавления блога в БД.*/
  public async create(newBlog: BlogType): Promise<string> {
    /*Просим модель "BlogModel" создать блог в БД.*/
    const blog: HydratedDocument<BlogType> = new BlogModel(newBlog);
    await blog.save();
    /*Возвращаем ID созданного блога.*/
    return blog._id.toString();
  }

  /*Метод для поиска блога по ID в БД.*/
  public async findById(id: string): Promise<BlogDBType | null> {
    /*Просим модель "BlogModel" найти блог по ID в БД.*/
    const blog: BlogDBType | null = await BlogModel.findById(id).lean();
    /*Если блог был найден, то возвращаем его, иначе возвращаем null.*/
    return blog ?? null;
  }

  /*Метод для изменения блога по ID в БД.*/
  public async updateById(id: string, dto: UpdateBlogByIdInputDTO): Promise<number> {
    /*Просим модель "BlogModel" найти блог по ID в БД.*/
    const blog: HydratedDocument<BlogType> | null = await BlogModel.findById(id);
    /*Если блог не был найден, то сообщаем, что он не был изменен.*/
    if (!blog) return 0;
    /*Если блог был найден, то изменяем его в БД.*/
    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;
    await blog.save();
    /*Сообщаем, что блог был изменен.*/
    return 1;
  }

  /*Метод для удаления блога по ID в БД.*/
  public async deleteById(id: string): Promise<number> {
    /*Просим модель "BlogModel" удалить блог по ID в БД.*/
    const result: DeleteResult = await BlogModel.deleteOne({ _id: id });
    /*Возращаем количество удаленных блогов.*/
    return result.deletedCount;
  }
}
