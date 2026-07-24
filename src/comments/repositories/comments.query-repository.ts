import { injectable } from 'inversify';
import { Filter } from 'mongodb';
import { CommentModel } from './models/comment.model';
import { CommentLikeDataModel } from './models/comment-like-data.model';
import { SortDirection } from '../../core/types/pagination/sort-direction.type';
import { CommentType } from '../application/types/comment.type';
import { CommentDBType } from './types/comment-db.type';
import { CommentLikeDataDBType } from './types/comment-like-data-db.type';
import { CommentListDBType } from './types/comment-list-db.type';
import { CommentSortFieldQueryInputDTO } from '../routes/input-dto/query/comment-sort-field-query.input-dto';
import { GetCommentListByPostIdQueryInputDTO } from '../routes/input-dto/query/get-comment-list-by-post-id-query.input-dto';

/*Query-репозиторий для работы с комментариями в БД.*/
@injectable()
export class CommentsQueryRepository {
  /*Метод для поиска комментария по ID в БД.*/
  public async findById(id: string): Promise<CommentDBType | null> {
    /*Просим модель "CommentModel" найти комментарий по ID в БД.*/
    return await CommentModel.findById(id).lean();
  }

  /*Метод для поиска комментариев по ID поста в БД.*/
  public async findAllByPostId(
    postId: string,
    queryDTO: GetCommentListByPostIdQueryInputDTO
  ): Promise<{ items: CommentListDBType; totalCount: number }> {
    /*Создаем переменные на основе параметра "queryDTO" при помощи деструктуризации.*/
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    }: {
      pageNumber: number;
      pageSize: number;
      sortBy: CommentSortFieldQueryInputDTO;
      sortDirection: SortDirection;
    } = queryDTO;

    /*Переменная "skip" обозначает сколько записей надо пропустить перед тем, как начать отдавать запрошенную страницу
    "pageNumber".*/
    const skip: number = (pageNumber - 1) * pageSize;
    /*Динамически собираем фильтр для поиска в MongoDB. Начинаем с пустого фильтра.*/
    const filter: Filter<CommentType> = {};
    /*Добавляем в фильтр ID поста.*/
    filter.postId = postId;

    /*Просим модель "CommentModel" найти комментарии в посте по ID в БД и подсчитать общее количество документов,
    подходящих под фильтр, без учета пагинации.*/
    const [items, totalCount]: [CommentListDBType, number] = await Promise.all([
      CommentModel.find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      CommentModel.countDocuments(filter),
    ]);

    /*Возвращаем данные по комментариям.*/
    return { items, totalCount };
  }

  /*Метод для поиска данных о лайке комментария по ID комментария и ID пользователя в БД.*/
  public async findCommentLikeDataByCommentIdAndUserId(
    commentId: string,
    userId: string
  ): Promise<CommentLikeDataDBType | null> {
    /*Просим модель "CommentLikeDataModel" найти данные о лайке комментария по ID комментария и ID пользователя в БД.*/
    return await CommentLikeDataModel.findOne({ commentId, userId }).lean();
  }

  /*Метод для поиска данных о лайках комментариев по ID комментариев и ID пользователя в БД.*/
  public async findAllCommentLikesDataByCommentIdsAndUserId(
    commentIds: string[],
    userId: string
  ): Promise<CommentLikeDataDBType[]> {
    /*Просим модель "CommentLikeDataModel" найти данные о лайках комментариев по ID комментариев и ID пользователя в
    БД.*/
    return await CommentLikeDataModel.find({ commentId: { $in: commentIds }, userId }).lean();
  }
}
