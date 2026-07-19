import { Filter } from 'mongodb';
import { UserType } from '../application/types/user.type';
import { GetUserListQueryInputDTO } from '../routes/input-dto/query/get-user-list-query.input-dto';
import { SortDirection } from '../../core/types/pagination/sort-direction';
import { UserSortFieldQueryInputDTO } from '../routes/input-dto/query/user-sort-field-query.input-dto';
import { UserDBType } from './types/user-db.type';
import { injectable } from 'inversify';
import { UserListDBType } from './types/user-list-db.type';
import { UserModel } from './models/user.model';

/*Query-репозиторий для работы с пользователями в БД.*/
@injectable()
export class UsersQueryRepository {
  /*Метод для поиска пользователя по ID в БД.*/
  public async findById(id: string): Promise<UserDBType | null> {
    /*Просим модель "UserModel" найти пользователя по ID в БД.*/
    const user: UserDBType | null = await UserModel.findById(id).lean();
    /*Если пользователь был найден, то возвращаем его, иначе null.*/
    return user ?? null;
  }

  /*Метод для поиска пользователей в БД.*/
  public async findAll(queryDTO: GetUserListQueryInputDTO): Promise<{ items: UserListDBType; totalCount: number }> {
    /*Создаем переменные на основе параметра "queryDTO" при помощи деструктуризации.*/
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
    }: {
      pageNumber: number;
      pageSize: number;
      sortBy: UserSortFieldQueryInputDTO;
      sortDirection: SortDirection;
      searchLoginTerm?: string | undefined;
      searchEmailTerm?: string | undefined;
    } = queryDTO;

    /*Переменная "skip" обозначает сколько записей надо пропустить перед тем, как начать отдавать запрошенную страницу
    "pageNumber".*/
    const skip: number = (pageNumber - 1) * pageSize;
    /*Динамически собираем фильтр для поиска в MongoDB. В итоге фильтр будет работать так: для получения пользователя
    нужно совпадение хотя бы по одному полю в фильтре, а не по всем сразу.*/
    const conditions: Filter<UserType>[] = [];
    if (searchLoginTerm) conditions.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
    if (searchEmailTerm) conditions.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
    const filter: Filter<UserType> = conditions.length > 0 ? { $or: conditions } : {};

    /*Просим модель "UserModel" найти пользователей в БД и подсчитать общее количество документов, подходящих под
    фильтр, без учета пагинации.*/
    const [items, totalCount]: [UserListDBType, number] = await Promise.all([
      UserModel.find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      UserModel.countDocuments(filter),
    ]);

    /*Возвращаем данные по пользователям.*/
    return { items, totalCount };
  }
}
