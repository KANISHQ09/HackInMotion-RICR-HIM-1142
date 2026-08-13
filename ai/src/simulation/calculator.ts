import { SimulationRequest, SimulationScenario } from './types.js';

export interface DeterministicSimulationResult {
  currency: string;
  months: number;
  scenarioDescription: string;
  current: {
    monthlyExpenses: number;
    monthlySavings: number;
    savingsRate: number; // percentage
  };
  projected: {
    monthlyExpenses: number;
    monthlySavings: number;
    savingsRate: number; // percentage
  };
  impact: {
    monthlySavingsIncrease: number;
    annualSavingsIncrease: number;
    totalPeriodImpact: number;
    savingsRateIncrease: number; // percentage points
  };
}

/**
 * Calculates deterministic scenario savings impact
 */
export function calculateSavingsSimulation(request: SimulationRequest): DeterministicSimulationResult {
  const income = request.monthlyIncome;
  const currentExpenses = request.currentMonthlyExpenses;
  const currentSavings =
    request.currentMonthlySavings !== undefined
      ? request.currentMonthlySavings
      : income - currentExpenses;

  const currentSavingsRate = income > 0 ? (currentSavings / income) * 100 : 0;

  let monthlySavingsIncrease = 0;
  let scenarioDescription = '';

  const scenario = request.scenario;

  switch (scenario.type) {
    case 'category_reduction': {
      if (scenario.reductionPercent !== undefined) {
        monthlySavingsIncrease = (scenario.currentMonthlySpend * scenario.reductionPercent) / 100;
        scenarioDescription = `Reduce ${scenario.category} spend by ${scenario.reductionPercent}% (${request.currency} ${monthlySavingsIncrease.toFixed(2)}/mo)`;
      } else if (scenario.reductionAmount !== undefined) {
        monthlySavingsIncrease = Math.min(scenario.currentMonthlySpend, scenario.reductionAmount);
        scenarioDescription = `Reduce ${scenario.category} spend by ${request.currency} ${monthlySavingsIncrease.toFixed(2)}/mo`;
      } else {
        throw new Error('Category reduction scenario requires reductionPercent or reductionAmount');
      }
      break;
    }

    case 'recurring_cancellation': {
      monthlySavingsIncrease = scenario.monthlyAmount;
      scenarioDescription = `Cancel recurring subscription: ${scenario.description} (${request.currency} ${monthlySavingsIncrease.toFixed(2)}/mo)`;
      break;
    }

    case 'multi_category_reduction': {
      let totalRed = 0;
      scenario.categories.forEach((item) => {
        if (item.reductionPercent !== undefined) {
          totalRed += (item.currentMonthlySpend * item.reductionPercent) / 100;
        } else if (item.reductionAmount !== undefined) {
          totalRed += Math.min(item.currentMonthlySpend, item.reductionAmount);
        }
      });
      monthlySavingsIncrease = totalRed;
      scenarioDescription = `Reduce spend across ${scenario.categories.length} categories by total ${request.currency} ${monthlySavingsIncrease.toFixed(2)}/mo`;
      break;
    }

    case 'savings_rate_target': {
      const targetSavings = (income * scenario.targetSavingsRate) / 100;
      monthlySavingsIncrease = Math.max(0, targetSavings - currentSavings);
      scenarioDescription = `Target a ${scenario.targetSavingsRate}% monthly savings rate`;
      break;
    }
  }

  // Cap reduction to current expenses
  monthlySavingsIncrease = Math.min(currentExpenses, Math.max(0, monthlySavingsIncrease));

  const newExpenses = Math.max(0, currentExpenses - monthlySavingsIncrease);
  const newSavings = currentSavings + monthlySavingsIncrease;
  const newSavingsRate = income > 0 ? (newSavings / income) * 100 : 0;

  const annualIncrease = monthlySavingsIncrease * 12;
  const totalPeriodImpact = monthlySavingsIncrease * request.months;
  const savingsRateIncrease = newSavingsRate - currentSavingsRate;

  return {
    currency: request.currency,
    months: request.months,
    scenarioDescription,
    current: {
      monthlyExpenses: Number(currentExpenses.toFixed(2)),
      monthlySavings: Number(currentSavings.toFixed(2)),
      savingsRate: Number(currentSavingsRate.toFixed(2)),
    },
    projected: {
      monthlyExpenses: Number(newExpenses.toFixed(2)),
      monthlySavings: Number(newSavings.toFixed(2)),
      savingsRate: Number(newSavingsRate.toFixed(2)),
    },
    impact: {
      monthlySavingsIncrease: Number(monthlySavingsIncrease.toFixed(2)),
      annualSavingsIncrease: Number(annualIncrease.toFixed(2)),
      totalPeriodImpact: Number(totalPeriodImpact.toFixed(2)),
      savingsRateIncrease: Number(savingsRateIncrease.toFixed(2)),
    },
  };
}
