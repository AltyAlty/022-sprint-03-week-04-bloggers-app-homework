import mongoose from 'mongoose';
import { SETTINGS } from '../../../core/settings/settings';
import { SessionDBType } from '../types/session-db.type';

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

/*Модель для сессии в БД.*/
export const SessionModel = mongoose.model<SessionDBType>('Session', SessionSchema, 'sessions');
