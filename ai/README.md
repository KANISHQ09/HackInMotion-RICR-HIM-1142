# Spendly AI Intelligence Service

The `ai/` directory contains Spendly's independent microservice for transaction data normalization, hybrid rule-and-LLM categorization, AI chat financial assistance, and savings/expense impact simulation.

## Architecture & Service Boundary Rules

1. **Standalone Microservice**: The AI service operates independently of backend databases.
2. **Stateless HTTP API**: All financial context (summary, categories, budgets, recurring subscriptions, anomalies, health score) is provided through validated HTTP request payloads.
3. **Deterministic Financial Arithmetic**: The LLM is NEVER used as the source of truth for arithmetic, category spending totals, or savings calculations. All financial math is computed deterministically in TypeScript code.
4. **Resilient Fallbacks**: Every pipeline (categorization, assistant, simulation) functions reliably with 100% uptime even when no LLM API key is configured.

---

## Architecture Flow

```text
Incoming Requests (HTTP REST on Port 3001)
├── POST /api/v1/categorize ──► 4-Stage Cascade (Normalize → Rules → Confidence Check → LLM Fallback)
├── POST /api/v1/assistant  ──► Deterministic Intent & Fact Extraction ──► Optional LLM Explanation
└── POST /api/v1/simulate   ──► Deterministic Arithmetic Engine ──────► Optional LLM Narrative
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
npm test           # Execute 55 unit and integration tests
npm start          # Start HTTP microservice server on port 3001
```
