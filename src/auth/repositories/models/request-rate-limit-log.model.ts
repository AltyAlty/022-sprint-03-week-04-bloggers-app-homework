import mongoose from 'mongoose';
import { RequestRateLimitLogDBType } from '../types/request-rate-limit-log-db.type';
import { SETTINGS } from '../../../core/settings/settings';

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

/*Поскольку при каждом запросе к защищенным при помощи middleware "RequestRateLimitGuardMiddleware" эндпоинтам
выполняется подсчет количества запросов с конкретного IP по конкретному URL за определенный период (Equality по полям
"ip" и "url", Range по полю "timestamp"), то создаем составной индекс для ускорения этих операций подсчета методом
"countDocuments()".*/
RequestRateLimitLogSchema.index({ ip: 1, url: 1, timestamp: -1 });

/*Модель для записи в журнале лимитов запросов в БД.*/
export const RequestRateLimitLogModel = mongoose.model<RequestRateLimitLogDBType>(
  'RequestRateLimitLog',
  RequestRateLimitLogSchema,
  'requestRateLimitLogs'
);
