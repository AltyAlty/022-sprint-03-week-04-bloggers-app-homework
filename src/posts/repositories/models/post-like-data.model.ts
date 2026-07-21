import mongoose from 'mongoose';
import { PostLikeDataDBType } from '../types/post-like-data-db.type';
import { PostLikeStatus } from '../../application/types/post-like-data.type';

/*Схема для данных о лайке поста в БД.*/
const PostLikeDataSchema = new mongoose.Schema<PostLikeDataDBType>({
  postId: {
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

  login: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: 1,
    maxLength: 100,
  },

  likeStatus: {
    type: String,
    required: true,
    enum: Object.values(PostLikeStatus),
  },

  addedAt: {
    type: Date,
    immutable: true,
    default: Date.now,
  },
});

/*Составной индекс для защиты от дубликатов данных о лайке от одного пользователя на пост.*/
PostLikeDataSchema.index({ postId: 1, userId: 1 }, { unique: true });
/*Индекс для быстрых подсчетов лайков/дизлайков.*/
PostLikeDataSchema.index({ postId: 1 });

/*Модель для данных о лайке поста в БД.*/
export const PostLikeDataModel = mongoose.model<PostLikeDataDBType>(
  'PostLikeData',
  PostLikeDataSchema,
  'postLikesData'
);
