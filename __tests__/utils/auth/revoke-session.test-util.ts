import { Express } from 'express';
import { SETTINGS } from '../../../src/core/settings/settings';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import request from 'supertest';

export const revokeSession = async (
  app: Express,
  userAgent: string | any,
  refreshToken?: string | any,
  refreshTokenCookieString?: string | any,
  expectedStatus?: HttpStatuses,
  noUserAgent?: boolean,
  noRefreshToken?: boolean
): Promise<any> => {
  const testRefreshTokenCookieString: string =
    refreshTokenCookieString ?? `refreshToken=${refreshToken}; Path=/; HttpOnly; Secure`;

  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.NoContent_204;
  let revokeRefreshTokenResponse;

  if (noUserAgent) {
    if (noRefreshToken) {
      revokeRefreshTokenResponse = await request(app)
        .post(`${SETTINGS.AUTH_PATH}${SETTINGS.LOGOUT_PATH}`)
        .expect(testStatus);
    } else {
      revokeRefreshTokenResponse = await request(app)
        .post(`${SETTINGS.AUTH_PATH}${SETTINGS.LOGOUT_PATH}`)
        .set('Cookie', testRefreshTokenCookieString)
        .expect(testStatus);
    }
  } else {
    if (noRefreshToken) {
      revokeRefreshTokenResponse = await request(app)
        .post(`${SETTINGS.AUTH_PATH}${SETTINGS.LOGOUT_PATH}`)
        .set('User-Agent', userAgent)
        .expect(testStatus);
    } else {
      revokeRefreshTokenResponse = await request(app)
        .post(`${SETTINGS.AUTH_PATH}${SETTINGS.LOGOUT_PATH}`)
        .set('User-Agent', userAgent)
        .set('Cookie', testRefreshTokenCookieString)
        .expect(testStatus);
    }
  }

  return revokeRefreshTokenResponse.body;
};
