import { WithId } from 'mongodb';
import { RequestRateLimitLogType } from '../../application/types/request-rate-limit-log.type';

/*Тип для записи в журнале лимитов запросов ВБД.*/
export type RequestRateLimitLogDBType = WithId<RequestRateLimitLogType>;
