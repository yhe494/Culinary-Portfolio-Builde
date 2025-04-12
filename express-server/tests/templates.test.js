require('../app/models/template.server.model');
require('../app/models/user.server.model');

const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const templateRoutes = require('../app/routes/templates.server.routes');

const app = express();
app.use(express.json());
app.use(cookieParser());
templateRoutes(app);

const Template = mongoose.model('RecipeTemplate');
const User = mongoose.model('User');
let mongoServer;

const jwtKey = 'testsecret';

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      isAdmin: user.isAdmin || false,
      email: user.email,
    },
    jwtKey,
    { algorithm: 'HS256', expiresIn: 14400 }
  );
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  await Template.deleteMany();
  await User.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Template API', () => {
  let user, token;

  beforeEach(async () => {
    user = await new User({
      email: 'template@test.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    }).save();
    token = generateToken(user);
  });

  const templateData = {
    title: 'Spaghetti',
    description: 'A classic Italian pasta dish',
    categories: ['Main Course'],
    ingredients: { pasta: '200g', sauce: '1 cup' },
    steps: ['Boil water', 'Cook pasta', 'Add sauce'],
  };

  it('should create a template', async () => {
    const res = await request(app)
      .post('/template')
      .set('Cookie', [`token=${token}`])
      .send(templateData);

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Spaghetti');
  });

  it('should list all templates', async () => {
    await new Template({ ...templateData, createdBy: user._id }).save();

    const res = await request(app)
      .get('/templates')
      .set('Cookie', [`token=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('should return a template by ID', async () => {
    const template = await new Template({ ...templateData, createdBy: user._id }).save();

    const res = await request(app)
      .get(`/templates/${template._id}`)
      .set('Cookie', [`token=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(template._id.toString());
  });

  it('should update a template', async () => {
    const template = await new Template({ ...templateData, createdBy: user._id }).save();

    const res = await request(app)
      .put(`/templates/${template._id}`)
      .set('Cookie', [`token=${token}`])
      .send({ title: 'Updated Title' });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Title');
  });

  it('should delete a template', async () => {
    const template = await new Template({ ...templateData, createdBy: user._id }).save();

    const res = await request(app)
      .delete(`/templates/${template._id}`)
      .set('Cookie', [`token=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });

  it('should rate a template', async () => {
    const template = await new Template({ ...templateData, createdBy: user._id }).save();

    const res = await request(app)
      .post(`/templates/${template._id}/rate`)
      .set('Cookie', [`token=${token}`])
      .send({ score: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body.averageRating).toBe(5);
  });

  it('should prevent duplicate rating by same user', async () => {
    const template = await new Template({ ...templateData, createdBy: user._id }).save();

    await request(app)
      .post(`/templates/${template._id}/rate`)
      .set('Cookie', [`token=${token}`])
      .send({ score: 4 });

    const res = await request(app)
      .post(`/templates/${template._id}/rate`)
      .set('Cookie', [`token=${token}`])
      .send({ score: 5 });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/already rated/i);
  });
});
