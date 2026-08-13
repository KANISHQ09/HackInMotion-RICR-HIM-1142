# Spendly

> A personal finance dashboard that helps users see where their money goes and what to do next.

## Overview

Spendly is a full-stack fintech application for expense analysis and financial health tracking.

The product helps users:

- Create a secure account.
- Add transactions manually.
- Import transactions from CSV bank exports.
- Automatically categorize spending.
- Analyze income, expenses, savings, and trends.
- Detect recurring payments and unusual spending.
- Calculate an explainable financial health score.
- Set budgets and savings goals.
- Receive personalized recommendations.

## Core Product Flow

```text
User
-> Authentication
-> Transaction input
   -> Manual entry
   -> CSV upload
-> Data validation
-> Data normalization
-> Automatic categorization
-> Transaction storage
-> Spending analytics
-> Financial health score
-> Insights and recommendations
-> Dashboard
```

## Repository Structure

```text
Spendly/
  frontend/              Next.js frontend
  backend/               Go API server
  ai/                    TypeScript AI and categorization service
  docs/                  Project documentation
  api-documentation.md   API route index
  README.md              Project overview
```

## Applications

### Frontend

Location: `frontend/`

```bash
cd frontend
npm install
npm run dev
```

Default local URL:

```text
http://localhost:3000
```

### Backend

Location: `backend/`

The backend is a Go application using Gin, Xorm, token-based authentication, and SQL database support.

Local configuration lives in:

```text
backend/conf/spendly.ini
```

Default local backend URL:

```text
http://localhost:8080
```

### AI Service

Location: `ai/`

```bash
cd ai
npm install
npm test
npm run build
```

## Documentation

- `docs/design.md`: frontend design guide.
- `docs/architecture.md`: system architecture and flow.
- `docs/tech-stack.md`: technologies used in this repository.
- `docs/phase.md`: development roadmap.
- `docs/memory.md`: living project memory.
- `docs/rules.md`: engineering rules.
- `api-documentation.md`: API route documentation.

## Current MVP Priorities

1. Login and register pages.
2. Frontend auth state and protected routes.
3. Dashboard page.
4. Transaction list and manual transaction form.
5. CSV import UI.
6. Budget and savings goal UI.
7. Frontend integration with existing Spendly API routes.

## Security Principles

- Authenticate protected requests.
- Scope financial records by user ID.
- Validate external input.
- Keep secrets outside source code.
- Avoid exposing sensitive financial data in logs or errors.
