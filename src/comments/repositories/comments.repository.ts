import { UpdateCommentByIdInputDTO } from '../routes/input-dto/update-comment-by-id.input-dto';
import { DeleteResult } from 'mongodb';
import { CommentType } from '../application/types/comment.type';
import { CommentDBType } from './types/comment-db.type';
import { injectable } from 'inversify';
import { CommentModel } from './models/comment.model';
import { HydratedDocument } from 'mongoose';
import { CommentLikeDataDBType } from './types/comment-like-data-db.type';
import { CommentLikeDataModel } from './models/comment-like-data.model';
import { CommentLikeDataType, CommentLikeStatus } from '../application/types/comment-like-data.type';

/*Репозиторий для работы с комментариями в БД.*/
@injectable()
export class CommentsRepository {
  /*Метод для добавления комментария в БД.*/
  public async create(newComment: CommentType): Promise<string> {
    /*Просим модель "CommentModel" создать комментарий в БД.*/
    const comment: HydratedDocument<CommentType> = new CommentModel(newComment);
    await comment.save();
    /*Возвращаем ID созданного комментария.*/
    return comment._id.toString();
  }

  /*Метод для добавления данных о лайке комментария в БД.*/
  public async createCommentLikeData(newCommentLikeData: CommentLikeDataType): Promise<string> {
    /*Просим модель "CommentLikeDataModel" создать данные о лайке комментария в БД.*/
    const commentLikeData: HydratedDocument<CommentLikeDataType> = new CommentLikeDataModel(newCommentLikeData);
    await commentLikeData.save();
    /*Возвращаем ID созданных данных о лайке комментария.*/
    return commentLikeData._id.toString();
  }

  /*Метод для поиска комментария по ID в БД.*/
  public async findById(id: string): Promise<CommentDBType | null> {
    /*Просим модель "CommentModel" найти комментарий по ID в БД.*/
    const comment: CommentDBType | null = await CommentModel.findById(id).lean();
    /*Если комментарий был найден, то возвращаем его, иначе null.*/
    return comment ?? null;
  }

  /*Метод для поиска комментариев по ID поста в БД.*/
  public async findAllByPostId(postId: string): Promise<CommentDBType[]> {
    /*Просим модель "CommentModel" найти комментарии по ID поста в БД.*/
    return await CommentModel.find({ postId }).lean();
  }

  /*Метод для поиска комментариев по ID постов в БД.*/
  public async findAllByPostIds(postIds: string[]): Promise<CommentDBType[]> {
    /*Просим модель "CommentModel" найти комментарии по ID постов в БД.*/
    return await CommentModel.find({ postId: { $in: postIds } }).lean();
  }

  /*Метод для поиска данных о лайке комментария по ID комментария и ID пользователя в БД.*/
  public async findCommentLikeDataByCommentIdAndUserId(
    commentId: string,
    userId: string
  ): Promise<CommentLikeDataDBType | null> {
    /*Просим модель "CommentLikeDataModel" найти данные о лайке комментария по ID комментария и ID пользователя в БД.*/
    const commentLikeData: CommentLikeDataDBType | null = await CommentLikeDataModel.findOne({
      commentId,
      userId,
    }).lean();

    /*Если данные о лайке комментария были найдены, то возвращаем их, иначе null.*/
    return commentLikeData ?? null;
  }

  /*Метод для изменения комментария по ID в БД.*/
  public async updateById(id: string, dto: UpdateCommentByIdInputDTO): Promise<number> {
    /*Просим модель "CommentModel" найти комментарий по ID в БД.*/
    const comment: HydratedDocument<CommentType> | null = await CommentModel.findById(id);
    /*Если комментарий не был найден, то сообщаем, что он не был изменен.*/
    if (!comment) return 0;
    /*Если комментарий был найден, то изменяем его в БД.*/
    comment.content = dto.content;
    await comment.save();
    /*Сообщаем, что комментарий был изменен.*/
    return 1;
  }

  /*Метод для изменения количества лайков/дизлайков у комментария по ID в БД.*/
  public async updateCommentLikesById(id: string, likesCount: number, dislikesCount: number): Promise<number> {
    /*Просим модель "CommentModel" найти комментарий по ID в БД.*/
    const comment: HydratedDocument<CommentType> | null = await CommentModel.findById(id);
    /*Если комментарий не был найден, то сообщаем, что он не был изменен.*/
    if (!comment) return 0;
    /*Если комментарий был найден, то изменяем количество лайков/дизлайков у него в БД.*/
    comment.likesInfo.likesCount += likesCount;
    comment.likesInfo.dislikesCount += dislikesCount;
    await comment.save();
    /*Сообщаем, что количество лайков/дизлайков у комментария было изменено.*/
    return 1;
  }

  /*Метод для изменения данных о лайке комментария по ID комментария и ID пользователя в БД.*/
  public async updateCommentLikeDataByCommentIdAndUserId(
    commentId: string,
    userId: string,
    likeStatus: CommentLikeStatus
  ): Promise<number> {
    /*Просим модель "CommentLikeDataModel" найти данные о лайке комментария по ID комментария и ID пользователя в БД.*/
    const commentLikeData: HydratedDocument<CommentLikeDataType> | null = await CommentLikeDataModel.findOne({
      commentId,
      userId,
    });

    /*Если данные о лайке комментария не были найдены, то сообщаем, что они не были изменены.*/
    if (!commentLikeData) return 0;
    /*Если данные о лайке комментария были найдены, то изменяем их в БД.*/
    commentLikeData.likeStatus = likeStatus;
    await commentLikeData.save();
    /*Сообщаем, что данные о лайке комментария были изменены.*/
    return 1;
  }

  /*Метод для удаления комментария по ID в БД.*/
  public async deleteById(id: string): Promise<number> {
    /*Просим модель "CommentModel" удалить комментарий по ID в БД.*/
    const result: DeleteResult = await CommentModel.deleteOne({ _id: id });
    /*Возвращаем количество удаленных комментариев.*/
    return result.deletedCount;
  }

  /*Метод для удаления комментариев по ID поста в БД.*/
  public async deleteAllByPostId(postId: string): Promise<number> {
    /*Просим модель "CommentModel" удалить комментарии по ID поста в БД.*/
    const result: DeleteResult = await CommentModel.deleteMany({ postId });
    /*Возвращаем количество удаленных комментариев.*/
    return result.deletedCount ?? 0;
  }

  /*Метод для удаления комментариев по ID пользователя в БД.*/
  public async deleteAllByUserId(userId: string): Promise<number> {
    /*Просим модель "CommentModel" удалить комментарии по ID пользователя в БД.*/
    const result: DeleteResult = await CommentModel.deleteMany({ 'commentatorInfo.userId': userId });
    /*Возвращаем количество удаленных комментариев.*/
    return result.deletedCount ?? 0;
  }

  /*Метод для удаления комментариев по ID постов в БД.*/
  public async deleteAllByPostIds(postIds: string[]): Promise<number> {
    /*Просим модель "CommentModel" удалить комментарии по ID постов в БД.*/
    const result: DeleteResult = await CommentModel.deleteMany({ postId: { $in: postIds } });
    /*Возвращаем количество удаленных комментариев.*/
    return result.deletedCount ?? 0;
  }

  /*Метод для удаления данных о лайке комментария по ID комментария и ID пользователя в БД.*/
  public async deleteCommentLikeDataByCommentIdAndUserId(commentId: string, userId: string): Promise<number> {
    /*Просим модель "CommentLikeDataModel" удалить данные о лайке комментария по ID комментария и ID пользователя в
    БД.*/
    const result: DeleteResult = await CommentLikeDataModel.deleteOne({
      commentId,
      userId,
    });

    /*Возвращаем количество удаленных данных о лайке комментария.*/
    return result.deletedCount;
  }

  /*Метод для удаления данных о лайках комментария по ID комментария в БД.*/
  public async deleteAllCommentLikesDataByCommentId(commentId: string): Promise<number> {
    /*Просим модель "CommentLikeDataModel" удалить данные о лайках комментария по ID комментария в БД.*/
    const result: DeleteResult = await CommentLikeDataModel.deleteMany({ commentId });
    /*Возвращаем количество удаленных данных о лайках комментария.*/
    return result.deletedCount;
  }

  /*Метод для удаления данных о лайках комментариев по ID пользователя в БД.*/
  public async deleteAllCommentLikesDataByUserId(userId: string): Promise<number> {
    /*Просим модель "CommentLikeDataModel" удалить данные о лайках комментариев по ID пользователя в БД.*/
    const result: DeleteResult = await CommentLikeDataModel.deleteMany({ userId });
    /*Возвращаем количество удаленных данных о лайках комментария.*/
    return result.deletedCount;
  }

  /*Метод для удаления данных о лайках комментариев по ID комментариев в БД.*/
  public async deleteAllCommentLikesDataByCommentIds(commentIds: string[]): Promise<number> {
    /*Просим модель "CommentLikeDataModel" удалить данные о лайках комментариев по ID комментариев в БД.*/
    const result: DeleteResult = await CommentLikeDataModel.deleteMany({ commentId: { $in: commentIds } });
    /*Возвращаем количество удаленных данных о лайках комментария.*/
    return result.deletedCount;
  }
}
