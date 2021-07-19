import request from 'supertest';
import app from '@app';
import { factory } from 'typeorm-seeding';
import { User } from '@entities/user.entity';
import { API } from '../../utils';
import { ErrorsMessages } from '@constants/errorMessages';
import { HttpStatusCode } from '@constants/httpStatusCode';

describe('creating an account', () => {
  it('returns http code 200 with valid params', async () => {
    const userFields = await factory(User)().make();
    const response = await request(app)
      .post(`${API}/auth/signup`)
      .send(userFields);
    expect(response.status).toBe(200);
  });

  it('returns http code 400 with invalid params', async () => {
    const userFields = {};
    const response = await request(app)
      .post(`${API}/auth/signup`)
      .send(userFields);
    expect(response.status).toBe(400);
  });

  it('returns http code 400 with 4 errors on the errors field', async () => {
    const userFields = {};
    const response = await request(app)
      .post(`${API}/auth/signup`)
      .send(userFields);
    expect(response.body).toStrictEqual({
      description: ErrorsMessages.BODY_ERRORS,
      errors: [
        'Property firstName must be a string',
        'Property lastName must be a string',
        'Property email must be an email',
        ErrorsMessages.PASSWORD_ERROR
      ],
      httpCode: HttpStatusCode.BAD_REQUEST,
      name: 'Bad request error'
    });
    expect(response.body.errors).toHaveLength(4);
  });
});
