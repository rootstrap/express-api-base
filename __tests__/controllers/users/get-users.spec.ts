import request from 'supertest';
import { factory } from 'typeorm-seeding';
import { Container } from 'typedi';
import app from '@app';
import { User } from '@entities/user.entity';
import { JWTService } from '@services/jwt.service';
import { API } from '../../utils';
import { HttpStatusCode } from '@constants/httpStatusCode';

describe('requesting all users', () => {
  let user: User;
  let token: string;
  const jwtService = Container.get(JWTService);
  const unAuthenticatedError = {
    description: 'Authorization is required for request on GET /api/v1/users',
    httpCode: 401,
    name: 'AuthorizationRequiredError'
  };

  beforeEach(async () => {
    user = await factory(User)().create();
    token = await jwtService.createJWT(user);
  });

  it('returns http code 401 without authentication token', async () => {
    const response = await request(app).get(`${API}/users`);
    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual(
      expect.objectContaining(unAuthenticatedError)
    );
  });

  it('returns http code 401 with an invalid authentication token', async () => {
    const response = await request(app)
      .get(`${API}/users`)
      .set({ Authorization: 'Inv3nT3d-T0k3N' });
    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual(
      expect.objectContaining(unAuthenticatedError)
    );
  });

  it('returns http code 200 with valid authentication token', async () => {
    const response = await request(app)
      .get(`${API}/users`)
      .set({ Authorization: token });
    expect(response.status).toBe(200);
  });

  it("returns the user's list", async () => {
    const response = await request(app)
      .get(`${API}/users`)
      .set({ Authorization: token });
    expect(response.header).toHaveProperty(
      'content-type',
      'application/json; charset=utf-8'
    );
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).not.toEqual([]);
  });

  it('returns http code 404 for non-existing user', async () => {
    const randomId = Math.round(user.id + (1 + Math.random() * 10));
    const response = await request(app).get(`${API}/users/${randomId}`);
    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        httpCode: HttpStatusCode.NOT_FOUND,
        name: 'NotFoundError'
      })
    );
  });

  it('returns http code 200 for an existing user', async () => {
    const id = user.id;
    const response = await request(app).get(`${API}/users/${id}`);
    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty('password');
  });
});
