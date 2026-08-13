import { z } from 'zod';
import { NormalizedTransaction } from '../types/transaction.js';
import { ExpenseCategoryDefinition } from '../categorization/categories.js';

export interface LLMClassificationRequest {
  transaction: NormalizedTransaction;
  categories: ExpenseCategoryDefinition[];
}

export const llmResponseSchema = z.object({
  categoryId: z.string().min(1, 'Category ID is required'),
  categoryName: z.string().min(1, 'Category Name is required'),
  confidence: z.number().min(0).max(1),
  reason: z.string().default('Categorized by LLM'),
});

export type LLMClassificationResponse = z.infer<typeof llmResponseSchema>;

export interface LLMProvider {
  name: string;
  classifyTransaction(request: LLMClassificationRequest): Promise<LLMClassificationResponse>;
}
