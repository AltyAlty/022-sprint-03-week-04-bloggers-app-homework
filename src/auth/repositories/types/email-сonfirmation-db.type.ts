import { WithId } from 'mongodb';
import { EmailConfirmationType } from '../../application/types/email-сonfirmation.type';

/*Тип для данных о подтверждении регистрации пользователя в БД.*/
export type EmailConfirmationDBType = WithId<EmailConfirmationType>;
