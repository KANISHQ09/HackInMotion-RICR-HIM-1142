import { SimulationRequest, validateSimulationRequest } from './types.js';
import { calculateSavingsSimulation, DeterministicSimulationResult } from './calculator.js';
import { LLMProvider } from '../llm/types.js';
import { createLLMProvider } from '../llm/provider.js';

export interface SimulationResult extends DeterministicSimulationResult {
  explanation: string;
}

export interface SimulatorOptions {
  provider?: LLMProvider | null;
}

/**
 * Builds prompt for LLM explanation of simulation results
 */
function buildSimulationExplanationPrompt(result: DeterministicSimulationResult): string {
  return `You are a financial planning assistant explaining a savings simulation result to a user.

## Scenario:
${result.scenarioDescription}

## Calculated Exact Numbers (DO NOT ALTER ANY NUMBER):
- Currency: ${result.currency}
- Period: ${result.months} months
- Current Monthly Expenses: ${result.current.monthlyExpenses}
- Current Monthly Savings: ${result.current.monthlySavings} (${result.current.savingsRate}%)
- Projected Monthly Expenses: ${result.projected.monthlyExpenses}
- Projected Monthly Savings: ${result.projected.monthlySavings} (${result.projected.savingsRate}%)
- Monthly Savings Increase: +${result.impact.monthlySavingsIncrease}
- Annual Savings Increase: +${result.impact.annualSavingsIncrease}
- Total ${result.months}-Month Impact: +${result.impact.totalPeriodImpact}
- Savings Rate Boost: +${result.impact.savingsRateIncrease}% points

## Task:
Provide a clear 2-sentence explanation of the financial impact of this scenario. Do not change any numbers or introduce new financial facts.`;
}

/**
 * Runs the full savings simulation pipeline
 */
export async function runSavingsSimulation(
  input: unknown,
  options?: SimulatorOptions
): Promise<SimulationResult> {
  const request = validateSimulationRequest(input);
  const result = calculateSavingsSimulation(request);

  let explanation = `${result.scenarioDescription} increases your monthly savings by ${result.currency} ${result.impact.monthlySavingsIncrease.toLocaleString()}, boosting your savings rate from ${result.current.savingsRate}% to ${result.projected.savingsRate}%. Over ${result.months} months, you will accumulate an extra ${result.currency} ${result.impact.totalPeriodImpact.toLocaleString()}.`;

  const provider = options?.provider !== undefined ? options.provider : createLLMProvider();

  if (provider) {
    try {
      const prompt = buildSimulationExplanationPrompt(result);
      const llmResult = await provider.classifyTransaction({
        transaction: {
          id: 'sim-explanation',
          userId: 'usr',
          amount: 0,
          type: 'expense',
          date: new Date().toISOString(),
          description: prompt,
          currency: result.currency,
        },
        categories: [],
      });

      if (llmResult.reason && llmResult.reason.length > 10 && !llmResult.reason.startsWith('{')) {
        explanation = llmResult.reason;
      }
    } catch {
      // Fallback narrative explanation preserved
    }
  }

  return {
    ...result,
    explanation,
  };
}
