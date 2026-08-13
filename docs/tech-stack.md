# Technology Stack

This file describes the technologies actually used in the Spendly repository.

## Frontend

Location: `frontend/`

Core technologies:

- Next.js 16.
- React 19.
- TypeScript.
- Tailwind CSS v4.
- shadcn/ui style component primitives.
- Radix UI.
- lucide-react icons.
- Recharts.
- Framer Motion.
- next-themes.
- Vercel Analytics.

Supporting libraries:

- `class-variance-authority` for component variants.
- `clsx` and `tailwind-merge` for class composition.
- `react-hook-form` and `zod` for future form validation.
- `date-fns` for date utilities.
- `sonner` and shadcn toast utilities for notifications.

Frontend rules:

- Use the Next.js App Router.
- Use semantic CSS variables from `frontend/app/globals.css`.
- Use existing components in `frontend/components/ui`.
- Use Spendly naming in user-facing text and docs.
- Follow `docs/design.md` for page design.

## Backend

Location: `backend/`

Core technologies:

- Go 1.26 module.
- Gin web framework.
- Xorm ORM.
- go-playground validator.
- JWT authentication.
- INI configuration via `gopkg.in/ini.v1`.
- Logrus logging.
- gocron for scheduled jobs.

Database support:

- SQLite via `github.com/mattn/go-sqlite3`.
- MySQL via `github.com/go-sql-driver/mysql`.
- PostgreSQL via `github.com/lib/pq`.

Current local configuration:

- Database type: `sqlite3`.
- Database path: `backend/data/spendly.db`.
- Backend HTTP port: `8080`.
- Config file: `backend/conf/spendly.ini`.

Backend rules:

- Protected routes must use JWT authorization.
- Financial records must be scoped by user ID.
- Keep API handlers focused and move reusable business logic into services/helpers.
- Use existing validators and model conventions.
- Keep API docs aligned with `backend/cmd/webserver.go`.

## AI Service

Location: `ai/`

Core technologies:

- Node.js.
- TypeScript.
- Zod.
- Node test runner.

Current responsibilities:

- Transaction type contract.
- Transaction normalization.
- Rule-based categorization.
- Categorization tests.

Future responsibilities:

- LLM fallback for ambiguous transactions.
- AI-generated insights.
- Natural language financial assistant.
- Deeper spending anomaly analysis.

AI service rules:

- Keep contracts explicit.
- Do not couple the AI service directly to backend database internals.
- Prefer deterministic categorization before costly LLM calls.
- Every AI-generated result must be explainable enough for financial use.

## Storage

Current backend storage options:

- Local filesystem by default.
- MinIO support.
- WebDAV support.

Use local filesystem storage for local development unless a feature needs object storage behavior.

## Authentication

Current backend auth uses token-based authentication.

Responsibilities:

- Registration.
- Login.
- Current user lookup.
- Protected API access.
- User ownership enforcement.

Required frontend work:

- Login page.
- Register page.
- Token storage strategy.
- Authenticated API client.
- Protected dashboard routes.

## Validation

Validation exists at multiple layers:

- Frontend form validation should use React Hook Form and Zod where useful.
- Backend request binding and validation use Gin and go-playground validator.
- AI service runtime contracts use Zod.
- CSV import validates file size, extension, headers, rows, dates, amounts, and duplicates.

## CSV Processing

CSV is the required bulk transaction-import format.

Pipeline:

```text
CSV file
-> File validation
-> Header validation
-> Row parsing
-> Date normalization
-> Amount normalization
-> Duplicate detection
-> Categorization
-> Database insert
-> Import summary
```

Required CSV headers:

- `date`
- `description`
- `amount`
- `type`

## Charts

Current charting library:

- Recharts.

Use charts for:

- Spending breakdown.
- Monthly spending trends.
- Budget progress.
- Financial health signals.
- Category comparisons.

Charts must communicate useful financial information and should not exist only for decoration.

## Security

Spendly handles sensitive financial data.

Security requirements:

- Authenticate protected requests.
- Authorize access by user ownership.
- Validate all external input.
- Keep secrets out of source code.
- Use `.env.example` to document required variables.
- Avoid logging sensitive user data.
- Return safe error messages.
- Keep CORS and production headers intentional.

## Environment Variables

Use `.env` for local secrets and never commit real secret values.

Use `.env.example` to document required variables.

Backend configuration currently also uses:

- `backend/conf/spendly.ini`.

## Dependency Rule

Do not add a dependency simply because it is popular.

Before adding a dependency, answer:

- What problem does it solve?
- Is it already solved by the current stack?
- Does it increase security or maintenance risk?
- Can every contributor understand it?

Prefer simple, understandable solutions for the MVP.

## Technology Decision Rule

When choosing between technologies:

1. Prefer reliability.
2. Prefer simplicity.
3. Prefer explainability.
4. Prefer maintainability.
5. Prefer demo feasibility.
6. Avoid unnecessary complexity.
