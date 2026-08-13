# Spendly API Documentation

Base backend URL in local configuration:

```text
http://localhost:8080
```

API routes are registered in `backend/cmd/webserver.go`.

## Authentication

### `POST /api/auth/register`

Creates a Spendly user and returns a token.

Body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response includes:

- `token`
- `user`

### `POST /api/auth/login`

Authenticates a user and returns a token.

Body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### `GET /api/auth/me`

Returns the current authenticated user.

Requires authentication.

## Transactions

### `GET /api/transactions`

Lists current user's transactions.

Requires authentication.

Optional query parameters:

- `startDate`
- `endDate`
- `type`
- `category`
- `search`

### `POST /api/transactions`

Creates a transaction.

Requires authentication.

Body:

```json
{
  "date": "2026-08-13",
  "description": "Grocery Store",
  "amount": "142.50",
  "type": "debit",
  "category": "Food"
}
```

Notes:

- `category` is optional.
- If no category is supplied, Spendly attempts automatic categorization.
- `type` should be `debit` or `credit`.

### `PUT /api/transactions/:id`

Updates a transaction.

Requires authentication.

### `DELETE /api/transactions/:id`

Soft-deletes a transaction.

Requires authentication.

## CSV Import

### `POST /api/transactions/import`

Imports transactions from a CSV file.

Requires authentication.

Form field:

- `file`: CSV file.

Requirements:

- File extension must be `.csv`.
- Maximum file size is 5 MB.
- Required headers: `date`, `description`, `amount`, `type`.

Response includes:

- `rowsProcessed`
- `rowsImported`
- `rowsFailed`
- `duplicatesSkipped`
- `results`

## Analytics

### `GET /api/analytics/summary`

Returns income, expenses, net savings, category breakdown, and monthly trends.

Requires authentication.

Optional query parameters:

- `period`
- `startDate`
- `endDate`

### `GET /api/analytics/recurring`

Returns recurring transaction groups detected from stored transactions.

Requires authentication.

### `GET /api/analytics/anomalies`

Returns spending anomalies detected from stored transactions.

Requires authentication.

## Financial Health

### `GET /api/health-score`

Returns an explainable financial health score.

Requires authentication.

Response includes:

- `score`
- `signals`
- `insights`

### `GET /api/recommendations`

Returns recommendations derived from actual user transaction data.

Requires authentication.

## Budgets

### `GET /api/budgets`

Lists current user's budgets.

Requires authentication.

### `POST /api/budgets`

Creates a budget.

Requires authentication.

Body:

```json
{
  "category": "Food",
  "limitAmount": "5000",
  "period": "monthly"
}
```

## Savings Goals

### `GET /api/goals`

Lists current user's savings goals.

Requires authentication.

### `POST /api/goals`

Creates a savings goal.

Requires authentication.

Body:

```json
{
  "name": "Emergency Fund",
  "targetAmount": "100000",
  "targetDate": "2026-12-31"
}
```

## System

### `GET /healthz.json`

Returns backend health status.

### `GET /api/system/version`

Returns backend version information.

Requires authentication.

## Security Notes

- Protected routes require a valid token.
- Financial data must be scoped to the authenticated user.
- Do not expose tokens, passwords, or sensitive financial values in logs.
- Keep this document aligned with route changes in `backend/cmd/webserver.go`.
