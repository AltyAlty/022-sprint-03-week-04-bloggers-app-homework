import mongoose from 'mongoose';
import { SETTINGS } from '../../../core/settings/settings';
import { RequestRateLimitLogDBType } from '../types/request-rate-limit-log-db.type';

/*Схема для записи в журнале лимитов запросов в БД.*/
const RequestRateLimitLogSchema = new mongoose.Schema<RequestRateLimitLogDBType>({
  ip: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 100,
  },

  url: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 10000,
  },

  timestamp: {
    type: Date,
    required: true,
    immutable: true,
    expires: SETTINGS.REQUEST_RATE_LIMIT_LOG_EXPIRATION_TIME_IN_SECONDS,
  },
});

/*Используем составной индекс, чтобы ускорить работу метода "countDocuments()".*/
RequestRateLimitLogSchema.index({ ip: 1, url: 1, timestamp: -1 });

/*Модель для записи в журнале лимитов запросов в БД.*/
export const RequestRateLimitLogModel = mongoose.model<RequestRateLimitLogDBType>(
  'RequestRateLimitLog',
  RequestRateLimitLogSchema,
  'requestRateLimitLogs'
);
