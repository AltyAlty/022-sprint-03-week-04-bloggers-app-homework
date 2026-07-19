import { RequestRateLimitLogType } from '../../application/types/request-rate-limit-log.type';
import { WithId } from 'mongodb';

/*Тип для записи в журнале лимитов запросов ВБД.*/
export type RequestRateLimitLogDBType = WithId<RequestRateLimitLogType>;
