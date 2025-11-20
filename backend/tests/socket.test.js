const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let app;
let server;
let mongoServer;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGO_URI = uri;
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

  // require the app (exports the express app and attaches server)
  app = require('../server');
  server = app.server;

  // start listening on a random free port
  await new Promise((resolve) => server.listen(0, resolve));
});

afterAll(async () => {
  try {
    await new Promise((resolve) => server.close(resolve));
  } catch (err) {
    // ignore
  }
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Socket.IO real-time', () => {
  test('authenticated client receives priceUpdate when a new price is posted', async () => {
    // Register a user and obtain token
    const testUser = { email: 'socket@test.com', password: 'password123', location: 'TestCounty' };
    const regRes = await request(app).post('/api/auth/register').send(testUser);
    expect(regRes.statusCode).toBe(200);
    const token = regRes.body.token;

    // Create product and market directly using models
    const Product = require('../models/Product');
    const Market = require('../models/Market');

    const product = await Product.create({ name: 'Maize', category_type: 'Product', unit: 'kg' });
    const market = await Market.create({ name: 'Kisumu', county: 'Kisumu', location: { type: 'Point', coordinates: [34.761, -0.091] } });

    // Connect socket.io-client with token
    const { io } = require('socket.io-client');
    const port = server.address().port;
    const url = `http://localhost:${port}`;

    const socket = io(url, { auth: { token }, reconnectionDelay: 0, forceNew: true, transports: ['websocket'] });

    // Wait for connection
    await new Promise((resolve, reject) => {
      socket.on('connect', () => resolve());
      socket.on('connect_error', (err) => reject(err));
      setTimeout(() => reject(new Error('Socket connect timeout')), 3000);
    });

    // Wait for the server-emitted priceUpdate
    const received = new Promise((resolve, reject) => {
      socket.on('priceUpdate', (payload) => resolve(payload));
      setTimeout(() => reject(new Error('Did not receive priceUpdate in time')), 3000);
    });

    // Post a new price (this should trigger the server to emit priceUpdate)
    const priceRes = await request(app)
      .post('/api/prices')
      .set('x-auth-token', token)
      .send({ product_id: product._id.toString(), market_id: market._id.toString(), price: 150 });

    expect(priceRes.statusCode).toBe(200);

    const payload = await received;
    expect(payload).toHaveProperty('price', 150);
    expect(payload).toHaveProperty('product_id');
    expect(payload).toHaveProperty('market_id');

    socket.disconnect();
  });

  test('unauthenticated socket is rejected', async () => {
    const { io } = require('socket.io-client');
    const port = server.address().port;
    const url = `http://localhost:${port}`;

    // Try connect without token
    const socket = io(url, { reconnectionDelay: 0, forceNew: true, transports: ['websocket'] });

    await expect(new Promise((resolve, reject) => {
      socket.on('connect', () => resolve('connected'));
      socket.on('connect_error', (err) => resolve(err));
      setTimeout(() => resolve(new Error('timeout')), 2000);
    })).resolves.toBeInstanceOf(Error);

    socket.disconnect();
  });
});
