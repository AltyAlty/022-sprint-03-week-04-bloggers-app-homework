import { SessionType } from '../../application/types/session.type';
import { SessionListType } from '../../application/types/session-list.type';
import { SessionListDBType } from '../types/session-list-db.type';
import { SessionDBType } from '../types/session-db.type';

/*Функция для преобразования сессий из БД в подготовленные для работы внутри приложения сессии.*/
export const mapFromSessionListDBTypeToSessionListType = (sessions: SessionListDBType): SessionListType => {
  return sessions.map((session: SessionDBType): SessionType => ({
    userId: session.userId,
    deviceId: session.deviceId,
    deviceName: session.deviceName,
    ip: session.ip,
    iat: session.iat,
    exp: session.exp,
  }));
};
