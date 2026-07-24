import { db } from '../../db/mongodb/mongo.db';
import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { HttpStatuses } from '../../core/types/http-statuses.type';
import { errorsHandler } from '../../core/errors/errors-handler.util';

/*Контроллер для тестирования приложения.*/
@injectable()
export class TestingController {
  /*Метод-обработчик для DELETE-запросов по очистке БД для целей тестирования.*/
  public async clearDBHandler(req: Request, res: Response): Promise<void | Response> {
    try {
      /*Очищаем коллекции.*/
      await db.dropDB();
      /*Сообщаем об очистке БД клиенту.*/
      return res.sendStatus(HttpStatuses.NoContent_204);
    } catch (error: unknown) {
      /*Если была перехвачена ошибка, то обрабатываем ее.*/
      return errorsHandler(error, res);
    }
  }
}
