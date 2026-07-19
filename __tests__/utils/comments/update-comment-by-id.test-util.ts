import { Express } from 'express';
import request from 'supertest';
import { SETTINGS } from '../../../src/core/settings/settings';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { getUpdateCommentInputDTO } from './input-dto-utils/get-update-comment-input-dto.test-util';
import { UpdateCommentByIdInputDTO } from '../../../src/comments/routes/input-dto/update-comment-by-id.input-dto';

export const updateCommentById = async (
  app: Express,
  userAgent: string | any,
  commentId: string | any,
  accessToken: string | any,
  commentDTO?: UpdateCommentByIdInputDTO | any,
  expectedStatus?: HttpStatuses,
  noUserAgent?: boolean,
  noAccessToken?: boolean
): Promise<any> => {
  const testUpdateCommentData: UpdateCommentByIdInputDTO = { ...getUpdateCommentInputDTO(), ...commentDTO };
  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.NoContent_204;
  let updateCommentByIdResponse;

  if (noUserAgent) {
    if (noAccessToken) {
      updateCommentByIdResponse = await request(app)
        .put(`${SETTINGS.COMMENTS_PATH}/${commentId}`)
        .send(testUpdateCommentData)
        .expect(testStatus);
    } else {
      updateCommentByIdResponse = await request(app)
        .put(`${SETTINGS.COMMENTS_PATH}/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(testUpdateCommentData)
        .expect(testStatus);
    }
  } else {
    if (noAccessToken) {
      updateCommentByIdResponse = await request(app)
        .put(`${SETTINGS.COMMENTS_PATH}/${commentId}`)
        .set('User-Agent', userAgent)
        .send(testUpdateCommentData)
        .expect(testStatus);
    } else {
      updateCommentByIdResponse = await request(app)
        .put(`${SETTINGS.COMMENTS_PATH}/${commentId}`)
        .set('User-Agent', userAgent)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(testUpdateCommentData)
        .expect(testStatus);
    }
  }

  return updateCommentByIdResponse.body;
};
