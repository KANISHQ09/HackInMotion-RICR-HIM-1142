# AI & Financial Intelligence Service

This service powers the AI and financial intelligence layer for the application.

## Overview

The `ai/` directory forms an independent Node.js + TypeScript service owned by the AI/ML team. It communicates with the main ezBookkeeping application through HTTP APIs.

In upcoming iterations, this service will handle:
- **Transaction Categorization**: Automated category assignment and merchant matching.
- **Spending Analytics**: Pattern discovery, spending trends, and anomaly detection.
- **Financial Health Scoring**: Calculating user wellness scores based on savings, debt, and cash flow.
- **Personalized Insights**: Delivering recommendations and financial advice.
- **AI Assistant Integration**: Powering conversational features and intelligent workflows.

## Backend Compatibility Notes

Inspected backend models in `backend/pkg/models/transaction.go` and verified integration requirements:
- **ID Alignment**: Backend `int64` IDs (`TransactionId`, `Uid`, `AccountId`, `CategoryId`) map to stringified fields (`id`, `userId`, `accountId`) in the AI contract.
- **Amount Representation**: Backend integer amounts (`Amount`) map to floating point numeric representations in the AI layer.
- **Date/Time Formatting**: Backend Unix timestamps (`TransactionTime`) map to ISO-8601 string representations (`date`).
- **Merchant & Description Fields**: Backend `Comment` field (up to 255 chars) serves as the primary source for merchant names and transaction notes.
- **Transaction Types**: Backend `TransactionType` (1: Modify Balance, 2: Income, 3: Expense, 4: Transfer Out, 5: Transfer In) maps directly to AI service normalized types (`income`, `expense`, `transfer`).

## Data Contract

The data contract (`ai/src/types/transaction.ts`) defines the boundary and standardized interface between the main application data models and the AI service:

- `NormalizedTransaction`: Universal representation of financial transactions (`id`, `userId`, `amount`, `type`, `date`, `merchant`, `description`, `category`, `accountId`, `currency`).
- `CategoryPrediction`: Standardized result produced by categorization engines (`category`, `confidence`, `method`), supporting `rule`, `llm`, and `fallback` classification approaches.
- Runtime validation is enforced via **Zod** schemas (`transactionSchema` and `categoryPredictionSchema`).

## Transaction Normalization

The transaction normalization layer (`ai/src/normalization/transaction.ts`) cleanses and normalizes raw transaction inputs before passing them downstream to AI categorization, analytics, and intelligence modules:

- **Merchant Text Normalization**: Collapses extra whitespace and normalizes merchant casing consistently (Title Case).
- **Text Cleaning**: Trims and cleans optional description, category, and account fields.
- **Amount & Date Normalization**: Converts string/numeric amounts into finite numbers and converts dates into standard ISO-8601 UTC strings.
- **Type Normalization**: Maps transaction types consistently to supported values (`income`, `expense`, `transfer`).
- **Validation**: Enforces strict runtime validation via Zod schema, cleanly rejecting invalid inputs.

## Expense Categorization

The expense categorization engine (`ai/src/categorization/`) classifies normalized transactions into an 15-category financial taxonomy (`food`, `groceries`, `rent`, `bills`, `shopping`, `transport`, `travel`, `entertainment`, `healthcare`, `education`, `subscriptions`, `personal-care`, `insurance`, `fees`, `other`).

- **Stage 1 - Rule-Based Classifier**: Uses deterministic merchant and keyword signal matching (`ai/src/categorization/merchant-signals.ts`).
- **Scoring & Confidence**: Assigns deterministic confidence scores based on match strength (`0.96` exact merchant, `0.90` partial merchant, `0.70` keyword description). Merchant signals take precedence over description keywords.
- **Selective LLM Offloading**: Low-confidence or ambiguous transactions (`confidence < 0.50`) are marked as `categoryId: null` to allow a future LLM fallback stage, avoiding unnecessary and expensive LLM calls for simple transactions.

## Environment & Configuration

Environment variables can be specified in a `.env` file or passed through standard environment variables:

- `PORT`: HTTP server port (Default: `3001`)
- `HOST`: HTTP server host address (Default: `127.0.0.1`)

## API Endpoints

### GET `/health`
Health check endpoint returning service status.

**Response:**
```json
{
  "status": "ok",
  "service": "ai"
}
```

## Running & Testing

```bash
# Install dependencies
npm install

# Run tests
npm test

# Check TypeScript types
npm run build

# Run in development mode (Node 22+)
npm run dev

# Start production server
npm start
```
