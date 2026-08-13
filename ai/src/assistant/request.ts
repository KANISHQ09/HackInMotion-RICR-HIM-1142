import { z } from 'zod';
import { financialContextSchema, FinancialContext } from './types.js';

export const conversationMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(2000),
});

export type ConversationMessage = z.infer<typeof conversationMessageSchema>;

export const assistantRequestSchema = z.object({
  message: z
    .string({ required_error: 'Message is required' })
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message exceeds maximum length of 1000 characters'),
  context: financialContextSchema.default({ currency: 'INR' }),
  conversation: z.array(conversationMessageSchema).max(10, 'Conversation history limit is 10 items').optional().default([]),
});

export type AssistantRequest = z.infer<typeof assistantRequestSchema>;

/**
 * Validates raw assistant request payload
 */
export function validateAssistantRequest(input: unknown): AssistantRequest {
  if (!input || typeof input !== 'object') {
    throw new Error('Invalid request: payload must be a non-null JSON object');
  }

  const raw = input as Record<string, unknown>;

  return assistantRequestSchema.parse({
    message: typeof raw.message === 'string' ? raw.message.trim() : raw.message,
    context: raw.context || {},
    conversation: raw.conversation || [],
  });
}
