# Engineering Rules

## Product Rule

Spendly is not only a CRUD expense tracker.

The core product loop is:

```text
Transaction data
-> Categorization
-> Analysis
-> Financial health
-> Actionable insight
```

Every major feature should support that loop.

## Naming Rule

Use `Spendly` as the repository and product name in documentation, UI copy, comments intended for users, and demos.

Use only `Spendly` as the project and product name in public-facing documentation.

## MVP Rule

Prioritize core requirements before optional features.

Core:

- Authentication.
- Manual transactions.
- CSV import.
- Validation.
- Categorization.
- Analytics.
- Financial health score.
- Budgets.
- Savings goals.
- Insights and recommendations.
- Dashboard.
- Error handling.

Optional:

- PDF parsing.
- AI assistant.
- Advanced subscription detector.
- Bill reminders.
- Multi-account dashboard UI.
- Benchmarking.
- Savings simulator.

Do not start optional features when a critical MVP path is incomplete.

## Financial Data Rule

Financial data is sensitive.

Always:

- Authenticate protected requests.
- Verify resource ownership.
- Scope queries by user ID.
- Validate incoming data.
- Avoid exposing sensitive information.
- Keep secrets outside source code.
- Return safe errors.

Never allow one user to access another user's financial data.

## Documentation Rule

When code changes product behavior, update the relevant document:

- Architecture changes: `docs/architecture.md`.
- Tech changes: `docs/tech-stack.md`.
- UI/design changes: `docs/design.md`.
- Roadmap/progress changes: `docs/phase.md` and `docs/memory.md`.
- API route changes: `api-documentation.md`.

## AI Rule

AI tools may help with implementation, debugging, testing, and documentation, but the team must understand the result.

AI-generated code must be reviewed before it is treated as finished.
