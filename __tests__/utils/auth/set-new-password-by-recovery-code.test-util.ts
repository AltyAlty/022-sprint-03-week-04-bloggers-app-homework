import { Express } from 'express';
import request from 'supertest';
import { HttpStatuses } from '../../../src/core/types/http-statuses.type';
import { settingNewPasswordByRecoveryCodeInputDTO } from '../../../src/auth/routes/input-dto/setting-new-password-by-recovery-code.input-dto';
import { SETTINGS } from '../../../src/core/settings/settings';

export const setNewPasswordByRecoveryCode = async (
  app: Express,
  userAgent: string | any,
  newPasswordDTO: settingNewPasswordByRecoveryCodeInputDTO | any,
  expectedStatus?: HttpStatuses,
  noUserAgent?: boolean
): Promise<any> => {
  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.NoContent_204;
  let setNewPasswordByRecoveryCodeResponse;

  if (noUserAgent) {
    setNewPasswordByRecoveryCodeResponse = await request(app)
      .post(`${SETTINGS.AUTH_PATH}${SETTINGS.SET_NEW_PASSWORD_BY_RECOVERY_CODE_PATH}`)
      .send(newPasswordDTO)
      .expect(testStatus);
  } else {
    setNewPasswordByRecoveryCodeResponse = await request(app)
      .post(`${SETTINGS.AUTH_PATH}${SETTINGS.SET_NEW_PASSWORD_BY_RECOVERY_CODE_PATH}`)
      .set('User-Agent', userAgent)
      .send(newPasswordDTO)
      .expect(testStatus);
  }

  return setNewPasswordByRecoveryCodeResponse.body;
};
