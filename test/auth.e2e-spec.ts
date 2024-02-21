import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp } from './initial-e2e-setup';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /', () => request(app.getHttpServer()).get('/').expect(404));

  it('POST /auth/mock-login 401', () =>
    request(app.getHttpServer())
      .post('/auth/mock-login')
      .send({
        username: 'test',
        password: 'test',
      })
      .expect(401));

  it('POST /auth/mock-login validation pipe', () =>
    request(app.getHttpServer())
      .post('/auth/mock-login')
      .send({
        username: 'user',
        password: 'userpw',
        white: 'this is not allowed',
      })
      .expect(400));

  it('POST /auth/mock-login 200', () =>
    request(app.getHttpServer())
      .post('/auth/mock-login')
      .send({
        username: 'user',
        password: 'userpw',
      })
      .expect(200));

  it('GET /auth/profile with header', async () => {
    const server = app.getHttpServer();
    const res = await request(server)
      .post('/auth/mock-login')
      .send({
        username: 'user',
        password: 'userpw',
      })
      .expect(200);

    expect(res.body.accessToken).toBeDefined();

    const { accessToken } = res.body;

    await request(server)
      .get('/auth/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('GET /auth/profile with cookie', async () => {
    const server = app.getHttpServer();
    const res = await request(server)
      .post('/auth/mock-login')
      .send({
        username: 'user',
        password: 'userpw',
      })
      .expect(200);

    expect(res.body.accessToken).toBeDefined();

    const cookies = res.header['set-cookie'];

    await request(server)
      .get('/auth/profile')
      .set('Cookie', cookies)
      .expect(200);
  });
});
