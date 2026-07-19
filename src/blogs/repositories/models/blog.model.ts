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

/*Модель для блога в БД.*/
export const BlogModel = mongoose.model<BlogDBType>('Blog', BlogSchema, 'blogs');
