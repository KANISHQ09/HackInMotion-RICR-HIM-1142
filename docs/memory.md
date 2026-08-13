# Project Memory

This is the living project state for Spendly. Update it whenever an important implementation, decision, problem, or milestone changes.

## Project

Spendly

## Product Category

Smart expense analyzer and financial health dashboard.

## Theme

FinTech and personal finance.

## Current State

The repository is no longer just a blank foundation. It now contains:

- A Next.js frontend in `frontend/`.
- A Go backend in `backend/`.
- A TypeScript AI service in `ai/`.
- Product documentation in `docs/`.
- API documentation in `api-documentation.md`.
- Backend configuration in `backend/conf/spendly.ini`.
- A local SQLite database path at `backend/data/spendly.db`.

## Current Phase

Phase 1 to Phase 3 are partially implemented.

The backend has Spendly-specific API routes for auth, transactions, CSV import, analytics, health score, recommendations, budgets, and goals. The frontend currently contains the marketing/landing page and the shared UI foundation, but app pages such as login, register, dashboard, transactions, budgets, and goals still need to be built.

## Completed

- [x] Repository structure exists.
- [x] Frontend initialized with Next.js, TypeScript, Tailwind CSS, and shadcn/ui components.
- [x] Backend initialized with Go, Gin, Xorm, auth middleware, configuration, and datastore support.
- [x] AI service initialized with TypeScript transaction contracts.
- [x] Rule-based AI categorization exists in `ai/src/categorization/`.
- [x] Spendly API routes added under `/api`.
- [x] Manual transaction API exists.
- [x] CSV import API exists.
- [x] Analytics, health score, recommendations, budgets, and goals API handlers exist.
- [x] Design guide updated in `docs/design.md`.

## Still Needed

- [ ] Login page.
- [ ] Register page.
- [ ] Auth state management in the frontend.
- [ ] Dashboard page.
- [ ] Transaction list and transaction form UI.
- [ ] CSV import UI.
- [ ] Budget and savings goal UI.
- [ ] Frontend API client layer.
- [ ] Error, loading, and empty states.
- [ ] End-to-end integration testing.
- [ ] Screenshots/demo data for presentation.

## Product Decisions

### Name

Use `Spendly` as the repository and product name in documentation and UI.

Use only `Spendly` as the project and product name in public-facing documentation.

### Transaction Input

Core input methods:

1. Manual transaction entry.
2. CSV bank statement import.

PDF bank statement parsing is optional and must not block the MVP.

### Categorization

Current implementation:

- Backend includes rule-based categorization in `backend/pkg/api/smart_finance.go`.
- AI service includes a separate rule-based categorizer in `ai/src/categorization/`.

Near-term direction:

- Keep categorization explainable.
- Use deterministic rules for common transactions.
- Add LLM fallback only for low-confidence or ambiguous cases.

### Financial Health

The financial health score must remain explainable.

Current factors include:

- Savings rate.
- Budget adherence.
- Spending volatility.

### Security

Financial data is sensitive. Protected APIs must authenticate users and scope data access by user ID.

## Current Repository Structure

```text
Spendly/
  frontend/
  backend/
  ai/
  docs/
  api-documentation.md
  README.md
  .env.example
```

## Documentation Notes

- `docs/design.md`: frontend design system and page creation guide.
- `docs/architecture.md`: system structure and data flow.
- `docs/tech-stack.md`: actual technologies used in this repo.
- `docs/phase.md`: development roadmap and completion criteria.
- `docs/rules.md`: engineering rules.
- `api-documentation.md`: API route index.
