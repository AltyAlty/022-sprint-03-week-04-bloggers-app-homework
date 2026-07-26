import mongoose from 'mongoose';
import { UserDBType } from '../types/user-db.type';

/*Схема для пользователя в БД.*/
const UserSchema = new mongoose.Schema<UserDBType>({
  login: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: 1,
    maxLength: 100,
  },

  originalEmail: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: 1,
    maxLength: 1000,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: 1,
    maxLength: 1000,
  },

  passwordHash: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 100,
  },

  createdAt: {
    type: Date,
    immutable: true,
    default: Date.now,
  },

  isConfirmed: {
    type: Boolean,
    default: false,
  },
});

/*Поскольку часто выполняются операции чтения пользователей по умолчанию с сортировкой по дате создания пользователей по
убыванию (новые пользователи в начале), то создаем составной индекс для ускорения сортировки и более консистентной
пагинации. Так как в "_id" вшита дата создания документа, то используем одинаковые направления для полей индекса.*/
UserSchema.index({ createdAt: -1, _id: -1 });

/*Модель для пользователя в БД.*/
export const UserModel = mongoose.model<UserDBType>('User', UserSchema, 'users');
