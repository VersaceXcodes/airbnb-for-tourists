import request from 'supertest';
import { app, db } from './server.ts';
import { createUserInputSchema } from './schema.ts';

beforeAll(async () => {
  // Initialize stuff before the tests (e.g., setup test DB connection)
});

afterAll(async () => {
  // Cleanup operations after tests are done.
  await db.close();
});

describe('User Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'testuser@example.com',
          password_hash: 'testpassword',
          name: 'Test User'
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should fail with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'not-an-email',
          password_hash: 'testpassword',
          name: 'Test User'
        });

      expect(response.statusCode).toBe(400);
    });

    it('should fail validation with missing fields', async () => {
      const response = await request(app).post('/api/auth/register').send({
        email: 'testuser@example.com'
      });

      const validation = createUserInputSchema.safeParse(response.body);
      expect(validation.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should log in existing user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'johndoe@example.com',
          password: 'password123' // Matching the seeded user
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should fail to log in with wrong credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'johndoe@example.com',
          password: 'wrongpassword'
        });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /api/users/:user_id', () => {
    it('should provide user data when authenticated', async () => {
      const response = await request(app)
        .get('/api/users/user1')
        .set('Authorization', `Bearer abc123`);

      expect(response.statusCode).toBe(200);
      expect(response.body.user_id).toBe('user1');
    });

    it('should not provide data without token', async () => {
      const response = await request(app).get('/api/users/user1');
      expect(response.statusCode).toBe(403);
    });
  });
});

describe('Property Endpoints', () => {
  describe('GET /api/properties', () => {
    it('should return a list of properties', async () => {
      const response = await request(app).get('/api/properties?location=Downtown');
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/properties/:property_id', () => {
    it('should return details of a specific property', async () => {
      const response = await request(app).get('/api/properties/property1');
      expect(response.statusCode).toBe(200);
      expect(response.body.property_id).toBe('property1');
    });

    it('should handle non-existent property ID gracefully', async () => {
      const response = await request(app).get('/api/properties/nonexistent');
      expect(response.statusCode).toBe(404);
    });
  });
});

describe('WebSocket Tests', () => {
  it('should send and receive messages in real-time', async () => {
    // Mock WebSocket implementation, send, and validate message receipt
    // This can involve creating a WebSocket client, connecting to the server, and assessing the bidirectional flow.
  });
});