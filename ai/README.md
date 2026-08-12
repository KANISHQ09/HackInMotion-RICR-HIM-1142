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
