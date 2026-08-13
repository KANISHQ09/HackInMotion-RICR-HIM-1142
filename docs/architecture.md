# Spendly Architecture

Spendly is a full-stack personal finance application for transaction tracking, automatic categorization, spending analytics, financial health scoring, budgets, goals, and recommendations.

## System Overview

```text
User
-> Next.js frontend
-> Go HTTP API
-> Auth and validation middleware
-> API handlers
-> Services and domain logic
-> Datastore models
-> SQL database
```

The repository is organized as three main applications:

- `frontend/`: Next.js app for the product UI and landing/auth/dashboard experiences.
- `backend/`: Go API server, domain models, services, storage, auth, imports, analytics, and configuration.
- `ai/`: Independent TypeScript service for transaction normalization, categorization, and future AI/financial intelligence workflows.

## Backend Architecture

The backend is a Go application using Gin for HTTP routing.

Important directories:

- `backend/cmd/`: application startup, web server, CLI, database, cron, and initialization commands.
- `backend/pkg/api/`: HTTP API handlers.
- `backend/pkg/services/`: business logic and shared service operations.
- `backend/pkg/models/`: database-backed domain models.
- `backend/pkg/datastore/`: database access and query context.
- `backend/pkg/middlewares/`: request logging, request IDs, authorization, recovery, and access controls.
- `backend/pkg/validators/`: reusable validation helpers.
- `backend/pkg/converters/`: transaction import/export conversion support.
- `backend/pkg/llm/`: optional LLM provider integrations.
- `backend/pkg/mcp/`: optional Model Context Protocol tools for AI/LLM access.
- `backend/conf/spendly.ini`: local backend configuration.

The current Spendly API routes are registered in `backend/cmd/webserver.go` under `/api`.

## Backend Request Flow

Protected API requests should follow this path:

```text
Client
-> Route
-> Request ID middleware
-> Request log middleware
-> JWT authorization middleware
-> API handler
-> Validation
-> Service/domain operation
-> Datastore query scoped by user ID
-> Response
```

Rules:

- Protected financial resources must always be scoped to the authenticated user.
- Request data must be validated before persistence.
- Handlers should stay thin where possible.
- Shared business logic belongs in services or focused helper functions.
- Responses should avoid leaking internal implementation details.

## Authentication Flow

```text
Register/Login
-> Validate credentials
-> Create or fetch user
-> Create token
-> Return token and user profile
-> Frontend stores auth state
-> Protected requests send token
```

Current Spendly auth endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

## Transaction Flow

Manual transaction flow:

```text
Transaction form
-> Frontend validation
-> POST /api/transactions
-> Backend validation
-> Category selection or automatic categorization
-> Default account resolution
-> Database insert
-> Transaction response
```

CSV import flow:

```text
CSV upload
-> File type and size validation
-> Header validation
-> Row parsing
-> Date and amount normalization
-> Duplicate detection
-> Automatic categorization
-> Database insert
-> Import summary
```

CSV imports currently require these columns:

- `date`
- `description`
- `amount`
- `type`

PDF bank statement parsing is not part of the core flow. Treat it as an optional future feature.

## Analytics Flow

```text
Stored transactions
-> Date/type/category/search filters
-> Income and expense totals
-> Net savings
-> Category breakdown
-> Monthly trends
-> Recurring transaction detection
-> Anomaly detection
-> Health score and recommendations
```

Current analytics endpoints include:

- `GET /api/analytics/summary`
- `GET /api/analytics/recurring`
- `GET /api/analytics/anomalies`
- `GET /api/health-score`
- `GET /api/recommendations`

## Frontend Architecture

The frontend currently uses the Next.js App Router without a `src/` directory.

Important directories:

- `frontend/app/`: route entry points, layout, and global styles.
- `frontend/components/`: page sections and reusable product components.
- `frontend/components/ui/`: shadcn/ui primitives.
- `frontend/hooks/`: reusable React hooks.
- `frontend/lib/`: shared utilities.
- `frontend/public/`: static images, icons, and placeholders.
- `frontend/styles/`: legacy/global style support.

Recommended future structure:

```text
frontend/
  app/
    login/
    register/
    dashboard/
    transactions/
    budgets/
    goals/
  components/
    ui/
    layout/
    dashboard/
    forms/
  hooks/
  lib/
```

Use the design rules in `docs/design.md` when adding pages.

## AI Service Architecture

The `ai/` service is separate from the main backend. It currently provides:

- Normalized transaction types and schemas.
- Transaction normalization.
- Rule-based transaction categorization.
- Tests for the transaction contract and categorization logic.

Future AI work can include:

- LLM fallback for ambiguous categories.
- Personalized insight generation.
- Natural language financial assistant features.
- Deeper anomaly detection.

The AI service should communicate through explicit contracts rather than direct database coupling.

## Data Ownership

Every financial object must belong to a user:

- Transactions.
- Budgets.
- Savings goals.
- Accounts.
- Categories.
- Imported data.
- Insights derived from user data.

Queries that read or modify user financial data must include user scope.

## Deployment Shape

Expected deployment units:

- Frontend: Next.js application.
- Backend: Go API server.
- AI service: optional Node.js/TypeScript service.
- Database: SQLite for local development; MySQL or PostgreSQL are supported by backend configuration.
- Storage: local filesystem by default; object storage options are available in backend config.

## Architecture Rules

- Keep the repository name and product name as Spendly in documentation and UI.
- Do not reference unrelated project names or non-Spendly product names.
- Keep frontend UI patterns aligned with `docs/design.md`.
- Keep API documentation aligned with routes in `backend/cmd/webserver.go`.
- Keep security and user ownership rules visible in every feature design.
