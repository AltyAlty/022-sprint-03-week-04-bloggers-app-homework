import { WithId } from 'mongodb';
import { SessionType } from '../../application/types/session.type';

/*Тип для сессии в БД.*/
export type SessionDBType = WithId<SessionType>;
