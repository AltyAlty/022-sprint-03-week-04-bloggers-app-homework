import { SecurityDeviceListOutputDTO } from '../../routes/output-dto/security-device-list.output-dto';
import { SecurityDeviceOutputDTO } from '../../routes/output-dto/security-device.output-dto';
import { SecurityDeviceListDBType } from '../types/security-device-list-db.type';

/*Функция для преобразования устройств пользователя из БД в подготовленные для отправки клиенту устройства
пользователя.*/
export const mapToSecurityDeviceListOutputDTO = (
  securityDevices: SecurityDeviceListDBType
): SecurityDeviceListOutputDTO => {
  return securityDevices.map((securityDevice): SecurityDeviceOutputDTO => ({
    deviceId: securityDevice.deviceId,
    title: securityDevice.title,
    ip: securityDevice.ip,
    lastActiveDate: securityDevice.lastActiveDate,
  }));
};
