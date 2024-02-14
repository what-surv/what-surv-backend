import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp } from './initial-e2e-setup';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  it('GET /role-example/user', async () => {
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
      .get('/role-example/user')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);

    await request(server)
      .get('/role-example/admin')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(403);
  });

  it('GET /role-example/admin', async () => {
    const server = app.getHttpServer();
    const res = await request(server)
      .post('/auth/login')
      .send({
        username: 'admin',
        password: 'adminpw',
      })
      .expect(200);

    expect(res.body.access_token).toBeDefined();

    const { access_token } = res.body;

    await request(server)
      .get('/role-example/user')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);

    await request(server)
      .get('/role-example/admin')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);
  });
});
