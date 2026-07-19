import { Express } from 'express';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import request from 'supertest';
import { SETTINGS } from '../../../src/core/settings/settings';

export const revokeSessionByDeviceId = async (
  app: Express,
  userAgent: string | any,
  deviceId: string | any,
  refreshToken?: string | any,
  refreshTokenCookieString?: string | any,
  expectedStatus?: HttpStatuses,
  noUserAgent?: boolean,
  noRefreshToken?: boolean
): Promise<any> => {
  const testRefreshTokenCookieString: string =
    refreshTokenCookieString ?? `refreshToken=${refreshToken}; Path=/; HttpOnly; Secure`;

  const testStatus: HttpStatuses = expectedStatus ?? HttpStatuses.NoContent_204;
  let revokeSessionByDeviceIdResponse;

  if (noUserAgent) {
    if (noRefreshToken) {
      revokeSessionByDeviceIdResponse = await request(app)
        .del(`${SETTINGS.SECURITY_DEVICES_PATH}/${deviceId}`)
        .expect(testStatus);
    } else {
      revokeSessionByDeviceIdResponse = await request(app)
        .del(`${SETTINGS.SECURITY_DEVICES_PATH}/${deviceId}`)
        .set('Cookie', testRefreshTokenCookieString)
        .expect(testStatus);
    }
  } else {
    if (noRefreshToken) {
      revokeSessionByDeviceIdResponse = await request(app)
        .del(`${SETTINGS.SECURITY_DEVICES_PATH}/${deviceId}`)
        .set('User-Agent', userAgent)
        .expect(testStatus);
    } else {
      revokeSessionByDeviceIdResponse = await request(app)
        .del(`${SETTINGS.SECURITY_DEVICES_PATH}/${deviceId}`)
        .set('User-Agent', userAgent)
        .set('Cookie', testRefreshTokenCookieString)
        .expect(testStatus);
    }
  }

  return revokeSessionByDeviceIdResponse.body;
};
