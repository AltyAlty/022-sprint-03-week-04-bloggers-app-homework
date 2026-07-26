import mongoose from 'mongoose';
import { PostDBType } from '../types/post-db.type';

/*Схема для поста в БД.*/
const PostSchema = new mongoose.Schema<PostDBType>({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 100,
  },

  shortDescription: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 1000,
  },

  content: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 2000,
  },

  blogId: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 100,
  },

  blogName: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 100,
  },

  createdAt: {
    type: Date,
    immutable: true,
    default: Date.now,
  },

  extendedLikesInfo: {
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

/*Поскольку часто выполняются операции чтения постов по умолчанию с сортировкой по дате создания постов по убыванию
(новые посты в начале), то создаем составной индекс для ускорения сортировки и более консистентной пагинации. Так как в
"_id" вшита дата создания документа, то используем одинаковые направления для полей индекса.*/
PostSchema.index({ createdAt: -1, _id: -1 });
/*Поскольку часто выполняются операции чтения постов в каком-то блоге по умолчанию с сортировкой по дате создания постов
по убыванию (новые посты в начале), то создаем составной индекс для ускорения сортировки и более консистентной
пагинации. Так как в "_id" вшита дата создания документа, то используем одинаковые направления для полей "createdAt"
и "_id" индекса.*/
PostSchema.index({ blogId: 1, createdAt: -1, _id: -1 });

/*Модель для поста в БД.*/
export const PostModel = mongoose.model<PostDBType>('Post', PostSchema, 'posts');
