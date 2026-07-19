import { injectable } from 'inversify';
import { SecurityDeviceListDBType } from './types/security-device-list-db.type';
import { SecurityDeviceModel } from './models/security-device.model';

/*Query-репозиторий для работы с устройствами пользователей в БД.*/
@injectable()
export class SecurityDevicesQueryRepository {
  /*Метод для поиска устройств пользователя по ID устройств пользователя в БД.*/
  public async findAllByIds(ids: string[]): Promise<SecurityDeviceListDBType> {
    /*Просим модель "SecurityDeviceModel" найти устройства пользователя по ID устройств пользователя в БД.*/
    return await SecurityDeviceModel.find({ deviceId: { $in: ids } }).lean();
  }
}
