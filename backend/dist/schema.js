import { z } from 'zod';
// User Schemas
export const userSchema = z.object({
    user_id: z.string(),
    email: z.string().email(),
    password_hash: z.string(),
    name: z.string(),
    created_at: z.coerce.date()
});
export const createUserInputSchema = z.object({
    email: z.string().email(),
    password_hash: z.string().min(6),
    name: z.string().min(1).max(255)
});
export const updateUserInputSchema = z.object({
    user_id: z.string(),
    email: z.string().email().optional(),
    password_hash: z.string().min(6).optional(),
    name: z.string().min(1).max(255).optional()
});
export const searchUserInputSchema = z.object({
    query: z.string().optional(),
    limit: z.number().int().positive().default(10),
    offset: z.number().int().nonnegative().default(0),
    sort_by: z.enum(['name', 'created_at']).default('created_at'),
    sort_order: z.enum(['asc', 'desc']).default('desc')
});
// Property Schemas
export const propertySchema = z.object({
    property_id: z.string(),
    name: z.string(),
    location: z.string(),
    host_id: z.string(),
    description: z.string().nullable(),
    accommodation_type: z.string(),
    amenities: z.array(z.string()).nullable(),
    price: z.number(),
    images: z.object({}).nullable() // Assuming this is a JSON object for images
});
export const createPropertyInputSchema = z.object({
    name: z.string().min(1),
    location: z.string().min(1),
    host_id: z.string(),
    description: z.string().nullable().optional(),
    accommodation_type: z.string().min(1),
    amenities: z.array(z.string()).nullable().optional(),
    price: z.number().positive(),
    images: z.object({}).nullable().optional() // Creating as nullable
});
export const updatePropertyInputSchema = z.object({
    property_id: z.string(),
    name: z.string().min(1).optional(),
    location: z.string().min(1).optional(),
    host_id: z.string().optional(),
    description: z.string().nullable().optional(),
    accommodation_type: z.string().min(1).optional(),
    amenities: z.array(z.string()).nullable().optional(),
    price: z.number().positive().optional(),
    images: z.object({}).nullable().optional()
});
export const searchPropertyInputSchema = z.object({
    location: z.string().optional(),
    price_min: z.number().nonnegative().optional(),
    price_max: z.number().nonnegative().optional(),
    accommodation_type: z.string().optional(),
    amenities: z.array(z.string()).optional(),
    query: z.string().optional(),
    limit: z.number().int().positive().default(10),
    offset: z.number().int().nonnegative().default(0),
    sort_by: z.enum(['name', 'price']).default('price'),
    sort_order: z.enum(['asc', 'desc']).default('asc')
});
// Booking Schemas
export const bookingSchema = z.object({
    booking_id: z.string(),
    property_id: z.string(),
    user_id: z.string(),
    start_date: z.coerce.date(),
    end_date: z.coerce.date(),
    guests: z.number().int().positive(),
    total_price: z.number(),
    is_paid: z.boolean(),
    payment_error_message: z.string().nullable()
});
export const createBookingInputSchema = z.object({
    property_id: z.string(),
    user_id: z.string(),
    start_date: z.string().min(1),
    end_date: z.string().min(1),
    guests: z.number().int().positive(),
    total_price: z.number(),
    is_paid: z.boolean(),
    payment_error_message: z.string().nullable().optional()
});
export const updateBookingInputSchema = z.object({
    booking_id: z.string(),
    property_id: z.string().optional(),
    user_id: z.string().optional(),
    start_date: z.string().min(1).optional(),
    end_date: z.string().min(1).optional(),
    guests: z.number().int().positive().optional(),
    total_price: z.number().optional(),
    is_paid: z.boolean().optional(),
    payment_error_message: z.string().nullable().optional()
});
export const searchBookingInputSchema = z.object({
    user_id: z.string().optional(),
    property_id: z.string().optional(),
    is_paid: z.boolean().optional(),
    query: z.string().optional(),
    limit: z.number().int().positive().default(10),
    offset: z.number().int().nonnegative().default(0),
    sort_by: z.enum(['start_date', 'total_price']).default('start_date'),
    sort_order: z.enum(['asc', 'desc']).default('asc')
});
// Review Schemas
export const reviewSchema = z.object({
    review_id: z.string(),
    property_id: z.string(),
    user_id: z.string(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().nullable(),
    created_at: z.coerce.date()
});
export const createReviewInputSchema = z.object({
    property_id: z.string(),
    user_id: z.string(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().nullable().optional()
});
export const updateReviewInputSchema = z.object({
    review_id: z.string(),
    property_id: z.string().optional(),
    user_id: z.string().optional(),
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().nullable().optional()
});
export const searchReviewInputSchema = z.object({
    property_id: z.string().optional(),
    user_id: z.string().optional(),
    rating: z.number().int().optional(),
    query: z.string().optional(),
    limit: z.number().int().positive().default(10),
    offset: z.number().int().nonnegative().default(0),
    sort_by: z.enum(['created_at', 'rating']).default('created_at'),
    sort_order: z.enum(['asc', 'desc']).default('desc')
});
// Message Schemas
export const messageSchema = z.object({
    message_id: z.string(),
    sender_id: z.string(),
    recipient_id: z.string(),
    property_id: z.string().nullable(),
    content: z.string(),
    timestamp: z.coerce.date()
});
export const createMessageInputSchema = z.object({
    sender_id: z.string(),
    recipient_id: z.string(),
    property_id: z.string().nullable().optional(),
    content: z.string().min(1)
});
export const updateMessageInputSchema = z.object({
    message_id: z.string(),
    sender_id: z.string().optional(),
    recipient_id: z.string().optional(),
    property_id: z.string().nullable().optional(),
    content: z.string().min(1).optional()
});
export const searchMessageInputSchema = z.object({
    sender_id: z.string().optional(),
    recipient_id: z.string().optional(),
    property_id: z.string().optional(),
    query: z.string().optional(),
    limit: z.number().int().positive().default(10),
    offset: z.number().int().nonnegative().default(0),
    sort_by: z.enum(['timestamp']).default('timestamp'),
    sort_order: z.enum(['asc', 'desc']).default('desc')
});
// Auth Token Schemas
export const authTokenSchema = z.object({
    token_id: z.string(),
    user_id: z.string(),
    token: z.string(),
    is_valid: z.boolean(),
    created_at: z.coerce.date()
});
export const createAuthTokenInputSchema = z.object({
    user_id: z.string(),
    token: z.string().min(1),
    is_valid: z.boolean()
});
export const updateAuthTokenInputSchema = z.object({
    token_id: z.string(),
    user_id: z.string().optional(),
    token: z.string().min(1).optional(),
    is_valid: z.boolean().optional()
});
export const searchAuthTokenInputSchema = z.object({
    user_id: z.string().optional(),
    is_valid: z.boolean().optional(),
    query: z.string().optional(),
    limit: z.number().int().positive().default(10),
    offset: z.number().int().nonnegative().default(0),
    sort_by: z.enum(['created_at']).default('created_at'),
    sort_order: z.enum(['asc', 'desc']).default('desc')
});
// Search Schemas
export const searchSchema = z.object({
    search_id: z.string(),
    user_id: z.string().nullable(),
    location: z.string(),
    price_min: z.number(),
    price_max: z.number(),
    start_date: z.coerce.date(),
    end_date: z.coerce.date(),
    accommodation_type: z.string().nullable(),
    amenities: z.array(z.string()).nullable()
});
export const createSearchInputSchema = z.object({
    user_id: z.string().nullable().optional(),
    location: z.string().min(1),
    price_min: z.number().nonnegative(),
    price_max: z.number().nonnegative(),
    start_date: z.string().min(1),
    end_date: z.string().min(1),
    accommodation_type: z.string().nullable().optional(),
    amenities: z.array(z.string()).nullable().optional()
});
export const updateSearchInputSchema = z.object({
    search_id: z.string(),
    user_id: z.string().nullable().optional(),
    location: z.string().min(1).optional(),
    price_min: z.number().nonnegative().optional(),
    price_max: z.number().nonnegative().optional(),
    start_date: z.string().min(1).optional(),
    end_date: z.string().min(1).optional(),
    accommodation_type: z.string().nullable().optional(),
    amenities: z.array(z.string()).nullable().optional()
});
export const filterSearchInputSchema = z.object({
    user_id: z.string().optional(),
    location: z.string().optional(),
    query: z.string().optional(),
    limit: z.number().int().positive().default(10),
    offset: z.number().int().nonnegative().default(0),
    sort_by: z.enum(['start_date', 'price_min']).default('start_date'),
    sort_order: z.enum(['asc', 'desc']).default('asc')
});
//# sourceMappingURL=schema.js.map