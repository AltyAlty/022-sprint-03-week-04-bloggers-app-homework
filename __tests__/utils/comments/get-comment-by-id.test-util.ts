import { CommentOutputDTO } from '../../../src/comments/routes/output-dto/comment.output-dto';
import { Express } from 'express';
import request from 'supertest';
import { SETTINGS } from '../../../src/core/settings/settings';
import { HttpStatuses } from '../../../src/core/types/http-statuses';

export const getCommentById = async (
  app: Express,
  userAgent: string | any,
  commentId: string | any,
  accessToken?: string | any,
  expectedStatus?: HttpStatuses,
  noUserAgent?: boolean,
  noAccessToken?: boolean
): Promise<CommentOutputDTO> => {
  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.Ok_200;
  let getCommentByIdResponse;

  if (noUserAgent) {
    if (noAccessToken) {
      getCommentByIdResponse = await request(app).get(`${SETTINGS.COMMENTS_PATH}/${commentId}`).expect(testStatus);
    } else {
      getCommentByIdResponse = await request(app)
        .get(`${SETTINGS.COMMENTS_PATH}/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(testStatus);
    }
  } else {
    if (noAccessToken) {
      getCommentByIdResponse = await request(app)
        .get(`${SETTINGS.COMMENTS_PATH}/${commentId}`)
        .set('User-Agent', userAgent)
        .expect(testStatus);
    } else {
      getCommentByIdResponse = await request(app)
        .get(`${SETTINGS.COMMENTS_PATH}/${commentId}`)
        .set('User-Agent', userAgent)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(testStatus);
    }
  }

  return getCommentByIdResponse.body;
};
