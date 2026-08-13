# Spendly AI Service

The `ai/` directory contains Spendly's independent TypeScript service for transaction normalization, categorization, and future financial intelligence workflows.

## Overview

This service is separate from the main Go backend. It should communicate with the rest of Spendly through explicit APIs or contracts instead of direct database coupling.

Current responsibilities:

- Normalize transaction data.
- Define transaction and categorization contracts.
- Classify transactions with deterministic rules.
- Provide tests for normalization and categorization behavior.

Future responsibilities:

- LLM fallback for ambiguous transaction categorization.
- Personalized financial insight generation.
- Natural language financial assistant features.
- Advanced anomaly and trend analysis.

## Backend Compatibility Notes

The current backend stores transactions in Go models under `backend/pkg/models/transaction.go`.

Important mapping rules:

- Backend integer IDs map to string IDs in the AI contract.
- Backend integer amounts map to numeric amount values in the AI layer.
- Backend Unix timestamps map to ISO-8601 date strings.
- Backend comments/descriptions can provide merchant and transaction note signals.
- Backend transaction types map to AI service normalized types: `income`, `expense`, and `transfer`.

## Data Contract

The data contract in `ai/src/types/transaction.ts` defines the boundary between Spendly data and AI workflows.

Important types:

- `NormalizedTransaction`.
- `CategoryPrediction`.

Runtime validation uses Zod schemas.

## Transaction Normalization

The normalization layer in `ai/src/normalization/transaction.ts`:

- Normalizes merchant text.
- Cleans optional description, category, and account fields.
- Converts string/numeric amounts into finite numbers.
- Converts dates into ISO-8601 UTC strings.
- Maps transaction types into supported normalized values.
- Rejects invalid data through Zod validation.

## Expense Categorization

The categorization engine in `ai/src/categorization/` uses deterministic merchant and keyword matching.

Current taxonomy:

- `food`
- `groceries`
- `rent`
- `bills`
- `shopping`
- `transport`
- `travel`
- `entertainment`
- `healthcare`
- `education`
- `subscriptions`
- `personal-care`
- `insurance`
- `fees`
- `other`

Current approach:

- Exact merchant matches receive high confidence.
- Partial merchant matches receive strong confidence.
- Description keyword matches receive moderate confidence.
- Low-confidence or ambiguous cases can be passed to a future LLM fallback.

## Environment

Environment variables:

- `PORT`: HTTP server port. Default: `3001`.
- `HOST`: HTTP server host. Default: `127.0.0.1`.

## API

### `GET /health`

Returns service health.

```json
{
  "status": "ok",
  "service": "ai"
}
```

## Running And Testing

```bash
npm install
npm test
npm run build
npm run dev
npm start
```
