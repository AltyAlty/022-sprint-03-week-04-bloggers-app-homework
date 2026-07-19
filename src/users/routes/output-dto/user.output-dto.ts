import { UserType } from '../../application/types/user.type';

/*Output DTO для пользователя.*/
export type UserOutputDTO = Omit<UserType, 'passwordHash' | 'isConfirmed' | 'originalEmail'> & { id: string };
