import { DeleteResult } from 'mongodb';
import { UserType } from '../application/types/user.type';
import { UserDBType } from './types/user-db.type';
import { injectable } from 'inversify';
import { UserModel } from './models/user.model';
import { HydratedDocument } from 'mongoose';
import { normalizeEmail } from '../../core/utils/email/normalize-email.util';

/*Репозиторий для работы с пользователями в БД.*/
@injectable()
export class UsersRepository {
  /*Метод для добавления пользователя в БД.*/
  public async create(newUser: UserType): Promise<string> {
    /*Просим модель "UserModel" создать пользователя в БД.*/
    const user: HydratedDocument<UserType> = new UserModel(newUser);
    await user.save();
    /*Возвращаем ID созданного пользователя.*/
    return user._id.toString();
  }

  /*Метод для поиска пользователя по ID в БД.*/
  public async findById(id: string): Promise<UserDBType | null> {
    /*Просим модель "UserModel" найти пользователя по ID в БД.*/
    const user: UserDBType | null = await UserModel.findById(id).lean();
    /*Если пользователь был найден, то возвращаем его, иначе null.*/
    return user ?? null;
  }

  /*Метод для поиска пользователя по email в БД.*/
  public async findByEmail(email: string): Promise<UserDBType | null> {
    /*Просим модель "UserModel" найти пользователя по email в БД.*/
    const user: UserDBType | null = await UserModel.findOne({ email }).lean();
    /*Если пользователь был найден, то возвращаем его, иначе null.*/
    return user ?? null;
  }

  /*Метод для поиска пользователя по логину/email в БД.*/
  public async findByLoginOrEmail(loginOrEmail: string): Promise<UserDBType | null> {
    /*Просим модель "UserModel" найти пользователя по логину/email в БД.*/
    const user: UserDBType | null = await UserModel.findOne({
      $or: [{ email: normalizeEmail(loginOrEmail) }, { login: loginOrEmail }],
    }).lean();

    /*Если пользователь был найден, то возвращаем его, иначе null.*/
    return user ?? null;
  }

  /*Метод для подтверждения регистрации пользователя по ID пользователя в БД.*/
  public async confirmById(id: string): Promise<number> {
    /*Просим модель "UserModel" найти пользователя по ID в БД.*/
    const user: HydratedDocument<UserType> | null = await UserModel.findById(id);
    /*Если пользователь не был найден, то сообщаем, что регистрация пользователя не была подтверждена.*/
    if (!user) return 0;
    /*Если пользователь был найден, то подтверждаем регистрацию пользователя в БД.*/
    user.isConfirmed = true;
    await user.save();
    /*Сообщаем, что регистрация пользователя была подтверждена.*/
    return 1;
  }

  /*Метод для изменения хеша для пароля пользователя по ID в БД.*/
  public async updatePasswordHashById(id: string, passwordHash: string): Promise<number> {
    /*Просим модель "UserModel" найти пользователя по ID в БД.*/
    const user: HydratedDocument<UserType> | null = await UserModel.findById(id);
    /*Если пользователь не был найден, то сообщаем, что хеш для пароля пользователя не был изменен.*/
    if (!user) return 0;
    /*Если пользователь был найден, то изменяем хеш для пароля пользователя в БД.*/
    user.passwordHash = passwordHash;
    await user.save();
    /*Сообщаем, что хеш для пароля пользователя был изменен.*/
    return 1;
  }

  /*Метод для удаления пользователя по ID в БД.*/
  public async deleteById(id: string): Promise<number> {
    /*Просим модель "UserModel" удалить пользователя по ID в БД.*/
    const result: DeleteResult = await UserModel.deleteOne({ _id: id });
    /*Возвращаем количество удаленных пользователей.*/
    return result.deletedCount;
  }
}
