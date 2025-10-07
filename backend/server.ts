import express, { Request, Response, NextFunction } from 'express';
import cors from "cors";
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { PGlite } from '@electric-sql/pglite';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';

// Import Zod schemas
import { 
  userSchema, 
  createUserInputSchema,
  propertySchema,
  updatePropertyInputSchema,
  createBookingInputSchema,
  bookingSchema,
  updateBookingInputSchema,
  createReviewInputSchema,
  reviewSchema,
  createMessageInputSchema,
  messageSchema,
  updateMessageInputSchema,
  searchPropertyInputSchema
} from './schema.ts';

dotenv.config();

// ESM workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface UserData {
  user_id: string;
  email: string;
  name: string;
  created_at?: string;
}

interface JwtPayloadWithUser extends JwtPayload {
  user_id: string;
  email: string;
}

interface AuthenticatedRequest extends Request {
  user: UserData;
}

interface AuthenticatedSocket extends Socket {
  user: UserData;
}

interface ErrorResponse {
  success: false;
  message: string;
  error_code?: string;
  details?: any;
  timestamp: string;
}

function createErrorResponse(
  message: string,
  error?: any,
  errorCode?: string
): ErrorResponse {
  const response: ErrorResponse = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  if (errorCode) {
    response.error_code = errorCode;
  }

  if (error) {
    response.details = {
      name: error.name,
      message: error.message,
      stack: error.stack
    };
  }

  return response;
}

// Database setup using PGlite for development
const { JWT_SECRET = 'your-secret-key' } = process.env;

const db = new PGlite('./db');

// Initialize database with schema
const initDatabase = async () => {
  await db.exec(`
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    created_at VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS properties (
    property_id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    location VARCHAR NOT NULL,
    host_id VARCHAR NOT NULL REFERENCES users(user_id),
    description TEXT,
    accommodation_type VARCHAR NOT NULL,
    amenities TEXT[],
    price DECIMAL NOT NULL,
    images JSON
);

CREATE TABLE IF NOT EXISTS bookings (
    booking_id VARCHAR PRIMARY KEY,
    property_id VARCHAR NOT NULL REFERENCES properties(property_id),
    user_id VARCHAR NOT NULL REFERENCES users(user_id),
    start_date VARCHAR NOT NULL,
    end_date VARCHAR NOT NULL,
    guests INTEGER NOT NULL,
    total_price DECIMAL NOT NULL,
    is_paid BOOLEAN NOT NULL,
    payment_error_message TEXT
);

CREATE TABLE IF NOT EXISTS reviews (
    review_id VARCHAR PRIMARY KEY,
    property_id VARCHAR NOT NULL REFERENCES properties(property_id),
    user_id VARCHAR NOT NULL REFERENCES users(user_id),
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
    message_id VARCHAR PRIMARY KEY,
    sender_id VARCHAR NOT NULL REFERENCES users(user_id),
    recipient_id VARCHAR NOT NULL REFERENCES users(user_id),
    property_id VARCHAR REFERENCES properties(property_id),
    content TEXT NOT NULL,
    timestamp VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS auth_tokens (
    token_id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(user_id),
    token VARCHAR NOT NULL,
    is_valid BOOLEAN NOT NULL,
    created_at VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS searches (
    search_id VARCHAR PRIMARY KEY,
    user_id VARCHAR REFERENCES users(user_id),
    location VARCHAR NOT NULL,
    price_min DECIMAL NOT NULL,
    price_max DECIMAL NOT NULL,
    start_date VARCHAR NOT NULL,
    end_date VARCHAR NOT NULL,
    accommodation_type VARCHAR,
    amenities TEXT[]
);

-- Insert seed data
INSERT INTO users (user_id, email, password_hash, name, created_at) VALUES
('user1', 'johndoe@example.com', 'password123', 'John Doe', '2023-10-20T10:00:00Z'),
('user2', 'janedoe@example.com', 'admin123', 'Jane Doe', '2023-10-21T11:00:00Z')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO properties (property_id, name, location, host_id, description, accommodation_type, amenities, price, images) VALUES
('property1', 'Cozy Cottage', 'Countryside', 'user1', 'A quaint little cottage away from the city.', 'Cottage', '{"Fireplace", "WiFi", "Parking"}', 120.00, '{"urls": ["https://picsum.photos/200/300?random=1", "https://picsum.photos/200/300?random=2"]}'),
('property2', 'City Apartment', 'Downtown', 'user2', 'Modern apartment in the heart of the city.', 'Apartment', '{"Elevator", "Gym", "WiFi"}', 150.00, '{"urls": ["https://picsum.photos/200/300?random=3", "https://picsum.photos/200/300?random=4"]}')
ON CONFLICT (property_id) DO NOTHING;

INSERT INTO bookings (booking_id, property_id, user_id, start_date, end_date, guests, total_price, is_paid, payment_error_message) VALUES
('booking1', 'property1', 'user2', '2023-10-23', '2023-10-28', 2, 600.00, TRUE, NULL),
('booking2', 'property2', 'user1', '2023-11-01', '2023-11-05', 3, 900.00, FALSE, 'Payment failed due to insufficient funds.')
ON CONFLICT (booking_id) DO NOTHING;
`);
};

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }
});

const port = parseInt(process.env.PORT || '3000', 10);

// Middleware
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: "5mb" }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

/*
  Authentication middleware for protected routes
  Validates JWT token and adds user info to request object
*/
const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json(createErrorResponse('Access token required', null, 'AUTH_TOKEN_REQUIRED'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadWithUser;
    const result = await db.query('SELECT user_id, email, name, created_at FROM users WHERE user_id = $1', [decoded.user_id]);
    
    if (result.rows.length === 0) {
      return res.status(401).json(createErrorResponse('Invalid token', null, 'AUTH_TOKEN_INVALID'));
    }

    req.user = result.rows[0] as UserData;
    next();
  } catch (error) {
    return res.status(403).json(createErrorResponse('Invalid or expired token', error, 'AUTH_TOKEN_INVALID'));
  }
};

/*
  WebSocket authentication middleware
  Validates JWT token for socket connections
*/
const authenticateSocket = async (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadWithUser;
    const result = await db.query('SELECT user_id, email, name FROM users WHERE user_id = $1', [decoded.user_id]);
    
    if (result.rows.length === 0) {
      return next(new Error('Authentication error'));
    }

    socket.user = result.rows[0] as UserData;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
};

// REST API ENDPOINTS

/*
  User Registration Endpoint
  Creates a new user account and returns JWT token
*/
app.post('/api/auth/register', async (req, res) => {
  try {
    const validatedData = createUserInputSchema.parse(req.body);
    const { email, password_hash: password, name } = validatedData;

    // Check if user already exists
    const existingUser = await db.query('SELECT user_id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json(createErrorResponse('User with this email already exists', null, 'USER_ALREADY_EXISTS'));
    }

    // Create new user (no password hashing for development)
    const user_id = uuidv4();
    const created_at = new Date().toISOString();
    
    const result = await db.query(
      'INSERT INTO users (user_id, email, password_hash, name, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, email, name, created_at',
      [user_id, email.toLowerCase().trim(), password, name.trim(), created_at]
    );

    const user = result.rows[0] as UserData;

    // Generate JWT token
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    // Create auth token record
    const token_id = uuidv4();
    await db.query(
      'INSERT INTO auth_tokens (token_id, user_id, token, is_valid, created_at) VALUES ($1, $2, $3, $4, $5)',
      [token_id, user.user_id, token, true, created_at]
    );

    res.status(200).json({
      user: {
        id: user.user_id,
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        created_at: user.created_at
      },
      token,
      token_id,
      is_valid: true,
      created_at
    });

    // Emit real-time event
    io.emit('auth/token/generate', {
      token_id,
      user_id: user.user_id,
      token,
      is_valid: true,
      created_at
    });

  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json(createErrorResponse('Invalid input data', error, 'VALIDATION_ERROR'));
    }
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

/*
  User Login Endpoint
  Authenticates user and returns JWT token
*/
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json(createErrorResponse('Email and password are required', null, 'MISSING_REQUIRED_FIELDS'));
    }

    // Find user (direct password comparison for development)
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (result.rows.length === 0) {
      return res.status(400).json(createErrorResponse('Invalid email or password', null, 'INVALID_CREDENTIALS'));
    }

    const user = result.rows[0] as any;

    // Check password (direct comparison for development)
    if (password !== user.password_hash) {
      return res.status(400).json(createErrorResponse('Invalid email or password', null, 'INVALID_CREDENTIALS'));
    }

    // Generate JWT token
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    // Create auth token record
    const token_id = uuidv4();
    const created_at = new Date().toISOString();
    await db.query(
      'INSERT INTO auth_tokens (token_id, user_id, token, is_valid, created_at) VALUES ($1, $2, $3, $4, $5)',
      [token_id, user.user_id, token, true, created_at]
    );

    res.json({
      user: {
        id: user.user_id,
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        created_at: user.created_at
      },
      token,
      token_id,
      is_valid: true,
      created_at
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

/*
  Get User Profile Endpoint
  Retrieves user information by user_id
*/
app.get('/api/users/:user_id', authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.params;
    
    const result = await db.query('SELECT user_id, email, name, created_at FROM users WHERE user_id = $1', [user_id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json(createErrorResponse('User not found', null, 'USER_NOT_FOUND'));
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

/*
  Search Properties Endpoint
  Retrieves properties based on search criteria with filters
*/
app.get('/api/properties', async (req, res) => {
  try {
    const {
      location,
      price_min,
      price_max,
      accommodation_type,
      amenities,
      limit = '10',
      offset = '0'
    } = req.query;

    // Make location optional for general browsing
    let query = 'SELECT * FROM properties';
    let queryParams = [];
    let paramIndex = 1;
    let conditions = [];

    if (location) {
      conditions.push(`location ILIKE $${paramIndex}`);
      queryParams.push(`%${location}%`);
      paramIndex++;
    }

    // Add optional filters with proper type coercion
    if (price_min !== undefined && price_min !== '') {
      const priceMinNum = parseFloat(price_min as string);
      if (!isNaN(priceMinNum)) {
        conditions.push(`price >= $${paramIndex}`);
        queryParams.push(priceMinNum);
        paramIndex++;
      }
    }

    if (price_max !== undefined && price_max !== '') {
      const priceMaxNum = parseFloat(price_max as string);
      if (!isNaN(priceMaxNum)) {
        conditions.push(`price <= $${paramIndex}`);
        queryParams.push(priceMaxNum);
        paramIndex++;
      }
    }

    if (accommodation_type && accommodation_type !== '') {
      conditions.push(`accommodation_type ILIKE $${paramIndex}`);
      queryParams.push(`%${accommodation_type}%`);
      paramIndex++;
    }

    if (amenities && Array.isArray(amenities)) {
      conditions.push(`amenities && $${paramIndex}`);
      queryParams.push(amenities);
      paramIndex++;
    }

    // Add WHERE clause if there are conditions
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Add pagination with coercion
    const limitNum = Math.min(Math.max(parseInt(limit as string) || 10, 1), 100);
    const offsetNum = Math.max(parseInt(offset as string) || 0, 0);
    
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limitNum, offsetNum);

    const result = await db.query(query, queryParams);
    res.json(result.rows);

  } catch (error) {
    console.error('Search properties error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

/*
  Get Property Details Endpoint
  Retrieves detailed information about a specific property
*/
app.get('/api/properties/:property_id', async (req, res) => {
  try {
    const { property_id } = req.params;
    
    const result = await db.query('SELECT * FROM properties WHERE property_id = $1', [property_id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json(createErrorResponse('Property not found', null, 'PROPERTY_NOT_FOUND'));
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get property details error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

/*
  Update Property Endpoint
  Updates property details for hosts
*/
app.patch('/api/properties/:property_id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { property_id } = req.params;
    const validatedData = updatePropertyInputSchema.parse(req.body);

    // Check if property exists and user is the host
    const propertyCheck = await db.query('SELECT host_id FROM properties WHERE property_id = $1', [property_id]);
    if (propertyCheck.rows.length === 0) {
      return res.status(404).json(createErrorResponse('Property not found', null, 'PROPERTY_NOT_FOUND'));
    }

    if ((propertyCheck.rows[0] as any).host_id !== req.user.user_id) {
      return res.status(403).json(createErrorResponse('Unauthorized to update this property', null, 'UNAUTHORIZED_UPDATE'));
    }

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    Object.keys(validatedData).forEach(key => {
      if (validatedData[key] !== undefined) {
        updateFields.push(`${key} = $${paramIndex}`);
        updateValues.push(validatedData[key]);
        paramIndex++;
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json(createErrorResponse('No valid fields to update', null, 'NO_UPDATE_FIELDS'));
    }

    updateValues.push(property_id);
    const query = `UPDATE properties SET ${updateFields.join(', ')} WHERE property_id = $${paramIndex} RETURNING *`;

    const result = await db.query(query, updateValues);
    res.json(result.rows[0]);

    // Emit real-time event
    io.emit('property/update', result.rows[0]);

  } catch (error) {
    console.error('Update property error:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json(createErrorResponse('Invalid input data', error, 'VALIDATION_ERROR'));
    }
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

/*
  Create Booking Endpoint
  Creates a new booking for a property
*/
app.post('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const validatedData = createBookingInputSchema.parse(req.body);
    const { property_id, user_id, start_date, end_date, guests, total_price, is_paid, payment_error_message } = validatedData;

    // Verify property exists
    const propertyCheck = await db.query('SELECT property_id FROM properties WHERE property_id = $1', [property_id]);
    if (propertyCheck.rows.length === 0) {
      return res.status(404).json(createErrorResponse('Property not found', null, 'PROPERTY_NOT_FOUND'));
    }

    // Check for booking conflicts
    const conflictCheck = await db.query(
      'SELECT booking_id FROM bookings WHERE property_id = $1 AND ((start_date <= $2 AND end_date >= $2) OR (start_date <= $3 AND end_date >= $3) OR (start_date >= $2 AND end_date <= $3))',
      [property_id, start_date, end_date]
    );

    if (conflictCheck.rows.length > 0) {
      return res.status(400).json(createErrorResponse('Property is not available for selected dates', null, 'BOOKING_CONFLICT'));
    }

    const booking_id = uuidv4();
    const result = await db.query(
      'INSERT INTO bookings (booking_id, property_id, user_id, start_date, end_date, guests, total_price, is_paid, payment_error_message) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [booking_id, property_id, user_id, start_date, end_date, guests, total_price, is_paid, payment_error_message]
    );

    res.json(result.rows[0]);

    // Emit real-time event
    io.emit('booking/update', result.rows[0]);

  } catch (error) {
    console.error('Create booking error:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json(createErrorResponse('Invalid input data', error, 'VALIDATION_ERROR'));
    }
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

/*
  Update Booking Endpoint
  Updates booking details and payment status
*/
app.patch('/api/bookings/:booking_id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { booking_id } = req.params;
    const validatedData = updateBookingInputSchema.parse(req.body);

    // Check if booking exists and user has permission
    const bookingCheck = await db.query('SELECT user_id FROM bookings WHERE booking_id = $1', [booking_id]);
    if (bookingCheck.rows.length === 0) {
      return res.status(404).json(createErrorResponse('Booking not found', null, 'BOOKING_NOT_FOUND'));
    }

    if ((bookingCheck.rows[0] as any).user_id !== req.user.user_id) {
      return res.status(403).json(createErrorResponse('Unauthorized to update this booking', null, 'UNAUTHORIZED_UPDATE'));
    }

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    Object.keys(validatedData).forEach(key => {
      if (validatedData[key] !== undefined && key !== 'booking_id') {
        updateFields.push(`${key} = $${paramIndex}`);
        updateValues.push(validatedData[key]);
        paramIndex++;
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json(createErrorResponse('No valid fields to update', null, 'NO_UPDATE_FIELDS'));
    }

    updateValues.push(booking_id);
    const query = `UPDATE bookings SET ${updateFields.join(', ')} WHERE booking_id = $${paramIndex} RETURNING *`;

    const result = await db.query(query, updateValues);
    res.json(result.rows[0]);

    // Emit real-time event
    io.emit('booking/update', result.rows[0]);

  } catch (error) {
    console.error('Update booking error:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json(createErrorResponse('Invalid input data', error, 'VALIDATION_ERROR'));
    }
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

/*
  Create Review Endpoint
  Allows users to submit reviews for properties they've booked
*/
app.post('/api/reviews', authenticateToken, async (req, res) => {
  try {
    const validatedData = createReviewInputSchema.parse(req.body);
    const { property_id, user_id, rating, comment } = validatedData;

    // Verify user has a completed booking for this property
    const bookingCheck = await db.query(
      'SELECT booking_id FROM bookings WHERE property_id = $1 AND user_id = $2 AND end_date < NOW()',
      [property_id, user_id]
    );

    if (bookingCheck.rows.length === 0) {
      return res.status(400).json(createErrorResponse('You can only review properties you have stayed at', null, 'NO_COMPLETED_BOOKING'));
    }

    // Check if user already reviewed this property
    const existingReview = await db.query(
      'SELECT review_id FROM reviews WHERE property_id = $1 AND user_id = $2',
      [property_id, user_id]
    );

    if (existingReview.rows.length > 0) {
      return res.status(400).json(createErrorResponse('You have already reviewed this property', null, 'REVIEW_ALREADY_EXISTS'));
    }

    const review_id = uuidv4();
    const created_at = new Date().toISOString();
    
    const result = await db.query(
      'INSERT INTO reviews (review_id, property_id, user_id, rating, comment, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [review_id, property_id, user_id, rating, comment, created_at]
    );

    res.json(result.rows[0]);

    // Emit real-time event
    io.emit('review/add', result.rows[0]);

  } catch (error) {
    console.error('Create review error:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json(createErrorResponse('Invalid input data', error, 'VALIDATION_ERROR'));
    }
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

/*
  Send Message Endpoint
  Enables communication between users (hosts and guests)
*/
app.post('/api/messages', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const validatedData = createMessageInputSchema.parse(req.body);
    const { sender_id, recipient_id, property_id, content } = validatedData;

    // Verify sender matches authenticated user
    if (sender_id !== req.user.user_id) {
      return res.status(403).json(createErrorResponse('Unauthorized to send message as another user', null, 'UNAUTHORIZED_SENDER'));
    }

    // Verify recipient exists
    const recipientCheck = await db.query('SELECT user_id FROM users WHERE user_id = $1', [recipient_id]);
    if (recipientCheck.rows.length === 0) {
      return res.status(404).json(createErrorResponse('Recipient not found', null, 'RECIPIENT_NOT_FOUND'));
    }

    const message_id = uuidv4();
    const timestamp = new Date().toISOString();
    
    const result = await db.query(
      'INSERT INTO messages (message_id, sender_id, recipient_id, property_id, content, timestamp) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [message_id, sender_id, recipient_id, property_id, content, timestamp]
    );

    res.json(result.rows[0]);

    // Emit real-time event to recipient
    io.to(`user_${recipient_id}`).emit('message/send', result.rows[0]);

  } catch (error) {
    console.error('Send message error:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json(createErrorResponse('Invalid input data', error, 'VALIDATION_ERROR'));
    }
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

/*
  Update Message Endpoint
  Allows users to edit their own messages
*/
app.patch('/api/messages/:message_id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { message_id } = req.params;
    const validatedData = updateMessageInputSchema.parse(req.body);

    // Check if message exists and user is the sender
    const messageCheck = await db.query('SELECT sender_id FROM messages WHERE message_id = $1', [message_id]);
    if (messageCheck.rows.length === 0) {
      return res.status(404).json(createErrorResponse('Message not found', null, 'MESSAGE_NOT_FOUND'));
    }

    if ((messageCheck.rows[0] as any).sender_id !== req.user.user_id) {
      return res.status(403).json(createErrorResponse('Unauthorized to update this message', null, 'UNAUTHORIZED_UPDATE'));
    }

    const { content } = validatedData;
    const result = await db.query(
      'UPDATE messages SET content = $1 WHERE message_id = $2 RETURNING *',
      [content, message_id]
    );

    res.json(result.rows[0]);

    // Emit real-time event
    io.emit('message/send', result.rows[0]);

  } catch (error) {
    console.error('Update message error:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json(createErrorResponse('Invalid input data', error, 'VALIDATION_ERROR'));
    }
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

// WEBSOCKET HANDLING

/*
  WebSocket connection handling with authentication
  Manages real-time communication between users
*/
io.use(authenticateSocket);

io.on('connection', (socket: AuthenticatedSocket) => {
  console.log(`User ${socket.user.user_id} connected`);
  
  // Join user to their personal room for targeted messaging
  socket.join(`user_${socket.user.user_id}`);

  /*
    Handle sending messages via websocket
    Provides real-time messaging capability
  */
  socket.on('send_message', async (data) => {
    try {
      const { recipient_id, property_id, content } = data;
      
      // Verify recipient exists
      const recipientCheck = await db.query('SELECT user_id FROM users WHERE user_id = $1', [recipient_id]);
      if (recipientCheck.rows.length === 0) {
        socket.emit('error', { message: 'Recipient not found' });
        return;
      }

      const message_id = uuidv4();
      const timestamp = new Date().toISOString();
      
      const result = await db.query(
        'INSERT INTO messages (message_id, sender_id, recipient_id, property_id, content, timestamp) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [message_id, socket.user.user_id, recipient_id, property_id, content, timestamp]
      );

      const message = result.rows[0];
      
      // Send to recipient in real-time
      io.to(`user_${recipient_id}`).emit('message/send', message);
      
      // Send confirmation to sender
      socket.emit('message_sent', message);

    } catch (error) {
      console.error('WebSocket send message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  /*
    Handle user disconnection
    Clean up socket connections
  */
  socket.on('disconnect', () => {
    console.log(`User ${socket.user.user_id} disconnected`);
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Catch-all route for SPA routing (excluding API routes)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

export { app, db };


// Start the server after initializing database
(async () => {
  try {
    await initDatabase();
    console.log("Database initialized successfully");
    
    server.listen(port, "0.0.0.0", () => {
      console.log(`Server running on port ${port} and listening on 0.0.0.0`);
    });
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
})();
