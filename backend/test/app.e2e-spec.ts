import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';

const userId = '6502f79b-4c80-4f6b-9658-b14a35c45575';
const email = 'ada@example.com';
const password = 'secure-password';

describe('FreelanceHub API (e2e)', () => {
  let app: INestApplication;
  const users = new Map<string, Record<string, unknown>>();
  const database = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    client: {
      findMany: jest.fn(),
    },
  };

  beforeAll(() => {
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/freelancehub_test';
    process.env.JWT_SECRET = 'test-secret-that-is-at-least-thirty-two-characters';
    process.env.FRONTEND_URL = 'http://localhost:4200';
    process.env.NODE_ENV = 'test';
  });

  beforeEach(async () => {
    users.clear();
    jest.clearAllMocks();
    database.user.create.mockImplementation(({ data }) => {
      const user = {
        id: userId,
        ...data,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      };
      users.set(user.id, user);
      const { password: _password, ...authenticatedUser } = user;
      return Promise.resolve(authenticatedUser);
    });
    database.user.findUnique.mockImplementation(({ where, select }) => {
      const user = where.email
        ? [...users.values()].find((candidate) => candidate.email === where.email)
        : users.get(where.id);

      if (!user) {
        return Promise.resolve(null);
      }

      if (!select) {
        return Promise.resolve(user);
      }

      const { password: _password, ...authenticatedUser } = user;
      return Promise.resolve(authenticatedUser);
    });
    database.client.findMany.mockResolvedValue([]);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DatabaseService)
      .useValue(database)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('registers a user and returns an access token without the password', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email, password, firstName: 'Ada', lastName: 'Lovelace' })
      .expect(201);

    expect(response.body.accessToken).toEqual(expect.any(String));
    expect(response.body.user).toMatchObject({
      id: userId,
      email,
      firstName: 'Ada',
      lastName: 'Lovelace',
    });
    expect(response.body.user.password).toBeUndefined();
  });

  it('rejects an unauthenticated request to clients', async () => {
    await request(app.getHttpServer()).get('/api/clients').expect(401);
  });

  it('allows an authenticated user to list only their clients', async () => {
    const registration = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email, password, firstName: 'Ada', lastName: 'Lovelace' })
      .expect(201);

    await request(app.getHttpServer())
      .get('/api/clients')
      .set('Authorization', `Bearer ${registration.body.accessToken}`)
      .expect(200)
      .expect([]);
    expect(database.client.findMany).toHaveBeenCalledWith({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
