import { SecurityDeviceType } from '../application/types/security-device.type';
import { DeleteResult } from 'mongodb';
import { SecurityDeviceDBType } from './types/security-device-db.type';
import { injectable } from 'inversify';
import { SecurityDeviceModel } from './models/security-device.model';
import { HydratedDocument } from 'mongoose';

/*Репозиторий для работы с устройствами пользователей в БД.*/
@injectable()
export class SecurityDevicesRepository {
  /*Метод для добавления устройства пользователя в БД.*/
  public async create(newSecurityDevice: SecurityDeviceType): Promise<string> {
    /*Просим модель "SecurityDeviceModel" создать устройство пользователя в БД.*/
    const securityDevice: HydratedDocument<SecurityDeviceType> = new SecurityDeviceModel(newSecurityDevice);
    await securityDevice.save();
    /*Возвращаем ID созданного устройства пользователя.*/
    return securityDevice.deviceId;
  }

  /*Метод для поиска устройства пользователя по ID в БД.*/
  public async findById(id: string): Promise<SecurityDeviceDBType | null> {
    /*Просим модель "SecurityDeviceModel" найти устройство пользователя по ID в БД.*/
    const securityDevice: SecurityDeviceDBType | null = await SecurityDeviceModel.findOne({
      deviceId: id,
    }).lean();

    /*Если устройство пользователя было найдено, то возвращаем его, иначе возвращаем null.*/
    return securityDevice ?? null;
  }

  /*Метод для изменения устройства пользователя по ID в БД.*/
  public async updateById(id: string, ip: string, lastActiveDate: Date): Promise<number> {
    /*Просим модель "SecurityDeviceModel" найти устройство пользователя по ID в БД.*/
    const securityDevice: HydratedDocument<SecurityDeviceType> | null = await SecurityDeviceModel.findOne({
      deviceId: id,
    });

    /*Если устройство пользователя не было найдено, то сообщаем, что оно не было изменено.*/
    if (!securityDevice) return 0;
    /*Если устройство пользователя было найдено, то изменяем его в БД.*/
    securityDevice.ip = ip;
    securityDevice.lastActiveDate = lastActiveDate;
    await securityDevice.save();
    /*Сообщаем, что устройство пользователя было изменено.*/
    return 1;
  }

  /*Метод для удаления устройства пользователя по ID устройства в БД.*/
  public async deleteById(id: string): Promise<number> {
    /*Просим модель "SecurityDeviceModel" удалить устройство пользователя по ID в БД.*/
    const result: DeleteResult = await SecurityDeviceModel.deleteOne({ deviceId: id });
    /*Возвращаем количество удаленных устройств пользователя.*/
    return result.deletedCount;
  }

  /*Метод для удаления всех устройств пользователя, кроме текущего, в БД.*/
  public async deleteAllExceptCurrentDevice(id: string): Promise<number> {
    /*Просим модель "SecurityDeviceModel" удалить все устройства пользователя, кроме текущего, в БД.*/
    const result: DeleteResult = await SecurityDeviceModel.deleteMany({ deviceId: { $ne: id } });
    /*Возвращаем количество удаленных устройств пользователя.*/
    return result.deletedCount ?? 0;
  }

  /*Метод для удаления всех устройств пользователя по ID пользователя в БД.*/
  public async deleteAllByUserId(userId: string): Promise<number> {
    /*Просим модель "SecurityDeviceModel" удалить все устройства пользователя по ID пользователя в БД.*/
    const result: DeleteResult = await SecurityDeviceModel.deleteMany({ userId });
    /*Возвращаем количество удаленных устройств пользователя.*/
    return result.deletedCount ?? 0;
  }
}
