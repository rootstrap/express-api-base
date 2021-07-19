import request from 'supertest';
import { getRepository } from 'typeorm';
import { factory } from 'typeorm-seeding';
import app from '@app';
import { User } from '@entities/user.entity';
import { API } from '../../utils';
import { HttpStatusCode } from '@constants/httpStatusCode';
import { ErrorsMessages } from '@constants/errorMessages';

describe('creating a user', () => {
  it('returns http code 200 and creates the user', async () => {
    const userFields = await factory(User)().make();

    const response = await request(app).post(`${API}/users`).send(userFields);
    expect(response.status).toBe(200);

    const userRepo = getRepository<User>(User);
    expect(await userRepo.count()).toBeGreaterThan(0);
  });

  it('returns http code 400 if email is incorrect', async () => {
    const userFields = await factory(User)().make();
    userFields.email = '';

    const response = await request(app).post(`${API}/users`).send(userFields);
    expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);

    expect(response.body).toStrictEqual({
      description: ErrorsMessages.BODY_ERRORS,
      httpCode: HttpStatusCode.BAD_REQUEST,
      errors: ['Property email must be an email'],
      name: ErrorsMessages.BAD_REQUEST_ERROR
    });
  });

  it('returns http code 400 if password is incorrect', async () => {
    const userFields = await factory(User)().make();
    userFields.password = '';

    const response = await request(app).post(`${API}/users`).send(userFields);
    expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);

    expect(response.body).toStrictEqual({
      description: ErrorsMessages.BODY_ERRORS,
      httpCode: HttpStatusCode.BAD_REQUEST,
      errors: [ErrorsMessages.PASSWORD_ERROR],
      name: ErrorsMessages.BAD_REQUEST_ERROR
    });
  });

  it('returns http code 400 if user email already exists', async () => {
    const userFields = await factory(User)().create();

    const userRepo = getRepository<User>(User);
    userRepo.clear();

    const validResponse = await request(app)
      .post(`${API}/users`)
      .send(userFields);
    expect(validResponse.status).toBe(200);

    const failingResponse = await request(app)
      .post(`${API}/users`)
      .send(userFields);
    expect(failingResponse.status).toBe(400);
    expect(failingResponse.body).toStrictEqual({
      description: expect.stringContaining(userFields.email),
      httpCode: HttpStatusCode.BAD_REQUEST,
      name: 'BadRequestError'
    });

    expect(await userRepo.count()).toBe(1);
  });
});
