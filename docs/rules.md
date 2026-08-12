# Engineering Rules

## 1. Product Rule

The core product loop is:

Transaction Data
↓
Categorization
↓
Analysis
↓
Financial Health
↓
Actionable Insight

We are not building only a CRUD expense tracker.

---

## 2. MVP Rule

Always prioritize core requirements before optional features.

### Core

- Authentication
- Manual transactions
- CSV import
- Validation
- Categorization
- Analytics
- Financial health
- Budgets
- Savings goals
- Insights
- Dashboard
- Error handling

### Optional

- PDF parsing
- AI assistant
- Subscription detector
- Bill reminders
- Multi-account
- Benchmarking
- Savings simulator

Never start an optional feature when a critical MVP feature is incomplete.

---

## 3. Financial Data Rule

Financial data is sensitive.

Always:

- Authenticate protected requests
- Verify resource ownership
- Scope queries by user ID
- Validate incoming data
- Avoid exposing sensitive information
- Keep secrets outside source code

Never allow:

```text
User A
↓
User B's financial data