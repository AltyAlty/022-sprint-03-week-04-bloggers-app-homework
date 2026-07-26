import mongoose from 'mongoose';
import { SessionDBType } from '../types/session-db.type';
import { SETTINGS } from '../../../core/settings/settings';

/*Схема для сессии в БД.*/
const SessionSchema = new mongoose.Schema<SessionDBType>({
  userId: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 100,
  },

  deviceId: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 100,
  },

  deviceName: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 1000,
  },

  ip: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 100,
  },

  iat: {
    type: Date,
    required: true,
  },

  exp: {
    type: Date,
    required: true,
    expires: SETTINGS.SESSION_EXPIRATION_TIME_IN_DB_IN_SECONDS,
  },
});

/*Поскольку часто выполняются операции поиска, обновления и удаления сессий (Equality по полям "userId" и "deviceId"),
то создаем составной уникальный индекс для ускорения этих операций и гарантии, что у одного пользователя не может быть
двух сессий на одном устройстве (проверки в коде могут пропустить такие случаи). Этот индекс также покрывает запросы
только по полю "userId" (правило префиксов).*/
SessionSchema.index({ userId: 1, deviceId: 1 }, { unique: true });

/*Модель для сессии в БД.*/
export const SessionModel = mongoose.model<SessionDBType>('Session', SessionSchema, 'sessions');
