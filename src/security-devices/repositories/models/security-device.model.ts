import mongoose from 'mongoose';
import { SecurityDeviceDBType } from '../types/security-device-db.type';

/*Схема для устройства пользователя из сессии в БД.*/
const SecurityDeviceSchema = new mongoose.Schema<SecurityDeviceDBType>({
  deviceId: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 100,
  },

  title: {
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

  lastActiveDate: {
    type: Date,
    required: true,
  },

  userId: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 100,
  },
});

/*Поскольку часто выполняются операции поиска, изменения и удаления устройства пользователя по полю "deviceId", то
создаем уникальный индекс для ускорения этих операций и гарантии, что в коллекции не может существовать двух устройств с
одинаковым ID.*/
SecurityDeviceSchema.index({ deviceId: 1 }, { unique: true });
/*Следующий индекс стоит использовать, например, при массовом удалении устройств пользователей после утечки данных:
Поскольку выполняются операции удаления устройств пользователя по полю "userId", то создаем индекс для ускорения этих
операций: "SecurityDeviceSchema.index({ userId: 1 })".*/

/*Модель для устройства пользователя из сессии в БД.*/
export const SecurityDeviceModel = mongoose.model<SecurityDeviceDBType>(
  'SecurityDevice',
  SecurityDeviceSchema,
  'securityDevices'
);
