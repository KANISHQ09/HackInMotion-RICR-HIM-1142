import {
  UnifiedContext,
  FinancialInsight,
  ActionableRecommendation,
  UnifiedIntelligenceResult,
  IntelligenceSummary,
} from './types.js';
import { LLMProvider } from '../llm/types.js';
import { createLLMProvider } from '../llm/provider.js';
import { explainFinancialHealth } from './health-explanation.js';

export interface ExplainerOptions {
  provider?: LLMProvider | null;
}

/**
 * Builds system & user prompt for natural-language financial intelligence synthesis
 */
function buildIntelligencePrompt(
  context: UnifiedContext,
  insights: FinancialInsight[],
  recommendations: ActionableRecommendation[],
  healthExplanationText: string
): string {
  const topIssueText = insights.length > 0 ? insights[0].title : 'No major issues detected.';

  return `You are Spendly's Financial Intelligence System.

## STRICT GROUNDING & SAFETY RULES (MUST FOLLOW):
1. Use ONLY the exact numbers provided below.
2. DO NOT change, round, or alter any numeric value.
3. DO NOT invent bank accounts, transactions, merchants, budgets, or recurring subscriptions.
4. DO NOT invent user behaviors or intentions.
5. Explain the facts provided strictly and naturally.

## Context Data:
Health Score: ${context.healthScore?.score ?? 70}
Top Issue: ${topIssueText}
Health Explanation: ${healthExplanationText}

## Detected Insights (${insights.length}):
${insights.map((i) => `- [${i.severity.toUpperCase()}] ${i.title}: ${i.explanation}`).join('\n')}

## Recommended Actions (${recommendations.length}):
${recommendations.map((r) => `- ${r.title}: ${r.action} (Reason: ${r.reason})`).join('\n')}

## Task:
Provide a 2 to 3 sentence natural language executive summary of the user's financial status based strictly on the data above.`;
}

/**
 * Primary AI Intelligence Orchestration Pipeline
 */
export async function generateUnifiedIntelligence(
  context: UnifiedContext,
  insights: FinancialInsight[],
  recommendations: ActionableRecommendation[],
  options?: ExplainerOptions
): Promise<UnifiedIntelligenceResult> {
  const healthDetails = explainFinancialHealth(context, insights);
  let healthExplanation = healthDetails.explanation;

  const topIssue = insights.length > 0 ? insights[0].title : 'Overall financial status is stable.';
  const criticalCount = insights.filter((i) => i.severity === 'critical').length;

  const summary: IntelligenceSummary = {
    healthScore: context.healthScore?.score ?? 70,
    topIssue,
    totalInsights: insights.length,
    criticalCount,
  };

  const provider = options?.provider !== undefined ? options.provider : createLLMProvider();

  if (provider && insights.length > 0) {
    try {
      const prompt = buildIntelligencePrompt(context, insights, recommendations, healthExplanation);
      const llmResult = await provider.classifyTransaction({
        transaction: {
          id: 'intelligence-summary',
          userId: 'usr',
          amount: 0,
          type: 'expense',
          date: new Date().toISOString(),
          description: prompt,
          currency: context.currency || 'INR',
        },
        categories: [],
      });

      if (llmResult.reason && llmResult.reason.length > 15 && !llmResult.reason.startsWith('{')) {
        healthExplanation = llmResult.reason;
      }
    } catch {
      // Retain deterministic health explanation on LLM failure or timeout
    }
  }

  // Build assistant-ready context for seamlessly feeding into AI Financial Assistant
  const assistantReadyContext = {
    currency: context.currency || 'INR',
    summary: context.summary,
    topIssue,
    healthScore: context.healthScore,
    insights: insights.map((i) => ({ title: i.title, explanation: i.explanation, severity: i.severity })),
    recommendations: recommendations.map((r) => ({ title: r.title, action: r.action })),
    categories: context.categories,
    budgets: context.budgets,
    recurring: context.recurring,
    anomalies: context.anomalies,
  };

  return {
    summary,
    insights,
    recommendations,
    healthExplanation,
    assistantReadyContext,
  };
}
