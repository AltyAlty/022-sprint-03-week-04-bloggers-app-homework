import mongoose from 'mongoose';
import { BlogDBType } from '../types/blog-db.type';

/*Схема для блога в БД.*/
const BlogSchema = new mongoose.Schema<BlogDBType>({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 100,
  },

  description: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 1000,
  },

  websiteUrl: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 1000,
  },

  createdAt: {
    type: Date,
    immutable: true,
    default: Date.now,
  },

  isMembership: {
    type: Boolean,
    default: false,
  },
});

/*Поскольку часто выполняются операции чтения блогов по умолчанию с сортировкой по дате создания блогов по убыванию
(новые блоги в начале), то создаем составной индекс для ускорения сортировки и более консистентной пагинации. Так как в
"_id" вшита дата создания документа, то используем одинаковые направления для полей внутри индекса.*/
BlogSchema.index({ createdAt: -1, _id: -1 });

/*Модель для блога в БД.*/
export const BlogModel = mongoose.model<BlogDBType>('Blog', BlogSchema, 'blogs');
