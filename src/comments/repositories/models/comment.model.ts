import mongoose from 'mongoose';
import { CommentDBType } from '../types/comment-db.type';

/*Схема для комментария в БД.*/
const CommentSchema = new mongoose.Schema<CommentDBType>({
  content: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 1000,
  },

  postId: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 100,
  },

  commentatorInfo: {
    userId: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 100,
    },

    userLogin: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 100,
    },
  },

  createdAt: {
    type: Date,
    immutable: true,
    default: Date.now,
  },

  likesInfo: {
    likesCount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    dislikesCount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
});

/*Поскольку часто выполняются операции чтения комментариев в каком-то посте по умолчанию с сортировкой по дате создания
комментариев по убыванию (новые комментарии в начале), то создаем составной индекс для ускорения сортировки и более
консистентной пагинации. Так как в "_id" вшита дата создания документа, то используем одинаковые направления для полей
"createdAt" и "_id" индекса.*/
CommentSchema.index({ postId: 1, createdAt: -1, _id: -1 });

/*Модель для комментария в БД.*/
export const CommentModel = mongoose.model<CommentDBType>('Comment', CommentSchema, 'comments');
