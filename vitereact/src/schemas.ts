import { z } from 'zod';

// Property Schemas - local frontend definitions to avoid backend imports
export const propertySchema = z.object({
  property_id: z.string(),
  name: z.string(),
  location: z.string(),
  host_id: z.string(),
  description: z.string().nullable(),
  accommodation_type: z.string(),
  amenities: z.array(z.string()).nullable(),
  price: z.number(),
  images: z.object({}).nullable()
});

export type Property = z.infer<typeof propertySchema>;

// Message Schema - local frontend definition
export const messageSchema = z.object({
  message_id: z.string(),
  sender_id: z.string(),
  recipient_id: z.string(),
  property_id: z.string().nullable(),
  content: z.string(),
  timestamp: z.coerce.date()
});

export type Message = z.infer<typeof messageSchema>;
