import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp } from './initial-e2e-setup';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  it('GET /', () => {
    return request(app.getHttpServer()).get('/').expect(404);
  });

  it('POST /auth/login 401', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'test',
        password: 'test',
      })
      .expect(401);
  });

  it('POST /auth/login validation pipe', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'user',
        password: 'userpw',
        white: 'this is not allowed',
      })
      .expect(400);
  });

  it('POST /auth/login 200', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'user',
        password: 'userpw',
      })
      .expect(200);
  });

  it('GET /auth/profile with header', async () => {
    const server = app.getHttpServer();
    const res = await request(server)
      .post('/auth/login')
      .send({
        username: 'user',
        password: 'userpw',
      })
      .expect(200);

    expect(res.body.access_token).toBeDefined();

    const { access_token } = res.body;

    await request(server)
      .get('/auth/profile')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);
  });

  it('GET /auth/profile with cookie', async () => {
    const server = app.getHttpServer();
    const res = await request(server)
      .post('/auth/login')
      .send({
        username: 'user',
        password: 'userpw',
      })
      .expect(200);

    expect(res.body.access_token).toBeDefined();

    const cookies = res.header['set-cookie'];

    await request(server)
      .get('/auth/profile')
      .set('Cookie', cookies)
      .expect(200);
  });
});
