import request from 'supertest';
import { getRepository } from 'typeorm';
import { factory } from 'typeorm-seeding';
import { Container } from 'typedi';
import app from '@app';
import { User } from '@entities/user.entity';
import { JWTService } from '@services/jwt.service';
import { API } from '../utils';

describe('requesting all users', () => {
  let user: User;
  let token: string;
  const jwtService = Container.get(JWTService);

  beforeEach(async () => {
    user = await factory(User)().create();
    token = await jwtService.createJWT(user);
  });

  it('returns http code 401 without authentication token', async () => {
    const response = await request(app).get(`${API}/users`);
    expect(response.status).toBe(401);
  });

  it('returns http code 401 with an invalid authentication token', async () => {
    const response = await request(app)
      .get(`${API}/users`)
      .set({ Authorization: 'Inv3nT3d-T0k3N' });
    expect(response.status).toBe(401);
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
});

describe('requesting a user', () => {
  let user;

  beforeEach(async () => {
    user = await factory(User)().create();
  });

  it('returns http code 404 for non-existing user', async () => {
    const randomId = Math.round(user.id + (1 + Math.random() * 10));
    const response = await request(app).get(`${API}/users/${randomId}`);
    expect(response.status).toBe(404);
  });

  it('returns http code 200 for an existing user', async () => {
    const id = user.id;
    const response = await request(app).get(`${API}/users/${id}`);
    expect(response.status).toBe(200);
  });
});

describe('creating a user', () => {
  it('returns http code 200 and creates the user', async () => {
    const userFields = await factory(User)().create();

    const response = await request(app).post(`${API}/users`).send(userFields);
    expect(response.status).toBe(200);

    const userRepo = getRepository<User>(User);
    expect(await userRepo.count()).toBeGreaterThan(0);
  });
});

describe('updating a user', () => {
  let user;

  beforeEach(async () => {
    user = await factory(User)().create();
  });

  it('returns http code 200 and updates the user', async () => {
    const id = user.id;
    user.firstName = 'new firstname';
    user.lastName = 'new lastname';
    const response = await request(app)
      .put(`${API}/users/${id}`)
      .send(user);
    expect(response.status).toBe(200);

    const updatedUser = await getRepository(User).findOne(id);
    expect(updatedUser?.firstName).toEqual(user.firstName);
    expect(updatedUser?.lastName).toEqual(user.lastName);
  });
});

describe('deleting a user', () => {
  let user;

  beforeEach(async () => {
    user = await factory(User)().create({ password: 'password123' });
  });

  it('returns http code 200 and deletes the user', async () => {
    const id = user.id;
    const userRepo = getRepository<User>(User);
    const beforeCount = await userRepo.count();
    const response = await request(app).delete(`${API}/users/${id}`);

    expect(response.status).toBe(200);
    expect(await userRepo.count()).toBeLessThan(beforeCount);
  });
});
