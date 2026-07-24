import { Express } from 'express';
import request from 'supertest';
import { HttpStatuses } from '../../../src/core/types/http-statuses.type';
import { BlogOutputDTO } from '../../../src/blogs/routes/output-dto/blog.output-dto';
import { SETTINGS } from '../../../src/core/settings/settings';

export const getBlogById = async (
  app: Express,
  blogId: string | any,
  expectedStatus?: HttpStatuses
): Promise<BlogOutputDTO> => {
  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.Ok_200;
  const getBlogByIdResponse = await request(app).get(`${SETTINGS.BLOGS_PATH}/${blogId}`).expect(testStatus);
  return getBlogByIdResponse.body;
};
