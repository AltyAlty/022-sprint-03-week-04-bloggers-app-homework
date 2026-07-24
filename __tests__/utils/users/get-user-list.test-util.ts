import { Express } from 'express';
import request from 'supertest';
import { HttpStatuses } from '../../../src/core/types/http-statuses.type';
import { PaginatedUserListOutputDTO } from '../../../src/users/routes/output-dto/paginated-user-list.output-dto';
import { generateBasicAuthToken } from '../auth/generate-admin-auth-token.test-util';
import { SETTINGS } from '../../../src/core/settings/settings';

export const getUserList = async (
  app: Express,
  urlWithPagination?: string,
  expectedStatus?: HttpStatuses,
  basicAuthToken?: string
): Promise<PaginatedUserListOutputDTO> => {
  const url: string = urlWithPagination ?? `${SETTINGS.USERS_PATH}${SETTINGS.GET_USER_LIST_PATH}`;
  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.Ok_200;
  const testBasicAuthToken: string = basicAuthToken ?? generateBasicAuthToken();
  const getUserListResponse = await request(app).get(url).set('Authorization', testBasicAuthToken).expect(testStatus);
  return getUserListResponse.body;
};
