import { CreateCommentForPostInputDTO } from '../../../src/comments/routes/input-dto/create-comment-for-post.input-dto';
import { Express } from 'express';
import { CommentOutputDTO } from '../../../src/comments/routes/output-dto/comment.output-dto';
import { getCreateCommentForPostInputDTO } from '../comments/input-dto-utils/get-create-comment-for-post-input-dto.test-util';
import request from 'supertest';
import { SETTINGS } from '../../../src/core/settings/settings';
import { HttpStatuses } from '../../../src/core/types/http-statuses';

export const createCommentForPost = async (
  app: Express,
  userAgent: string | any,
  postId: string | any,
  accessToken: string | any,
  commentDTO?: CreateCommentForPostInputDTO | any,
  expectedStatus?: HttpStatuses,
  noUserAgent?: boolean,
  noAccessToken?: boolean
): Promise<CommentOutputDTO> => {
  const testCreateCommentData: CreateCommentForPostInputDTO = { ...getCreateCommentForPostInputDTO(), ...commentDTO };
  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.Created_201;
  let createCommentForPostResponse;

  if (noUserAgent) {
    if (noAccessToken) {
      createCommentForPostResponse = await request(app)
        .post(`${SETTINGS.POSTS_PATH}/${postId}/comments`)
        .send(testCreateCommentData)
        .expect(testStatus);
    } else {
      createCommentForPostResponse = await request(app)
        .post(`${SETTINGS.POSTS_PATH}/${postId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(testCreateCommentData)
        .expect(testStatus);
    }
  } else {
    if (noAccessToken) {
      createCommentForPostResponse = await request(app)
        .post(`${SETTINGS.POSTS_PATH}/${postId}/comments`)
        .set('User-Agent', userAgent)
        .send(testCreateCommentData)
        .expect(testStatus);
    } else {
      createCommentForPostResponse = await request(app)
        .post(`${SETTINGS.POSTS_PATH}/${postId}/comments`)
        .set('User-Agent', userAgent)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(testCreateCommentData)
        .expect(testStatus);
    }
  }

  return createCommentForPostResponse.body;
};
