import { UserListDBType } from '../types/user-list-db.type';
import { PaginatedUserListOutputDTO } from '../../routes/output-dto/paginated-user-list.output-dto';
import { UserOutputDTO } from '../../routes/output-dto/user.output-dto';

/*Функция для преобразования пользователей из БД в подготовленных для отправки клиенту с пагинацией пользователей.*/
export const mapFromUserListDBTypeToPaginatedUserListOutputDTO = (
  users: UserListDBType,
  meta: { pageNumber: number; pageSize: number; totalCount: number }
): PaginatedUserListOutputDTO => {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: users.map((user): UserOutputDTO => ({
      id: user._id.toString(),
      login: user.login,
      email: user.originalEmail,
      createdAt: user.createdAt,
    })),
  };
};
