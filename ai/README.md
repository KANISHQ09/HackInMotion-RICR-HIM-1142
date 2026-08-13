# Spendly AI Intelligence Service

The `ai/` directory contains Spendly's independent microservice for transaction data normalization, hybrid rule-and-LLM categorization, unified financial intelligence & recommendations, AI chat financial assistance, and savings/expense impact simulation.

## Architecture & Service Boundary Rules

1. **Standalone Microservice**: The AI service operates independently of backend databases.
2. **Stateless HTTP API**: All financial context (summary, categories, budgets, recurring subscriptions, anomalies, health score, goals) is provided through validated HTTP request payloads.
3. **Deterministic Financial Arithmetic**: The LLM is NEVER used as the source of truth for arithmetic, category spending totals, or savings calculations. All financial math is computed deterministically in TypeScript code.
4. **Resilient Fallbacks**: Every pipeline (categorization, assistant, simulation, intelligence) functions reliably with 100% uptime even when no LLM API key is configured.
5. **Strict Grounding Rules**: Insights, recommendations, and health explanations are strictly bound to supplied numbers. The LLM is prohibited from inventing transactions, balances, or user behaviors.

---

## Architecture Flow

```text
Incoming Requests (HTTP REST on Port 3001)
├── GET  /health           ──► System Health Check
├── POST /api/v1/categorize ──► 4-Stage Cascade (Normalize → Rules → Confidence Check → LLM Fallback)
├── POST /api/v1/assistant  ──► Deterministic Intent & Fact Extraction ──► Optional LLM Explanation
├── POST /api/v1/simulate   ──► Deterministic Arithmetic Engine ──────► Optional LLM Narrative
└── POST /api/v1/insights   ──► Unified Intelligence Engine ──────────► Prioritized Insights & Recs
```

---

## Capabilities & Endpoints

### 1. `GET /health`
System health check endpoint.

**Response (200 OK):**
```json
{
  "status": "ok",
  "service": "ai"
}
```

---

### 2. `POST /api/v1/categorize`
Classifies a transaction into one of 15 expense categories using a hybrid cascade.

**Request Payload:**
```json
{
  "transaction": {
    "id": "tx-101",
    "userId": "42",
    "amount": 450.50,
    "type": "expense",
    "date": "2026-08-13T10:00:00.000Z",
    "merchant": "SWIGGY",
    "description": "SWIGGY INSTAMART ORDER",
    "accountId": "1",
    "currency": "INR"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "prediction": {
    "categoryId": "food",
    "categoryName": "Food",
    "confidence": 0.97,
    "method": "rule",
    "matchedSignals": ["swiggy"],
    "reason": "Matched keyword/merchant signals: swiggy"
  }
}
```

---

### 3. `POST /api/v1/assistant`
Chat-based financial assistant with intent detection, fact extraction, and LLM explanation layer.

**Supported Intents:**
- `category_spending`, `budget_status`, `savings_status`, `recurring_expenses`, `anomaly_explanation`, `financial_health`, `spending_trend`, `spending_summary`, `recommendations`, `general_finance`.

**Request Payload:**
```json
{
  "message": "How much did I spend on food?",
  "context": {
    "currency": "INR",
    "summary": {
      "income": 65000,
      "expenses": 48200,
      "savings": 16800,
      "savingsRate": 25.85
    },
    "categories": [
      { "category": "Food", "amount": 8400, "percentage": 17.43 },
      { "category": "Rent", "amount": 15000, "percentage": 31.12 }
    ]
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "answer": "You spent INR 8,400 on Food, which represents 17.43% of your total monthly expenses.",
    "intent": "category_spending",
    "facts": [
      { "label": "Food spending", "value": 8400, "currency": "INR" },
      { "label": "Share of total expenses", "value": "17.43%" }
    ],
    "recommendations": [],
    "confidence": 0.95
  }
}
```

---

### 4. `POST /api/v1/simulate`
Savings and expense impact simulator supporting 4 scenario types:
1. `category_reduction` (percentage or fixed amount reduction)
2. `recurring_cancellation` (cancel recurring subscription)
3. `multi_category_reduction` (reduce spend across multiple categories)
4. `savings_rate_target` (calculate effort needed to hit target savings rate)

**Request Payload:**
```json
{
  "currency": "INR",
  "monthlyIncome": 65000,
  "currentMonthlyExpenses": 48200,
  "scenario": {
    "type": "category_reduction",
    "category": "Food",
    "currentMonthlySpend": 8400,
    "reductionPercent": 30
  },
  "months": 12
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "simulation": {
    "currency": "INR",
    "months": 12,
    "scenarioDescription": "Reduce Food spend by 30% (INR 2520.00/mo)",
    "current": {
      "monthlyExpenses": 48200,
      "monthlySavings": 16800,
      "savingsRate": 25.85
    },
    "projected": {
      "monthlyExpenses": 45680,
      "monthlySavings": 19320,
      "savingsRate": 29.72
    },
    "impact": {
      "monthlySavingsIncrease": 2520,
      "annualSavingsIncrease": 30240,
      "totalPeriodImpact": 30240,
      "savingsRateIncrease": 3.87
    },
    "explanation": "Reducing Food spend by 30% increases your monthly savings by INR 2,520, boosting your savings rate from 25.85% to 29.72%. Over 12 months, you will accumulate an extra INR 30,240."
  }
}
```

---

### 5. `POST /api/v1/insights`
Unified Financial Intelligence API that analyzes context, detects 13 financial insight patterns, prioritizes issues, generates evidence-backed recommendations, and explains the financial health score.

**Request Payload:**
```json
{
  "context": {
    "currency": "INR",
    "summary": {
      "income": 65000,
      "expenses": 48200,
      "savings": 16800,
      "savingsRate": 25.85
    },
    "categories": [
      { "category": "Food", "amount": 8400, "percentage": 17.43, "changePercent": 42.37 },
      { "category": "Rent", "amount": 15000, "percentage": 31.12 }
    ],
    "budgets": [
      { "category": "Food", "limitAmount": 8000, "spent": 8400, "remaining": -400, "progress": 105.0 }
    ],
    "recurring": [
      { "description": "Cloud VPS", "category": "Subscriptions", "count": 4, "amount": 2500 }
    ],
    "anomalies": [
      { "category": "Food", "amount": 8400, "average": 5500, "reason": "above 1.5x category average" }
    ],
    "healthScore": { "score": 68 }
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "healthScore": 68,
      "topIssue": "Over budget in Food",
      "totalInsights": 4,
      "criticalCount": 1
    },
    "insights": [
      {
        "id": "insight-budget-over-food",
        "type": "budget_overspending",
        "severity": "critical",
        "title": "Over budget in Food",
        "explanation": "You have exceeded your Food budget by INR 400 (105.0% of limit).",
        "metrics": { "spent": 8400, "limitAmount": 8000, "excessAmount": 400, "progress": 105 },
        "sourceData": "budget:Food",
        "recommendation": "Pause discretionary spend in Food for the rest of this period."
      },
      {
        "id": "insight-inc-food",
        "type": "category_spending_increase",
        "severity": "critical",
        "title": "Food spending increased",
        "explanation": "Food spending increased by 42.4% compared to previous period.",
        "metrics": { "currentAmount": 8400, "changePercent": 42.4, "previousAmount": 0 },
        "sourceData": "category:Food",
        "recommendation": "Consider reducing non-essential purchases in Food."
      }
    ],
    "recommendations": [
      {
        "id": "rec-budget-over-food",
        "title": "Cap spending in Food",
        "action": "Pause non-essential Food purchases to halt budget overspend.",
        "reason": "Currently over budget by INR 400 (8400 spent vs 8000 limit).",
        "supportingMetric": "Excess spend: INR 400",
        "estimatedMonthlyImpact": 400,
        "priority": "high"
      }
    ],
    "healthExplanation": "Your Financial Health Score is 68/100 (Good). Your financial health is stable. It is supported by consistent financial tracking. However, you have exceeded your food budget by inr 400 (105.0% of limit).",
    "assistantReadyContext": {
      "currency": "INR",
      "summary": { "income": 65000, "expenses": 48200, "savings": 16800, "savingsRate": 25.85 },
      "topIssue": "Over budget in Food",
      "healthScore": { "score": 68 }
    }
  }
}
```

---

## Environment & Setup

Create `.env` in `ai/`:

```env
AI_PORT=3001
AI_HOST=127.0.0.1
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
```

## Running & Testing

```bash
cd ai
npm run build      # Compile TypeScript to dist/
npm test           # Execute 65 unit and integration tests (65/65 passing)
npm start          # Start HTTP microservice server on port 3001
```

## Feature Implementation Status

- [x] **AUTOMATIC CATEGORIZATION**: Rule engine, 92 signals, LLM fallback, confidence scoring.
- [x] **SPENDING PATTERN UNDERSTANDING**: MoM category changes, trends, spending concentration.
- [x] **PERSONALIZED INSIGHTS**: 13 data-grounded insight patterns, severity ranking, priority scoring.
- [x] **RECOMMENDATIONS**: Evidence-backed actionable recommendations with estimated impacts.
- [x] **SUBSCRIPTIONS**: Interprets backend recurring data, flags burden and largest items.
- [x] **ANOMALIES**: Interprets backend anomalies cleanly without inventing causes.
- [x] **FINANCIAL HEALTH**: Explains backend score factors (positive, negative, actionable improvement).
- [x] **BUDGETS / GOALS**: Budget overspending/nearing limit insights, goal progress & risk insights.
- [x] **AI ASSISTANT**: `POST /api/v1/assistant` endpoint with 10 financial intent classifiers.
- [x] **SAVINGS SIMULATION**: `POST /api/v1/simulate` endpoint with exact arithmetic calculation.
