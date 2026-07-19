import { body, ValidationChain } from 'express-validator';
import { CommentLikeStatusInputDTO } from '../routes/input-dto/like-comment-by-id.input-dto';

const contentValidation: ValidationChain = body('content')
  .exists()
  .withMessage('Field "content" is required')
  .isString()
  .withMessage('Field "content" must be a string')
  .trim()
  .notEmpty()
  .withMessage('Field "content" must not be empty')
  .isLength({ min: 20, max: 300 })
  .withMessage('Field "content" must be between 20 and 300 characters');

const likeStatusValidation: ValidationChain = body('likeStatus')
  .exists()
  .withMessage('Field "likeStatus" is required')
  .isString()
  .withMessage('Field "likeStatus" must be a string')
  .trim()
  .notEmpty()
  .withMessage('Field "likeStatus" must not be empty')
  .isIn(Object.values(CommentLikeStatusInputDTO))
  .withMessage(`Field "likeStatus" must be one of: ${Object.values(CommentLikeStatusInputDTO).join(', ')}`);

/*Комбинируем вышеуказанные middlewares в один middleware для использования его при проверке запросов по изменению
комментария.*/
export const updateCommentInputValidation = [contentValidation];
/*Комбинируем вышеуказанные middlewares в один middleware для использования его при проверке запросов по созданию
комментария в посте.*/
export const createCommentForPostInputValidation = [contentValidation];
/*Комбинируем вышеуказанные middlewares в один middleware для использования его при проверке запросов по лайку
комментария.*/
export const likeCommentInputValidation = [likeStatusValidation];
