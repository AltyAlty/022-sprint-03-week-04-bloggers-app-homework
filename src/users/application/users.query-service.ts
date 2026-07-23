import { UsersQueryRepository } from '../repositories/users.query-repository';
import { GetUserListQueryInputDTO } from '../routes/input-dto/query/get-user-list-query.input-dto';
import { mapFromUserListDBTypeToPaginatedUserListOutputDTO } from '../repositories/mappers/map-from-user-list-db-type-to-paginated-user-list-output-dto.util';
import { PaginatedUserListOutputDTO } from '../routes/output-dto/paginated-user-list.output-dto';
import { mapFromUserDBTypeToUserOutputDTO } from '../repositories/mappers/map-from-user-db-type-to-user-output-dto.util';
import { UserOutputDTO } from '../routes/output-dto/user.output-dto';
import { Result } from '../../core/types/result/result.type';
import { ResultStatuses } from '../../core/types/result/result-statuses';
import { UserDBType } from '../repositories/types/user-db.type';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../ioc/types';
import { UserListDBType } from '../repositories/types/user-list-db.type';

/*Query-сервис для работы с пользователями.*/
@injectable()
export class UsersQueryService {
  constructor(@inject(TYPES.UsersQueryRepository) private readonly usersQueryRepository: UsersQueryRepository) {}

  /*Метод для поиска пользователя по ID.*/
  public async findById(id: string): Promise<Result<{ userOutput: UserOutputDTO } | null>> {
    /*Просим query-репозиторий "usersQueryRepository" найти пользователя по ID в БД.*/
    const userDB: UserDBType | null = await this.usersQueryRepository.findById(id);

    /*Если пользователь не был найден, то возвращаем ResultObject с информацией об этом.*/
    if (!userDB) {
      return {
        status: ResultStatuses.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'id', message: 'User not found' }],
      };
    }

    /*Если пользователь был найден, то преобразовываем пользователя из БД в подготовленного для отправки клиенту
    пользователя.*/
    const userOutput: UserOutputDTO = mapFromUserDBTypeToUserOutputDTO(userDB);
    /*Возвращаем ResultObject с преобразованным пользователем.*/
    return { status: ResultStatuses.Ok, data: { userOutput }, extensions: [] };
  }

  /*Метод для поиска пользователей.*/
  public async findAll(
    queryDTO: GetUserListQueryInputDTO
  ): Promise<Result<{ paginatedUserListOutput: PaginatedUserListOutputDTO }>> {
    /*Просим query-репозиторий "usersQueryRepository" найти пользователей в БД.*/
    const { items, totalCount }: { items: UserListDBType; totalCount: number } =
      await this.usersQueryRepository.findAll(queryDTO);

    /*Преобразовываем пользователей из БД в подготовленных для отправки клиенту с пагинацией пользователей.*/
    const paginatedUserListOutput: PaginatedUserListOutputDTO = mapFromUserListDBTypeToPaginatedUserListOutputDTO(
      items,
      { pageNumber: queryDTO.pageNumber, pageSize: queryDTO.pageSize, totalCount }
    );

    /*Возвращаем ResultObject с преобразованными пользователями.*/
    return { status: ResultStatuses.Ok, data: { paginatedUserListOutput }, extensions: [] };
  }
}
