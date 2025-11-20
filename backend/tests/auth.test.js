const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let app;
let mongoServer;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGO_URI = uri;
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

  // Require the server after setting env vars so it uses the in-memory DB
  app = require('../server');
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Auth API', () => {
  const testUser = { email: 'test@example.com', password: 'password123', location: 'TestCounty' };

  test('Register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('email', testUser.email);
  });

  test('Login with registered user', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: testUser.email, password: testUser.password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('email', testUser.email);
    // store token for next request
    const token = res.body.token;

    // GET protected route /api/records should succeed and return array
    const recRes = await request(app).get('/api/records').set('x-auth-token', token);
    expect(recRes.statusCode).toBe(200);
    expect(Array.isArray(recRes.body)).toBe(true);
  });
});
