CREATE TABLE users (
    user_id VARCHAR PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    created_at VARCHAR NOT NULL
);

CREATE TABLE properties (
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

CREATE TABLE bookings (
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

CREATE TABLE reviews (
    review_id VARCHAR PRIMARY KEY,
    property_id VARCHAR NOT NULL REFERENCES properties(property_id),
    user_id VARCHAR NOT NULL REFERENCES users(user_id),
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at VARCHAR NOT NULL
);

CREATE TABLE messages (
    message_id VARCHAR PRIMARY KEY,
    sender_id VARCHAR NOT NULL REFERENCES users(user_id),
    recipient_id VARCHAR NOT NULL REFERENCES users(user_id),
    property_id VARCHAR REFERENCES properties(property_id),
    content TEXT NOT NULL,
    timestamp VARCHAR NOT NULL
);

CREATE TABLE auth_tokens (
    token_id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(user_id),
    token VARCHAR NOT NULL,
    is_valid BOOLEAN NOT NULL,
    created_at VARCHAR NOT NULL
);

CREATE TABLE searches (
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

-- Seeding the database with some example data

-- Users
INSERT INTO users (user_id, email, password_hash, name, created_at) VALUES
('user1', 'johndoe@example.com', 'password123', 'John Doe', '2023-10-20T10:00:00Z'),
('user2', 'janedoe@example.com', 'admin123', 'Jane Doe', '2023-10-21T11:00:00Z');

-- Properties
INSERT INTO properties (property_id, name, location, host_id, description, accommodation_type, amenities, price, images) VALUES
('property1', 'Cozy Cottage', 'Countryside', 'user1', 'A quaint little cottage away from the city.', 'Cottage', '{"Fireplace", "WiFi", "Parking"}', 120.00, '{"https://picsum.photos/200/300?random=1", "https://picsum.photos/200/300?random=2"}'),
('property2', 'City Apartment', 'Downtown', 'user2', 'Modern apartment in the heart of the city.', 'Apartment', '{"Elevator", "Gym", "WiFi"}', 150.00, '{"https://picsum.photos/200/300?random=3", "https://picsum.photos/200/300?random=4"}');

-- Bookings
INSERT INTO bookings (booking_id, property_id, user_id, start_date, end_date, guests, total_price, is_paid, payment_error_message) VALUES
('booking1', 'property1', 'user2', '2023-10-23', '2023-10-28', 2, 600.00, TRUE, NULL),
('booking2', 'property2', 'user1', '2023-11-01', '2023-11-05', 3, 900.00, FALSE, 'Payment failed due to insufficient funds.');

-- Reviews
INSERT INTO reviews (review_id, property_id, user_id, rating, comment, created_at) VALUES
('review1', 'property1', 'user2', 4, 'Great stay! Very cozy and peaceful.', '2023-10-29T14:00:00Z'),
('review2', 'property2', 'user1', 5, 'Loved it! Right in the center of everything.', '2023-11-06T15:00:00Z');

-- Messages
INSERT INTO messages (message_id, sender_id, recipient_id, property_id, content, timestamp) VALUES
('message1', 'user1', 'user2', 'property1', 'Hi, is your cottage available this weekend?', '2023-10-21T14:30:00Z'),
('message2', 'user2', 'user1', 'property1', 'Yes, it is available!', '2023-10-21T15:00:00Z');

-- Auth Tokens
INSERT INTO auth_tokens (token_id, user_id, token, is_valid, created_at) VALUES
('token1', 'user1', 'abc123', TRUE, '2023-10-20T10:00:00Z'),
('token2', 'user2', 'def456', TRUE, '2023-10-21T11:00:00Z');

-- Searches
INSERT INTO searches (search_id, user_id, location, price_min, price_max, start_date, end_date, accommodation_type, amenities) VALUES
('search1', 'user1', 'Countryside', 100.00, 200.00, '2023-10-23', '2023-10-28', 'Cottage', '{"Fireplace", "WiFi"}'),
('search2', 'user2', 'Downtown', 150.00, 300.00, '2023-11-01', '2023-11-05', 'Apartment', '{"Elevator"}');