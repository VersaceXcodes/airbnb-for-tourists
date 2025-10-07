import { z } from 'zod';
export declare const userSchema: z.ZodObject<{
    user_id: z.ZodString;
    email: z.ZodString;
    password_hash: z.ZodString;
    name: z.ZodString;
    created_at: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    email?: string;
    password_hash?: string;
    name?: string;
    created_at?: Date;
}, {
    user_id?: string;
    email?: string;
    password_hash?: string;
    name?: string;
    created_at?: Date;
}>;
export declare const createUserInputSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email?: string;
    name?: string;
    password?: string;
}, {
    email?: string;
    name?: string;
    password?: string;
}>;
export declare const updateUserInputSchema: z.ZodObject<{
    user_id: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    password_hash: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    email?: string;
    password_hash?: string;
    name?: string;
}, {
    user_id?: string;
    email?: string;
    password_hash?: string;
    name?: string;
}>;
export declare const searchUserInputSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
    sort_by: z.ZodDefault<z.ZodEnum<["name", "created_at"]>>;
    sort_order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "name" | "created_at";
    sort_order?: "asc" | "desc";
}, {
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "name" | "created_at";
    sort_order?: "asc" | "desc";
}>;
export declare const propertySchema: z.ZodObject<{
    property_id: z.ZodString;
    name: z.ZodString;
    location: z.ZodString;
    host_id: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    accommodation_type: z.ZodString;
    amenities: z.ZodNullable<z.ZodArray<z.ZodString, "many">>;
    price: z.ZodNumber;
    images: z.ZodNullable<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    property_id?: string;
    location?: string;
    host_id?: string;
    description?: string;
    accommodation_type?: string;
    amenities?: string[];
    price?: number;
    images?: {};
}, {
    name?: string;
    property_id?: string;
    location?: string;
    host_id?: string;
    description?: string;
    accommodation_type?: string;
    amenities?: string[];
    price?: number;
    images?: {};
}>;
export declare const createPropertyInputSchema: z.ZodObject<{
    name: z.ZodString;
    location: z.ZodString;
    host_id: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    accommodation_type: z.ZodString;
    amenities: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString, "many">>>;
    price: z.ZodNumber;
    images: z.ZodOptional<z.ZodNullable<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    location?: string;
    host_id?: string;
    description?: string;
    accommodation_type?: string;
    amenities?: string[];
    price?: number;
    images?: {};
}, {
    name?: string;
    location?: string;
    host_id?: string;
    description?: string;
    accommodation_type?: string;
    amenities?: string[];
    price?: number;
    images?: {};
}>;
export declare const updatePropertyInputSchema: z.ZodObject<{
    property_id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    host_id: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    accommodation_type: z.ZodOptional<z.ZodString>;
    amenities: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString, "many">>>;
    price: z.ZodOptional<z.ZodNumber>;
    images: z.ZodOptional<z.ZodNullable<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    property_id?: string;
    location?: string;
    host_id?: string;
    description?: string;
    accommodation_type?: string;
    amenities?: string[];
    price?: number;
    images?: {};
}, {
    name?: string;
    property_id?: string;
    location?: string;
    host_id?: string;
    description?: string;
    accommodation_type?: string;
    amenities?: string[];
    price?: number;
    images?: {};
}>;
export declare const searchPropertyInputSchema: z.ZodObject<{
    location: z.ZodOptional<z.ZodString>;
    price_min: z.ZodOptional<z.ZodNumber>;
    price_max: z.ZodOptional<z.ZodNumber>;
    accommodation_type: z.ZodOptional<z.ZodString>;
    amenities: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    query: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
    sort_by: z.ZodDefault<z.ZodEnum<["name", "price"]>>;
    sort_order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "name" | "price";
    sort_order?: "asc" | "desc";
    location?: string;
    accommodation_type?: string;
    amenities?: string[];
    price_min?: number;
    price_max?: number;
}, {
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "name" | "price";
    sort_order?: "asc" | "desc";
    location?: string;
    accommodation_type?: string;
    amenities?: string[];
    price_min?: number;
    price_max?: number;
}>;
export declare const bookingSchema: z.ZodObject<{
    booking_id: z.ZodString;
    property_id: z.ZodString;
    user_id: z.ZodString;
    start_date: z.ZodDate;
    end_date: z.ZodDate;
    guests: z.ZodNumber;
    total_price: z.ZodNumber;
    is_paid: z.ZodBoolean;
    payment_error_message: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    property_id?: string;
    booking_id?: string;
    start_date?: Date;
    end_date?: Date;
    guests?: number;
    total_price?: number;
    is_paid?: boolean;
    payment_error_message?: string;
}, {
    user_id?: string;
    property_id?: string;
    booking_id?: string;
    start_date?: Date;
    end_date?: Date;
    guests?: number;
    total_price?: number;
    is_paid?: boolean;
    payment_error_message?: string;
}>;
export declare const createBookingInputSchema: z.ZodObject<{
    property_id: z.ZodString;
    user_id: z.ZodString;
    start_date: z.ZodString;
    end_date: z.ZodString;
    guests: z.ZodNumber;
    total_price: z.ZodNumber;
    is_paid: z.ZodBoolean;
    payment_error_message: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    property_id?: string;
    start_date?: string;
    end_date?: string;
    guests?: number;
    total_price?: number;
    is_paid?: boolean;
    payment_error_message?: string;
}, {
    user_id?: string;
    property_id?: string;
    start_date?: string;
    end_date?: string;
    guests?: number;
    total_price?: number;
    is_paid?: boolean;
    payment_error_message?: string;
}>;
export declare const updateBookingInputSchema: z.ZodObject<{
    booking_id: z.ZodString;
    property_id: z.ZodOptional<z.ZodString>;
    user_id: z.ZodOptional<z.ZodString>;
    start_date: z.ZodOptional<z.ZodString>;
    end_date: z.ZodOptional<z.ZodString>;
    guests: z.ZodOptional<z.ZodNumber>;
    total_price: z.ZodOptional<z.ZodNumber>;
    is_paid: z.ZodOptional<z.ZodBoolean>;
    payment_error_message: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    property_id?: string;
    booking_id?: string;
    start_date?: string;
    end_date?: string;
    guests?: number;
    total_price?: number;
    is_paid?: boolean;
    payment_error_message?: string;
}, {
    user_id?: string;
    property_id?: string;
    booking_id?: string;
    start_date?: string;
    end_date?: string;
    guests?: number;
    total_price?: number;
    is_paid?: boolean;
    payment_error_message?: string;
}>;
export declare const searchBookingInputSchema: z.ZodObject<{
    user_id: z.ZodOptional<z.ZodString>;
    property_id: z.ZodOptional<z.ZodString>;
    is_paid: z.ZodOptional<z.ZodBoolean>;
    query: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
    sort_by: z.ZodDefault<z.ZodEnum<["start_date", "total_price"]>>;
    sort_order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "start_date" | "total_price";
    sort_order?: "asc" | "desc";
    property_id?: string;
    is_paid?: boolean;
}, {
    user_id?: string;
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "start_date" | "total_price";
    sort_order?: "asc" | "desc";
    property_id?: string;
    is_paid?: boolean;
}>;
export declare const reviewSchema: z.ZodObject<{
    review_id: z.ZodString;
    property_id: z.ZodString;
    user_id: z.ZodString;
    rating: z.ZodNumber;
    comment: z.ZodNullable<z.ZodString>;
    created_at: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    created_at?: Date;
    property_id?: string;
    review_id?: string;
    rating?: number;
    comment?: string;
}, {
    user_id?: string;
    created_at?: Date;
    property_id?: string;
    review_id?: string;
    rating?: number;
    comment?: string;
}>;
export declare const createReviewInputSchema: z.ZodObject<{
    property_id: z.ZodString;
    user_id: z.ZodString;
    rating: z.ZodNumber;
    comment: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    property_id?: string;
    rating?: number;
    comment?: string;
}, {
    user_id?: string;
    property_id?: string;
    rating?: number;
    comment?: string;
}>;
export declare const updateReviewInputSchema: z.ZodObject<{
    review_id: z.ZodString;
    property_id: z.ZodOptional<z.ZodString>;
    user_id: z.ZodOptional<z.ZodString>;
    rating: z.ZodOptional<z.ZodNumber>;
    comment: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    property_id?: string;
    review_id?: string;
    rating?: number;
    comment?: string;
}, {
    user_id?: string;
    property_id?: string;
    review_id?: string;
    rating?: number;
    comment?: string;
}>;
export declare const searchReviewInputSchema: z.ZodObject<{
    property_id: z.ZodOptional<z.ZodString>;
    user_id: z.ZodOptional<z.ZodString>;
    rating: z.ZodOptional<z.ZodNumber>;
    query: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
    sort_by: z.ZodDefault<z.ZodEnum<["created_at", "rating"]>>;
    sort_order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "created_at" | "rating";
    sort_order?: "asc" | "desc";
    property_id?: string;
    rating?: number;
}, {
    user_id?: string;
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "created_at" | "rating";
    sort_order?: "asc" | "desc";
    property_id?: string;
    rating?: number;
}>;
export declare const messageSchema: z.ZodObject<{
    message_id: z.ZodString;
    sender_id: z.ZodString;
    recipient_id: z.ZodString;
    property_id: z.ZodNullable<z.ZodString>;
    content: z.ZodString;
    timestamp: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    property_id?: string;
    message_id?: string;
    sender_id?: string;
    recipient_id?: string;
    content?: string;
    timestamp?: Date;
}, {
    property_id?: string;
    message_id?: string;
    sender_id?: string;
    recipient_id?: string;
    content?: string;
    timestamp?: Date;
}>;
export declare const createMessageInputSchema: z.ZodObject<{
    sender_id: z.ZodString;
    recipient_id: z.ZodString;
    property_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    property_id?: string;
    sender_id?: string;
    recipient_id?: string;
    content?: string;
}, {
    property_id?: string;
    sender_id?: string;
    recipient_id?: string;
    content?: string;
}>;
export declare const updateMessageInputSchema: z.ZodObject<{
    message_id: z.ZodString;
    sender_id: z.ZodOptional<z.ZodString>;
    recipient_id: z.ZodOptional<z.ZodString>;
    property_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    content: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    property_id?: string;
    message_id?: string;
    sender_id?: string;
    recipient_id?: string;
    content?: string;
}, {
    property_id?: string;
    message_id?: string;
    sender_id?: string;
    recipient_id?: string;
    content?: string;
}>;
export declare const searchMessageInputSchema: z.ZodObject<{
    sender_id: z.ZodOptional<z.ZodString>;
    recipient_id: z.ZodOptional<z.ZodString>;
    property_id: z.ZodOptional<z.ZodString>;
    query: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
    sort_by: z.ZodDefault<z.ZodEnum<["timestamp"]>>;
    sort_order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "timestamp";
    sort_order?: "asc" | "desc";
    property_id?: string;
    sender_id?: string;
    recipient_id?: string;
}, {
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "timestamp";
    sort_order?: "asc" | "desc";
    property_id?: string;
    sender_id?: string;
    recipient_id?: string;
}>;
export declare const authTokenSchema: z.ZodObject<{
    token_id: z.ZodString;
    user_id: z.ZodString;
    token: z.ZodString;
    is_valid: z.ZodBoolean;
    created_at: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    created_at?: Date;
    token_id?: string;
    token?: string;
    is_valid?: boolean;
}, {
    user_id?: string;
    created_at?: Date;
    token_id?: string;
    token?: string;
    is_valid?: boolean;
}>;
export declare const createAuthTokenInputSchema: z.ZodObject<{
    user_id: z.ZodString;
    token: z.ZodString;
    is_valid: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    token?: string;
    is_valid?: boolean;
}, {
    user_id?: string;
    token?: string;
    is_valid?: boolean;
}>;
export declare const updateAuthTokenInputSchema: z.ZodObject<{
    token_id: z.ZodString;
    user_id: z.ZodOptional<z.ZodString>;
    token: z.ZodOptional<z.ZodString>;
    is_valid: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    token_id?: string;
    token?: string;
    is_valid?: boolean;
}, {
    user_id?: string;
    token_id?: string;
    token?: string;
    is_valid?: boolean;
}>;
export declare const searchAuthTokenInputSchema: z.ZodObject<{
    user_id: z.ZodOptional<z.ZodString>;
    is_valid: z.ZodOptional<z.ZodBoolean>;
    query: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
    sort_by: z.ZodDefault<z.ZodEnum<["created_at"]>>;
    sort_order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "created_at";
    sort_order?: "asc" | "desc";
    is_valid?: boolean;
}, {
    user_id?: string;
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "created_at";
    sort_order?: "asc" | "desc";
    is_valid?: boolean;
}>;
export declare const searchSchema: z.ZodObject<{
    search_id: z.ZodString;
    user_id: z.ZodNullable<z.ZodString>;
    location: z.ZodString;
    price_min: z.ZodNumber;
    price_max: z.ZodNumber;
    start_date: z.ZodDate;
    end_date: z.ZodDate;
    accommodation_type: z.ZodNullable<z.ZodString>;
    amenities: z.ZodNullable<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    location?: string;
    accommodation_type?: string;
    amenities?: string[];
    price_min?: number;
    price_max?: number;
    start_date?: Date;
    end_date?: Date;
    search_id?: string;
}, {
    user_id?: string;
    location?: string;
    accommodation_type?: string;
    amenities?: string[];
    price_min?: number;
    price_max?: number;
    start_date?: Date;
    end_date?: Date;
    search_id?: string;
}>;
export declare const createSearchInputSchema: z.ZodObject<{
    user_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    location: z.ZodString;
    price_min: z.ZodNumber;
    price_max: z.ZodNumber;
    start_date: z.ZodString;
    end_date: z.ZodString;
    accommodation_type: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    amenities: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    location?: string;
    accommodation_type?: string;
    amenities?: string[];
    price_min?: number;
    price_max?: number;
    start_date?: string;
    end_date?: string;
}, {
    user_id?: string;
    location?: string;
    accommodation_type?: string;
    amenities?: string[];
    price_min?: number;
    price_max?: number;
    start_date?: string;
    end_date?: string;
}>;
export declare const updateSearchInputSchema: z.ZodObject<{
    search_id: z.ZodString;
    user_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    location: z.ZodOptional<z.ZodString>;
    price_min: z.ZodOptional<z.ZodNumber>;
    price_max: z.ZodOptional<z.ZodNumber>;
    start_date: z.ZodOptional<z.ZodString>;
    end_date: z.ZodOptional<z.ZodString>;
    accommodation_type: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    amenities: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    location?: string;
    accommodation_type?: string;
    amenities?: string[];
    price_min?: number;
    price_max?: number;
    start_date?: string;
    end_date?: string;
    search_id?: string;
}, {
    user_id?: string;
    location?: string;
    accommodation_type?: string;
    amenities?: string[];
    price_min?: number;
    price_max?: number;
    start_date?: string;
    end_date?: string;
    search_id?: string;
}>;
export declare const filterSearchInputSchema: z.ZodObject<{
    user_id: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    query: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
    sort_by: z.ZodDefault<z.ZodEnum<["start_date", "price_min"]>>;
    sort_order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    user_id?: string;
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "price_min" | "start_date";
    sort_order?: "asc" | "desc";
    location?: string;
}, {
    user_id?: string;
    query?: string;
    limit?: number;
    offset?: number;
    sort_by?: "price_min" | "start_date";
    sort_order?: "asc" | "desc";
    location?: string;
}>;
export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserInputSchema>;
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;
export type SearchUserInput = z.infer<typeof searchUserInputSchema>;
export type Property = z.infer<typeof propertySchema>;
export type CreatePropertyInput = z.infer<typeof createPropertyInputSchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertyInputSchema>;
export type SearchPropertyInput = z.infer<typeof searchPropertyInputSchema>;
export type Booking = z.infer<typeof bookingSchema>;
export type CreateBookingInput = z.infer<typeof createBookingInputSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingInputSchema>;
export type SearchBookingInput = z.infer<typeof searchBookingInputSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type CreateReviewInput = z.infer<typeof createReviewInputSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewInputSchema>;
export type SearchReviewInput = z.infer<typeof searchReviewInputSchema>;
export type Message = z.infer<typeof messageSchema>;
export type CreateMessageInput = z.infer<typeof createMessageInputSchema>;
export type UpdateMessageInput = z.infer<typeof updateMessageInputSchema>;
export type SearchMessageInput = z.infer<typeof searchMessageInputSchema>;
export type AuthToken = z.infer<typeof authTokenSchema>;
export type CreateAuthTokenInput = z.infer<typeof createAuthTokenInputSchema>;
export type UpdateAuthTokenInput = z.infer<typeof updateAuthTokenInputSchema>;
export type SearchAuthTokenInput = z.infer<typeof searchAuthTokenInputSchema>;
export type Search = z.infer<typeof searchSchema>;
export type CreateSearchInput = z.infer<typeof createSearchInputSchema>;
export type UpdateSearchInput = z.infer<typeof updateSearchInputSchema>;
export type FilterSearchInput = z.infer<typeof filterSearchInputSchema>;
//# sourceMappingURL=schema.d.ts.map