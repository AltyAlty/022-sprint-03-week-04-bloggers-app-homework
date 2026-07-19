import { Express } from 'express';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import request from 'supertest';
import { SETTINGS } from '../../../src/core/settings/settings';

export const deleteCommentById = async (
  app: Express,
  userAgent: string | any,
  commentId: string | any,
  accessToken: string | any,
  expectedStatus?: HttpStatuses,
  noUserAgent?: boolean,
  noAccessToken?: boolean
): Promise<any> => {
  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.NoContent_204;
  let deleteCommentByIdResponse;

  if (noUserAgent) {
    if (noAccessToken) {
      deleteCommentByIdResponse = await request(app)
        .delete(`${SETTINGS.COMMENTS_PATH}/${commentId}`)
        .expect(testStatus);
    } else {
      deleteCommentByIdResponse = await request(app)
        .delete(`${SETTINGS.COMMENTS_PATH}/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(testStatus);
    }
  } else {
    if (noAccessToken) {
      deleteCommentByIdResponse = await request(app)
        .delete(`${SETTINGS.COMMENTS_PATH}/${commentId}`)
        .set('User-Agent', userAgent)
        .expect(testStatus);
    } else {
      deleteCommentByIdResponse = await request(app)
        .delete(`${SETTINGS.COMMENTS_PATH}/${commentId}`)
        .set('User-Agent', userAgent)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(testStatus);
    }
  }

  return deleteCommentByIdResponse.body;
};
