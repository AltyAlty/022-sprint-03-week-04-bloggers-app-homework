import { Express } from 'express';
import request from 'supertest';
import { HttpStatuses } from '../../../src/core/types/http-statuses.type';
import { PostOutputDTO } from '../../../src/posts/routes/output-dto/post.output-dto';
import { SETTINGS } from '../../../src/core/settings/settings';

export const getPostById = async (
  app: Express,
  postId: string | any,
  expectedStatus?: HttpStatuses
): Promise<PostOutputDTO> => {
  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.Ok_200;
  const getPostByIdResponse = await request(app).get(`${SETTINGS.POSTS_PATH}/${postId}`).expect(testStatus);
  return getPostByIdResponse.body;
};
