import mongoose from 'mongoose';
import { CommentLikeStatus } from '../../application/types/comment-like-data.type';
import { CommentLikeDataDBType } from '../types/comment-like-data-db.type';

/*Схема для данных о лайке комментария в БД.*/
const CommentLikeDataSchema = new mongoose.Schema<CommentLikeDataDBType>({
  commentId: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 100,
  },

  userId: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 100,
  },

  likeStatus: {
    type: String,
    required: true,
    enum: Object.values(CommentLikeStatus),
  },
});

/*Поскольку часто выполняются операции поиска, обновления и удаления данных о лайке для конкретного комментария и для
конкретного пользователя (Equality по полям "commentId" и "userId"), то создаем составной уникальный индекс для
ускорения этих операций и гарантии, что на уровне БД один пользователь не сможет оставить более одного лайка на один и
тот же комментарий (проверки в код могут пропустить такие случаи).*/
CommentLikeDataSchema.index({ commentId: 1, userId: 1 }, { unique: true });

/*Модель для данных о лайке комментария в БД.*/
export const CommentLikeDataModel = mongoose.model<CommentLikeDataDBType>(
  'CommentLikeData',
  CommentLikeDataSchema,
  'commentLikesData'
);
