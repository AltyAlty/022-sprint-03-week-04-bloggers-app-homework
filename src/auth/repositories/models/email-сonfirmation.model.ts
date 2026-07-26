import mongoose from 'mongoose';
import { EmailConfirmationDBType } from '../types/email-сonfirmation-db.type';
import { SETTINGS } from '../../../core/settings/settings';

/*Схема для данных о подтверждении регистрации пользователя в БД.*/
const EmailConfirmationSchema = new mongoose.Schema<EmailConfirmationDBType>({
  userId: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 100,
  },

  confirmationCode: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 100,
  },

  expirationDate: {
    type: Date,
    required: true,
    immutable: true,
    expires: SETTINGS.COMPLETE_REGISTRATION_CODE_EXPIRATION_TIME_IN_DB_IN_SECONDS,
  },
});

/*Следующие индексы стоит использовать, например, при большом наплыве новых пользователей:
1. Поскольку при подтверждении регистрации выполняется поиск по коду подтверждения, то создаем индекс для ускорения этой
операции: "EmailConfirmationSchema.index({ confirmationCode: 1 })".
2. Поскольку выполняются операции поиска, обновления и удаления данных о подтверждении регистрации по ID пользователя,
то создаем индекс для ускорения этих операций: "EmailConfirmationSchema.index({ userId: 1 })".*/

/*Модель для данных о подтверждении регистрации пользователя в БД.*/
export const EmailConfirmationModel = mongoose.model<EmailConfirmationDBType>(
  'EmailConfirmation',
  EmailConfirmationSchema,
  'emailConfirmations'
);
