import { Express } from 'express';
import request from 'supertest';
import { HttpStatuses } from '../../../src/core/types/http-statuses.type';
import { CreateUserInputDTO } from '../../../src/users/routes/input-dto/create-user.input-dto';
import { getCreateUserInputDTO } from '../users/input-dto-utils/get-create-user-input-dto.test-util';
import { SETTINGS } from '../../../src/core/settings/settings';

export const registerUser = async (
  app: Express,
  userAgent: string | any,
  registerDataDTO?: CreateUserInputDTO | any,
  expectedStatus?: HttpStatuses,
  noUserAgent?: boolean
): Promise<any> => {
  const testRegisterData: CreateUserInputDTO = { ...getCreateUserInputDTO(), ...registerDataDTO };
  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.NoContent_204;
  let registerUserResponse;

  if (noUserAgent) {
    registerUserResponse = await request(app)
      .post(`${SETTINGS.AUTH_PATH}${SETTINGS.REGISTER_USER_PATH}`)
      .send(testRegisterData)
      .expect(testStatus);
  } else {
    registerUserResponse = await request(app)
      .post(`${SETTINGS.AUTH_PATH}${SETTINGS.REGISTER_USER_PATH}`)
      .set('User-Agent', userAgent)
      .send(testRegisterData)
      .expect(testStatus);
  }

  return registerUserResponse.body;
};
