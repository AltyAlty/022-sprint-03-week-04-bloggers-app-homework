import { Express } from 'express';
import request from 'supertest';
import { HttpStatuses } from '../../../src/core/types/http-statuses.type';
import { PostOutputDTO } from '../../../src/posts/routes/output-dto/post.output-dto';
import { SETTINGS } from '../../../src/core/settings/settings';

export const getPostById = async (
  app: Express,
  userAgent: string | any,
  postId: string | any,
  accessToken?: string | any,
  expectedStatus?: HttpStatuses,
  noUserAgent?: boolean,
  noAccessToken?: boolean
): Promise<PostOutputDTO> => {
  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.Ok_200;

  let getPostByIdResponse;

  if (noUserAgent) {
    if (noAccessToken) {
      getPostByIdResponse = await request(app).get(`${SETTINGS.POSTS_PATH}/${postId}`).expect(testStatus);
    } else {
      getPostByIdResponse = await request(app)
        .get(`${SETTINGS.POSTS_PATH}/${postId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(testStatus);
    }
  } else {
    if (noAccessToken) {
      getPostByIdResponse = await request(app)
        .get(`${SETTINGS.POSTS_PATH}/${postId}`)
        .set('User-Agent', userAgent)
        .expect(testStatus);
    } else {
      getPostByIdResponse = await request(app)
        .get(`${SETTINGS.POSTS_PATH}/${postId}`)
        .set('User-Agent', userAgent)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(testStatus);
    }
  }

  return getPostByIdResponse.body;
};
