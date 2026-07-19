import { WithId } from 'mongodb';
import { CommentLikeDataType } from '../../application/types/comment-like-data.type';

/*Тип для данных о лайке комментария в БД.*/
export type CommentLikeDataDBType = WithId<CommentLikeDataType>;
