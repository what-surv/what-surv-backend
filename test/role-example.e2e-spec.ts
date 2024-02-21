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

  it('GET /role-example/user', async () => {
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
      .get('/role-example/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    await request(server)
      .get('/role-example/admin')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(403);
  });

  it('GET /role-example/admin', async () => {
    const server = app.getHttpServer();
    const res = await request(server)
      .post('/auth/mock-login')
      .send({
        username: 'admin',
        password: 'adminpw',
      })
      .expect(200);

    expect(res.body.accessToken).toBeDefined();

    const { accessToken } = res.body;

    await request(server)
      .get('/role-example/admin')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });
});
