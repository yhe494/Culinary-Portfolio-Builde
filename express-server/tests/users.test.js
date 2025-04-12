require('../app/models/user.server.model'); // Load User model
const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const userRoutes = require('../app/routes/users.server.routes'); 
require('../app/models/user.server.model'); 

const config = { secretKey: 'testsecret' }; 
const jwtKey = config.secretKey;

const app = express();
app.use(express.json());
app.use(cookieParser());
userRoutes(app); // Load routes

const User = mongoose.model('User');
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  await User.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      isAdmin: user.isAdmin,
      email: user.email,
    },
    jwtKey,
    { algorithm: 'HS256', expiresIn: 14400 }
  );
}

describe('User API Endpoints', () => {
  const userData = {
    email: 'phoe@example.com',
    password: 'password123',
    firstName: 'Phoebe',
    lastName: 'Doe',
  };

  it('POST /users - should create a user', async () => {
    const res = await request(app).post('/users').send(userData);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(userData.email);
  });

  it('POST /users - should fail on duplicate email', async () => {
    await request(app).post('/users').send(userData);
    const res = await request(app).post('/users').send(userData);
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('User already exists');
});

  it('POST /signin - should authenticate user', async () => {
    await request(app).post('/users').send(userData);
    const res = await request(app).post('/signin').send({
      email: userData.email,
      password: userData.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe(userData.email);
  });

  it('POST /signin - fail with wrong password', async () => {
    await request(app).post('/users').send(userData);
    const res = await request(app).post('/signin').send({
      email: userData.email,
      password: 'wrongpass',
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/Wrong password/);
  });

  it('GET /read_cookie - should return user info if signed in', async () => {
    const created = await new User(userData).save();
    const token = generateToken(created);

    const res = await request(app)
      .get('/read_cookie')
      .set('Cookie', [`token=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(userData.email);
  });

  it('PUT /users/:id - should update user', async () => {
    const created = await new User(userData).save();
    const token = generateToken(created);

    const res = await request(app)
      .put(`/users/${created._id}`)
      .set('Cookie', [`token=${token}`])
      .send({ firstName: 'Updated' });

    expect(res.statusCode).toBe(200);
    expect(res.body.firstName).toBe('Updated');
  });

  it('DELETE /users/:id - should delete user', async () => {
    const created = await new User(userData).save();
    const token = generateToken(created);

    const res = await request(app)
      .delete(`/users/${created._id}`)
      .set('Cookie', [`token=${token}`]);

    expect(res.statusCode).toBe(200);
    const check = await User.findById(created._id);
    expect(check).toBeNull();
  });

  it('GET /users - should list users (admin only)', async () => {
    const admin = await new User({ ...userData, isAdmin: true }).save();
    const token = generateToken(admin);

    const res = await request(app)
      .get('/users')
      .set('Cookie', [`token=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /users - should fail for non-admin', async () => {
    const user = await new User(userData).save();
    const token = generateToken(user);

    const res = await request(app)
      .get('/users')
      .set('Cookie', [`token=${token}`]);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/not authorized/);
  });
});
