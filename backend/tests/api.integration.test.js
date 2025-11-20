const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');

let app;
let mongoServer;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGO_URI = uri;
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

  app = require('../server');
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('API integration - prices, dealers, records', () => {
  test('prices endpoints return expected payloads', async () => {
    const Product = require('../models/Product');
    const Market = require('../models/Market');
    const MarketPrice = require('../models/MarketPrice');

    const product = await Product.create({ name: 'TestProduct', category_type: 'Product', unit: 'kg' });
    const market = await Market.create({ name: 'TestMarket', county: 'TestCounty', location: { type: 'Point', coordinates: [36.8, -1.28] } });

    await MarketPrice.create({ product_id: product._id, market_id: market._id, price: 200 });

    const res1 = await request(app).get(`/api/prices/product/${product._id}`);
    expect(res1.statusCode).toBe(200);
    expect(res1.body).toHaveProperty('product');
    expect(res1.body).toHaveProperty('priceComparison');
    expect(Array.isArray(res1.body.priceComparison)).toBe(true);

    const res2 = await request(app).get(`/api/prices/market/${market._id}`);
    expect(res2.statusCode).toBe(200);
    expect(res2.body).toHaveProperty('market');
    expect(res2.body).toHaveProperty('prices');
    expect(Array.isArray(res2.body.prices)).toBe(true);
  });

  test('dealers endpoints require auth and return data', async () => {
    const User = require('../models/User');
    const AgroDealer = require('../models/AgroDealer');

    // create a user and token
    const user = await User.create({ email: 'dealer@test.com', password: 'password123', location: 'TestCounty' });
    const token = jwt.sign({ user: { id: user.id, role: user.role } }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // create a dealer
    await AgroDealer.create({ name: 'DealerOne', county: 'TestCounty', inventory: ['Fertilizer'], contact: '0712345678', location: { type: 'Point', coordinates: [36.8, -1.28] } });

    const res = await request(app).get('/api/dealers').set('x-auth-token', token);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    const resSearch = await request(app).get('/api/dealers/search').query({ county: 'TestCounty' }).set('x-auth-token', token);
    expect(resSearch.statusCode).toBe(200);
    expect(Array.isArray(resSearch.body)).toBe(true);
  });

  test('records CRUD with RBAC enforcement', async () => {
    const User = require('../models/User');
    const FarmRecord = require('../models/FarmRecord');

    // create a farmer (normal) and a data_entry user
    const farmer = await User.create({ email: 'farmer@test.com', password: 'password123', location: 'FarmCounty' });
    const dataUser = await User.create({ email: 'data@test.com', password: 'password123', location: 'DataCounty', role: 'data_entry' });

    const farmerToken = jwt.sign({ user: { id: farmer.id, role: farmer.role } }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const dataToken = jwt.sign({ user: { id: dataUser.id, role: dataUser.role } }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // data_entry creates a record
    const recordPayload = { commodity: 'Maize', recordType: 'Stock', quantity: 100, unit: 'kg', price: 5000, dateRecorded: new Date() };
    const createRes = await request(app).post('/api/records').set('x-auth-token', dataToken).send(recordPayload);
    expect(createRes.statusCode).toBe(200);
    expect(createRes.body).toHaveProperty('_id');

    const recId = createRes.body._id;

    // farmer tries to GET records (should return empty array since farmer has no records)
    const farmerGet = await request(app).get('/api/records').set('x-auth-token', farmerToken);
    expect(farmerGet.statusCode).toBe(200);
    expect(Array.isArray(farmerGet.body)).toBe(true);

    // data_user GET records (should include the created one)
    const dataGet = await request(app).get('/api/records').set('x-auth-token', dataToken);
    expect(dataGet.statusCode).toBe(200);
    expect(Array.isArray(dataGet.body)).toBe(true);
    expect(dataGet.body.some(r => r._id === recId)).toBe(true);

    // data_user deletes the record
    const delRes = await request(app).delete(`/api/records/${recId}`).set('x-auth-token', dataToken);
    expect(delRes.statusCode).toBe(200);
    expect(delRes.body).toHaveProperty('msg');

    // verify record removed
    const afterGet = await request(app).get('/api/records').set('x-auth-token', dataToken);
    expect(afterGet.body.some(r => r._id === recId)).toBe(false);
  });
});
