import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';

describe('TodoController (e2e-ish)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates and reads todo', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/api/v1/todos')
      .send({ title: 'test todo' })
      .expect(201);

    const created = createRes.body;
    expect(created.id).toBeDefined();
    expect(created.title).toBe('test todo');

    const listRes = await request(app.getHttpServer())
      .get('/api/v1/todos')
      .expect(200);

    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBeGreaterThanOrEqual(1);
  });

  it('returns 400 on invalid title', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/todos')
      .send({ title: '' })
      .expect(400);
  });
});

