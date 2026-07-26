import mongoose from 'mongoose';
import { RecoveryCodeDataDBType } from '../types/recovery-code-data-db.type';
import { SETTINGS } from '../../../core/settings/settings';

/*Схема для данных о коде восстановления пароля пользователя в БД.*/
const RecoveryCodeDataSchema = new mongoose.Schema<RecoveryCodeDataDBType>({
  userId: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 100,
  },

  recoveryCode: {
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
    expires: SETTINGS.PASSWORD_RECOVERY_CODE_EXPIRATION_TIME_IN_DB_IN_SECONDS,
  },
});

/*Следующие индексы стоит использовать, например, при массовом восстановлении паролей пользователей после утечки данных:
1. Поскольку при восстановлении пароля выполняются операции поиска и удаления по коду восстановления, то создаем индекс
для ускорения этих операций: "RecoveryCodeDataSchema.index({ recoveryCode: 1 })".
2. Поскольку выполняются операции поиска и удаления данных о коде восстановления по ID пользователя, то создаем индекс
для ускорения этих операций: "RecoveryCodeDataSchema.index({ userId: 1 })".*/

/*Модель для данных о коде восстановления пароля пользователя в БД.*/
export const RecoveryCodeDataModel = mongoose.model<RecoveryCodeDataDBType>(
  'RecoveryCodeData',
  RecoveryCodeDataSchema,
  'recoveryCodesData'
);
