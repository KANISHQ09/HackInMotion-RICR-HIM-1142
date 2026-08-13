import { z } from 'zod';

export const assistantIntentSchema = z.enum([
  'spending_summary',
  'category_spending',
  'spending_trend',
  'budget_status',
  'savings_status',
  'recurring_expenses',
  'anomaly_explanation',
  'financial_health',
  'recommendations',
  'general_finance',
]);

export type AssistantIntent = z.infer<typeof assistantIntentSchema>;

interface IntentRule {
  intent: AssistantIntent;
  patterns: RegExp[];
}

const INTENT_RULES: IntentRule[] = [
  {
    intent: 'category_spending',
    patterns: [
      /spend.*(on|for|in)\s+([a-z\/]+)/i,
      /how much.*(food|groceries|rent|bills|shopping|transport|travel|entertainment|health|education|subscription|personal|care|insurance|fee)/i,
      /(food|groceries|rent|bills|shopping|transport|travel|entertainment|health|education|subscription|personal|care|insurance|fee).*(cost|spend|expense)/i,
    ],
  },
  {
    intent: 'budget_status',
    patterns: [
      /budget/i,
      /over\s+limit/i,
      /limit\s+left/i,
      /exceed.*budget/i,
    ],
  },
  {
    intent: 'recommendations',
    patterns: [
      /recommend|advice|tip|how to save|how can i save|improve/i,
      /what should i do/i,
    ],
  },
  {
    intent: 'savings_status',
    patterns: [
      /net savings|saving rate|how much am i saving/i,
      /\b(savings|saved)\b/i,
      /why.*save.*(less|more)/i,
      /save/i,
    ],
  },
  {
    intent: 'recurring_expenses',
    patterns: [
      /subscription|recurring|membership|monthly bill|saas/i,
      /repeat.*payment/i,
    ],
  },
  {
    intent: 'anomaly_explanation',
    patterns: [
      /anomaly|anomalies|unusual|unexpected|spike|high spend|spending.*high/i,
      /why.*so high/i,
    ],
  },
  {
    intent: 'financial_health',
    patterns: [
      /health|score|financial health/i,
      /why.*score/i,
    ],
  },
  {
    intent: 'spending_trend',
    patterns: [
      /trend|monthly|month over month|history|compare/i,
      /going up|increasing/i,
    ],
  },
  {
    intent: 'spending_summary',
    patterns: [
      /highest|largest|total expense|total spend|summary|overview/i,
      /where did my money go/i,
    ],
  },
];

/**
 * Deterministically classifies user message intent using lightweight keyword matching.
 */
export function detectAssistantIntent(message: string): AssistantIntent {
  const text = message.trim().toLowerCase();

  for (const rule of INTENT_RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(text)) {
        return rule.intent;
      }
    }
  }

  return 'general_finance';
}
