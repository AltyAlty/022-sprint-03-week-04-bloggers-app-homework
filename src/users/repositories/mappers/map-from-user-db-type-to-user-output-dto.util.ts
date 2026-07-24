import { UserDBType } from '../types/user-db.type';
import { UserOutputDTO } from '../../routes/output-dto/user.output-dto';

/*Функция для преобразования пользователя из БД в подготовленного для отправки клиенту пользователя.*/
export const mapFromUserDBTypeToUserOutputDTO = (user: UserDBType): UserOutputDTO => {
  return { id: user._id.toString(), login: user.login, email: user.originalEmail, createdAt: user.createdAt };
};
