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
});

/*Модель для поста в БД.*/
export const PostModel = mongoose.model<PostDBType>('Post', PostSchema, 'posts');
