import { Express } from 'express';
import request from 'supertest';
import { HttpStatuses } from '../../../src/core/types/http-statuses.type';
import { PaginatedBlogListOutputDTO } from '../../../src/blogs/routes/output-dto/paginated-blog-list.output-dto';
import { SETTINGS } from '../../../src/core/settings/settings';

export const getBlogList = async (
  app: Express,
  urlWithPagination?: string,
  expectedStatus?: HttpStatuses
): Promise<PaginatedBlogListOutputDTO> => {
  const url: string = urlWithPagination ?? `${SETTINGS.BLOGS_PATH}${SETTINGS.GET_BLOG_LIST_PATH}`;
  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.Ok_200;
  const getBlogListResponse = await request(app).get(url).expect(testStatus);
  return getBlogListResponse.body;
};
