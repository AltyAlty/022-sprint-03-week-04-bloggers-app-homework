import mongoose from 'mongoose';
import { EmailConfirmationModel } from '../../auth/repositories/models/email-confirmation.model';
import { RecoveryCodeDataModel } from '../../auth/repositories/models/recovery-code-data.model';
import { RequestRateLimitLogModel } from '../../auth/repositories/models/request-rate-limit-log.model';
import { SessionModel } from '../../auth/repositories/models/session.model';
import { BlogModel } from '../../blogs/repositories/models/blog.model';
import { CommentModel } from '../../comments/repositories/models/comment.model';
import { CommentLikeDataModel } from '../../comments/repositories/models/comment-like-data.model';
import { PostModel } from '../../posts/repositories/models/post.model';
import { PostLikeDataModel } from '../../posts/repositories/models/post-like-data.model';
import { SecurityDeviceModel } from '../../security-devices/repositories/models/security-device.model';
import { UserModel } from '../../users/repositories/models/user.model';

/*Объект для работы с MongoDB.*/
export const db = {
  /*Метод для подключения к серверу MongoDB.*/
  async runDB(url: string, dbName: string): Promise<void> {
    try {
      /*Присоединяемся к серверу MongoDB и проверяем соединение.*/
      await mongoose.connect(url, { dbName });

      /*Создаем и обновляем индексы в БД на основе метаданных об индексах, указанных в схемах.*/
      await Promise.all([
        BlogModel.syncIndexes(),
        PostModel.syncIndexes(),
        PostLikeDataModel.syncIndexes(),
        CommentModel.syncIndexes(),
        CommentLikeDataModel.syncIndexes(),
        UserModel.syncIndexes(),
        SecurityDeviceModel.syncIndexes(),
        SessionModel.syncIndexes(),
        EmailConfirmationModel.syncIndexes(),
        RecoveryCodeDataModel.syncIndexes(),
        RequestRateLimitLogModel.syncIndexes(),
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
        PostLikeDataModel.deleteMany({}),
        CommentModel.deleteMany({}),
        CommentLikeDataModel.deleteMany({}),
        UserModel.deleteMany({}),
        SecurityDeviceModel.deleteMany({}),
        SessionModel.deleteMany({}),
        EmailConfirmationModel.deleteMany({}),
        RecoveryCodeDataModel.deleteMany({}),
        RequestRateLimitLogModel.deleteMany({}),
      ]);

      /*Удаляем коллекции и индексы.*/
      await mongoose.connection.dropDatabase();
    } catch (error: unknown) {
      console.error(`❌ Error while dropping DB: ${error}`);
      await this.stopDB();
    }
  },
};
