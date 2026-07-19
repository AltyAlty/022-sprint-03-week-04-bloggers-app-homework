import { Express } from 'express';
import request from 'supertest';
import { SETTINGS } from '../../../src/core/settings/settings';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { LikeCommentByIdInputDTO } from '../../../src/comments/routes/input-dto/like-comment-by-id.input-dto';

export const likeCommentById = async (
  app: Express,
  userAgent: string | any,
  accessToken: string | any,
  commentId: string | any,
  likeCommentDTO: LikeCommentByIdInputDTO | any,
  expectedStatus?: HttpStatuses,
  noUserAgent?: boolean,
  noAccessToken?: boolean
): Promise<any> => {
  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.NoContent_204;
  let likeCommentByIdResponse;

  if (noUserAgent) {
    if (noAccessToken) {
      likeCommentByIdResponse = await request(app)
        .put(`${SETTINGS.COMMENTS_PATH}/${commentId}/like-status`)
        .send(likeCommentDTO)
        .expect(testStatus);
    } else {
      likeCommentByIdResponse = await request(app)
        .put(`${SETTINGS.COMMENTS_PATH}/${commentId}/like-status`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(likeCommentDTO)
        .expect(testStatus);
    }
  } else {
    if (noAccessToken) {
      likeCommentByIdResponse = await request(app)
        .put(`${SETTINGS.COMMENTS_PATH}/${commentId}/like-status`)
        .set('User-Agent', userAgent)
        .send(likeCommentDTO)
        .expect(testStatus);
    } else {
      likeCommentByIdResponse = await request(app)
        .put(`${SETTINGS.COMMENTS_PATH}/${commentId}/like-status`)
        .set('User-Agent', userAgent)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(likeCommentDTO)
        .expect(testStatus);
    }
  }

  return likeCommentByIdResponse.body;
};
