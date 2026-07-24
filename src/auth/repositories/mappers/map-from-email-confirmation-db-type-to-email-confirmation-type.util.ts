import { EmailConfirmationType } from '../../application/types/email-сonfirmation.type';
import { EmailConfirmationDBType } from '../types/email-сonfirmation-db.type';

/*Функция для преобразования данных о подтверждении регистрации пользователя из БД в подготовленные для работы внутри
приложения данные о подтверждении регистрации пользователя.*/
export const mapFromEmailConfirmationDBTypeToEmailConfirmationType = (
  emailConfirmation: EmailConfirmationDBType
): EmailConfirmationType => {
  return {
    userId: emailConfirmation.userId,
    confirmationCode: emailConfirmation.confirmationCode,
    expirationDate: emailConfirmation.expirationDate,
  };
};
