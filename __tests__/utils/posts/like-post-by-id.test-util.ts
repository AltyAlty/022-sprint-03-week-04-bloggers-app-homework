import { Express } from 'express';
import request from 'supertest';
import { HttpStatuses } from '../../../src/core/types/http-statuses.type';
import { LikePostByIdInputDTO } from '../../../src/posts/routes/input-dto/like-post-by-id.input-dto';
import { SETTINGS } from '../../../src/core/settings/settings';

export const likePostById = async (
  app: Express,
  userAgent: string | any,
  accessToken: string | any,
  postId: string | any,
  likePostDTO: LikePostByIdInputDTO | any,
  expectedStatus?: HttpStatuses,
  noUserAgent?: boolean,
  noAccessToken?: boolean
): Promise<any> => {
  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.NoContent_204;
  let likePostByIdResponse;

  if (noUserAgent) {
    if (noAccessToken) {
      likePostByIdResponse = await request(app)
        .put(`${SETTINGS.POSTS_PATH}/${postId}/like-status`)
        .send(likePostDTO)
        .expect(testStatus);
    } else {
      likePostByIdResponse = await request(app)
        .put(`${SETTINGS.POSTS_PATH}/${postId}/like-status`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(likePostDTO)
        .expect(testStatus);
    }
  } else {
    if (noAccessToken) {
      likePostByIdResponse = await request(app)
        .put(`${SETTINGS.POSTS_PATH}/${postId}/like-status`)
        .set('User-Agent', userAgent)
        .send(likePostDTO)
        .expect(testStatus);
    } else {
      likePostByIdResponse = await request(app)
        .put(`${SETTINGS.POSTS_PATH}/${postId}/like-status`)
        .set('User-Agent', userAgent)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(likePostDTO)
        .expect(testStatus);
    }
  }

  return likePostByIdResponse.body;
};
