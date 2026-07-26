import mongoose from 'mongoose';
import { PostLikeStatus } from '../../application/types/post-like-data.type';
import { PostLikeDataDBType } from '../types/post-like-data-db.type';

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

/*Поскольку часто выполняются операции поиска, обновления и удаления данных о лайке для конкретного поста и для
конкретного пользователя (Equality по полям "postId" и "userId"), то создаем составной уникальный индекс для ускорения
этих операций и гарантии, что на уровне БД один пользователь не сможет оставить более одного лайка на один и тот же пост
(проверки в код могут пропустить такие случаи).*/
PostLikeDataSchema.index({ postId: 1, userId: 1 }, { unique: true });
/*Поскольку для отображения постов часто требуется найти три последних лайка (фильтрация по полям "postId" и
"likeStatus", затем сортировка по дате добавления по убыванию), создаем составной индекс для ускорения получения самых
свежих данных о лайках постов без сканирования лишних документов.*/
PostLikeDataSchema.index({ postId: 1, likeStatus: 1, addedAt: -1 });

/*Модель для данных о лайке поста в БД.*/
export const PostLikeDataModel = mongoose.model<PostLikeDataDBType>(
  'PostLikeData',
  PostLikeDataSchema,
  'postLikesData'
);
