import { Response } from 'express';
import { HttpStatuses } from '../types/http-statuses';
import { DomainError } from './domain.error';
import { createErrorMessages } from '../middlewares/validation/input-validation-result.middleware';

/*Функция для перехвата ошибок в UI слое.*/
export const errorsHandler = (error: any, res: Response): void | Response => {
  /*Если перехваченная ошибка является ошибкой, когда к сущности нельзя применить какую-то операцию в BLL, то
  сообщаем об этом клиенту.*/
  if (error instanceof DomainError) {
    return res
      .status(HttpStatuses.UnprocessableEntity_422)
      .send(createErrorMessages([{ field: error.code, message: error.message }]));
  }

  if (error.code === 11000) {
    return res
      .status(HttpStatuses.UnprocessableEntity_422)
      .send(createErrorMessages([{ field: error.code, message: 'User with the same credentials already exists' }]));
  }

  /*Если же перехваченная ошибка является ошибкой какого-то другого типа, то сообщаем об этом клиенту.*/
  console.log('HERE');
  console.log(error);
  return res.status(HttpStatuses.InternalServerError_500).json(error);
};
