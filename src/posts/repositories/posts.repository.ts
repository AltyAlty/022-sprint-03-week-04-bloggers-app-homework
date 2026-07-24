import { injectable } from 'inversify';
import { DeleteResult } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { PostModel } from './models/post.model';
import { PostLikeDataModel } from './models/post-like-data.model';
import { PostType } from '../application/types/post.type';
import { PostLikeDataType, PostLikeStatus } from '../application/types/post-like-data.type';
import { PostDBType } from './types/post-db.type';
import { PostLikeDataDBType } from './types/post-like-data-db.type';
import { PostListDBType } from './types/post-list-db.type';
import { UpdatePostByIdInputDTO } from '../routes/input-dto/update-post-by-id.input-dto';
import { NewestPostLikeListOutputDTO } from '../routes/output-dto/post.output-dto';

/*Репозиторий для работы с постами в БД.*/
@injectable()
export class PostsRepository {
  /*Метод для добавления поста в БД.*/
  public async create(newPost: PostType): Promise<string> {
    /*Просим модель "PostModel" создать пост в БД.*/
    const post: HydratedDocument<PostType> = new PostModel(newPost);
    await post.save();
    /*Возвращаем ID созданного поста.*/
    return post._id.toString();
  }

  /*Метод для добавления данных о лайке поста в БД.*/
  public async createPostLikeData(newPostLikeData: PostLikeDataType): Promise<string> {
    /*Просим модель "PostLikeDataModel" создать данные о лайке поста в БД.*/
    const postLikeData: HydratedDocument<PostLikeDataType> = new PostLikeDataModel(newPostLikeData);
    await postLikeData.save();
    /*Возвращаем ID созданных данных о лайке поста.*/
    return postLikeData._id.toString();
  }

  /*Метод для поиска поста по ID в БД.*/
  public async findById(id: string): Promise<PostDBType | null> {
    /*Просим модель "PostModel" найти пост по ID в БД.*/
    return await PostModel.findById(id).lean();
  }

  /*Метод для поиска постов по ID блога в БД.*/
  public async findAllByBlogId(blogId: string): Promise<PostListDBType | null> {
    /*Просим модель "PostModel" найти посты по ID блога в БД.*/
    const posts: PostListDBType = await PostModel.find({ blogId }).lean();
    /*Если посты были найдены, то возвращаем их, иначе возвращаем null.*/
    return posts.length === 0 ? null : posts;
  }

  /*Метод для поиска данных о лайке поста по ID поста и ID пользователя в БД.*/
  public async findPostLikeDataByPostIdAndUserId(postId: string, userId: string): Promise<PostLikeDataDBType | null> {
    /*Просим модель "PostLikeDataModel" найти данные о лайке поста по ID поста и ID пользователя в БД.*/
    return await PostLikeDataModel.findOne({ postId, userId }).lean();
  }

  /*Метод для поиска данных о трех последних лайках поста по ID поста в БД.*/
  public async findLastThreePostLikes(postId: string): Promise<NewestPostLikeListOutputDTO> {
    /*Просим модель "PostLikeDataModel" найти данные о трех последних лайках поста по ID поста в БД.*/
    return (
      PostLikeDataModel.find(
        { postId, likeStatus: PostLikeStatus.Like },
        /*Указываем какие поля включать в результат.*/
        { addedAt: 1, userId: 1, login: 1, _id: 0 }
      )
        /*Сортируем найденные данные о лайках поста по полю "addedAt" в порядке убывания.*/
        .sort({ addedAt: -1 })
        /*Ограничиваем количество возвращаемых данных о лайках поста до трех.*/
        .limit(3)
        .lean()
    );
  }

  /*Метод для изменения поста по ID в БД.*/
  public async updateById(id: string, dto: UpdatePostByIdInputDTO): Promise<number> {
    /*Просим модель "PostModel" найти пост по ID в БД.*/
    const post: HydratedDocument<PostType> | null = await PostModel.findById(id);
    /*Если пост не был найден, то сообщаем, что он не был изменен.*/
    if (!post) return 0;
    /*Если пост был найден, то изменяем его в БД.*/
    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = dto.blogId;
    await post.save();
    /*Сообщаем, что пост был изменен.*/
    return 1;
  }

  /*Метод для изменения количества лайков/дизлайков у поста по ID в БД.*/
  public async updatePostLikesById(id: string, likesCount: number, dislikesCount: number): Promise<number> {
    /*Просим модель "PostModel" найти пост по ID в БД.*/
    const post: HydratedDocument<PostType> | null = await PostModel.findById(id);
    /*Если пост не был найден, то сообщаем, что он не был изменен.*/
    if (!post) return 0;
    /*Если пост был найден, то изменяем количество лайков/дизлайков у него в БД.*/
    post.extendedLikesInfo.likesCount += likesCount;
    post.extendedLikesInfo.dislikesCount += dislikesCount;
    await post.save();
    /*Сообщаем, что количество лайков/дизлайков у поста было изменено.*/
    return 1;
  }

  /*Метод для изменения данных о лайке поста по ID поста и ID пользователя в БД.*/
  public async updatePostLikeDataByPostIdAndUserId(
    postId: string,
    userId: string,
    likeStatus: PostLikeStatus
  ): Promise<number> {
    /*Просим модель "PostLikeDataModel" найти данные о лайке поста по ID поста и ID пользователя в БД.*/
    const postLikeData: HydratedDocument<PostLikeDataType> | null = await PostLikeDataModel.findOne({ postId, userId });
    /*Если данные о лайке поста не были найдены, то сообщаем, что они не были изменены.*/
    if (!postLikeData) return 0;
    /*Если данные о лайке поста были найдены, то изменяем их в БД.*/
    postLikeData.likeStatus = likeStatus;
    await postLikeData.save();
    /*Сообщаем, что данные о лайке поста были изменены.*/
    return 1;
  }

  /*Метод для удаления поста по ID в БД.*/
  public async deleteById(id: string): Promise<number> {
    /*Просим модель "PostModel" удалить пост по ID в БД.*/
    const result: DeleteResult = await PostModel.deleteOne({ _id: id });
    /*Возвращаем количество удаленных постов.*/
    return result.deletedCount;
  }

  /*Метод для удаления постов по ID блога в БД.*/
  public async deleteAllByBlogId(blogId: string): Promise<number> {
    /*Просим модель "PostModel" удалить посты по ID блога в БД.*/
    const result: DeleteResult = await PostModel.deleteMany({ blogId });
    /*Возвращаем количество удаленных постов.*/
    return result.deletedCount;
  }

  /*Метод для удаления данных о лайке поста по ID поста и ID пользователя в БД.*/
  public async deletePostLikeDataByPostIdAndUserId(postId: string, userId: string): Promise<number> {
    /*Просим модель "PostLikeDataModel" удалить данные о лайке поста по ID поста и ID пользователя в БД.*/
    const result: DeleteResult = await PostLikeDataModel.deleteOne({ postId, userId });
    /*Возвращаем количество удаленных данных о лайке поста.*/
    return result.deletedCount;
  }
}
