/*Тип для пользователя.*/
export type UserType = {
  login: string;
  email: string;
  originalEmail: string;
  passwordHash: string;
  createdAt: Date;
  isConfirmed: boolean;
};
