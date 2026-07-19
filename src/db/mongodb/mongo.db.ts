import mongoose from 'mongoose';
import { BlogModel } from '../../blogs/repositories/models/blog.model';
import { PostModel } from '../../posts/repositories/models/post.model';
import { CommentModel } from '../../comments/repositories/models/comment.model';
import { UserModel } from '../../users/repositories/models/user.model';
import { EmailConfirmationModel } from '../../auth/repositories/models/email-сonfirmation.model';
import { SessionModel } from '../../auth/repositories/models/session.model';
import { SecurityDeviceModel } from '../../security-devices/repositories/models/security-device.model';
import { RequestRateLimitLogModel } from '../../auth/repositories/models/request-rate-limit-log.model';
import { RecoveryCodeDataModel } from '../../auth/repositories/models/recovery-code-data.model';
import { CommentLikeDataModel } from '../../comments/repositories/models/comment-like-data.model';

/*Объект для работы с MongoDB.*/
export const db = {
  /*Метод для подключения к серверу MongoDB.*/
  async runDB(url: string, dbName: string): Promise<void> {
    try {
      /*Присоединяемся к серверу MongoDB и проверяем соединение.*/
      await mongoose.connect(url, { dbName });
      await mongoose.connection.db?.command({ ping: 1 });

      /*При помощи метода "syncIndexes()" создаем и обновляем индексы в БД на основе метаданных об индексах, указанных в
      схемах. Если в схеме не было указано индексов, то метод "syncIndexes()" ничего не сделает.*/
      await Promise.all([
        BlogModel.syncIndexes(),
        PostModel.syncIndexes(),
        CommentModel.syncIndexes(),
        UserModel.syncIndexes(),
        EmailConfirmationModel.syncIndexes(),
        SessionModel.syncIndexes(),
        SecurityDeviceModel.syncIndexes(),
        RequestRateLimitLogModel.syncIndexes(),
        RecoveryCodeDataModel.syncIndexes(),
        CommentLikeDataModel.syncIndexes(),
      ]);
    } catch (error: unknown) {
      await mongoose.disconnect();
      throw new Error(`❌ Cannot connect to a MongoDB server: ${error}`);
    }
  },

  /*Метод для отключения от сервера MongoDB.*/
  async stopDB(): Promise<void> {
    await mongoose.disconnect();
    // console.log('✅ Connection successfully closed');
  },

  /*Метод для очистки коллекций в БД.*/
  async dropDB(): Promise<void> {
    try {
      /*Очищаем коллекции.*/
      await Promise.all([
        BlogModel.deleteMany({}),
        PostModel.deleteMany({}),
        CommentModel.deleteMany({}),
        UserModel.deleteMany({}),
        EmailConfirmationModel.deleteMany({}),
        SessionModel.deleteMany({}),
        SecurityDeviceModel.deleteMany({}),
        RequestRateLimitLogModel.deleteMany({}),
        RecoveryCodeDataModel.deleteMany({}),
        CommentLikeDataModel.deleteMany({}),
      ]);

      /*Удаляем коллекции и индексы.*/
      await mongoose.connection.dropDatabase();
    } catch (error: unknown) {
      console.error(`❌ Error while dropping DB: ${error}`);
      await this.stopDB();
    }
  },
};
