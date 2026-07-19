import { Express } from 'express';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { SETTINGS } from '../../../src/core/settings/settings';
import request from 'supertest';
import { PaginatedCommentListOutputDTO } from '../../../src/comments/routes/output-dto/paginated-comment-list.output-dto';

export const getCommentListByPostId = async (
  app: Express,
  userAgent: string | any,
  postId: any,
  urlWithPagination?: string,
  accessToken?: string | any,
  expectedStatus?: HttpStatuses,
  noUserAgent?: boolean,
  noAccessToken?: boolean
): Promise<PaginatedCommentListOutputDTO> => {
  const url: string = urlWithPagination ?? `${SETTINGS.POSTS_PATH}/${postId}/comments`;
  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.Ok_200;
  let getCommentListByPostIdResponse;

  if (noUserAgent) {
    if (noAccessToken) {
      getCommentListByPostIdResponse = await request(app).get(url).expect(testStatus);
    } else {
      getCommentListByPostIdResponse = await request(app)
        .get(url)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(testStatus);
    }
  } else {
    if (noAccessToken) {
      getCommentListByPostIdResponse = await request(app).get(url).set('User-Agent', userAgent).expect(testStatus);
    } else {
      getCommentListByPostIdResponse = await request(app)
        .get(url)
        .set('User-Agent', userAgent)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(testStatus);
    }
  }

  return getCommentListByPostIdResponse.body;
};
