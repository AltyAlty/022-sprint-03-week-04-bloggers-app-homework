import { Router } from 'express';
import { idValidation } from '../../core/middlewares/validation/params-id-validation.middlewares';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import {
  likeCommentInputValidation,
  updateCommentInputValidation,
} from '../validation/comments-input-validation.middlewares';
import { SETTINGS } from '../../core/settings/settings';
import {
  accessTokenGuardMiddleware,
  commentsController,
  optionalAccessTokenGuardMiddleware,
} from '../../ioc/composition-root';

/*Роутер из Express.js для работы с комментариями.*/
export const commentsRouter: Router = Router({});

/*Конфигурируем роутер "commentsRouter".*/
commentsRouter
  /*001. PUT-запрос по изменению комментария по ID, используя URI-параметры.*/
  .put(
    SETTINGS.UPDATE_COMMENT_BY_ID_PATH,
    accessTokenGuardMiddleware,
    idValidation,
    updateCommentInputValidation,
    inputValidationResultMiddleware,
    commentsController.updateCommentByIdHandler.bind(commentsController)
  )
  /*002. DELETE-запрос по удалению комментария по ID, используя URI-параметры.*/
  .delete(
    SETTINGS.DELETE_COMMENT_BY_ID_PATH,
    accessTokenGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    commentsController.deleteCommentByIdHandler.bind(commentsController)
  )
  /*003. GET-запрос по получению комментария по ID, используя URI-параметры.*/
  .get(
    SETTINGS.GET_COMMENT_BY_ID_PATH,
    optionalAccessTokenGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    commentsController.getCommentByIdHandler.bind(commentsController)
  ) /*004. PUT-запрос по лайку комментария по ID, используя URI-параметры.*/
  .put(
    SETTINGS.LIKE_COMMENT_BY_ID_PATH,
    accessTokenGuardMiddleware,
    idValidation,
    likeCommentInputValidation,
    inputValidationResultMiddleware,
    commentsController.likeCommentByIdHandler.bind(commentsController)
  );
