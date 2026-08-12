
---

# `docs/phase.md`

```md
# Development Phases

## Phase 0 — Foundation

Status: Not Started

### Tasks

- [ ] Initialize frontend
- [ ] Initialize backend
- [ ] Configure Git
- [ ] Configure environment variables
- [ ] Configure database
- [ ] Establish project structure
- [ ] Establish API conventions
- [ ] Establish base UI system

### Completion Criteria

Frontend and backend run independently and communicate correctly.

---

# Phase 1 — Authentication

### Tasks

- [ ] User model
- [ ] Registration
- [ ] Login
- [ ] Authentication middleware
- [ ] Protected routes
- [ ] Authorization
- [ ] Frontend authentication state
- [ ] Authentication error handling

### Completion Criteria

A user can register, log in, and access only their own protected resources.

---

# Phase 2 — Transaction Management

### Tasks

- [ ] Transaction model
- [ ] Manual transaction form
- [ ] Create transaction API
- [ ] List transactions
- [ ] View transaction
- [ ] Update transaction
- [ ] Delete transaction
- [ ] Transaction validation

### Completion Criteria

A user can fully manage their transactions manually.

---

# Phase 3 — CSV Import

### Tasks

- [ ] CSV upload UI
- [ ] File validation
- [ ] CSV parsing
- [ ] Row validation
- [ ] Date normalization
- [ ] Amount normalization
- [ ] Missing-field handling
- [ ] Duplicate detection
- [ ] Import summary
- [ ] Import error reporting

### Completion Criteria

A realistic CSV bank-statement export can be imported safely.

---

# Phase 4 — Categorization

### Tasks

- [ ] Define categories
- [ ] Select categorization approach
- [ ] Implement categorization engine
- [ ] Categorize existing transactions
- [ ] Handle unknown merchants
- [ ] Test categorization

### Core Categories

- Food
- Rent
- Shopping
- Subscriptions
- Travel
- Bills
- Entertainment

### Completion Criteria

Imported transactions are automatically assigned meaningful categories.

---

# Phase 5 — Spending Analytics

### Tasks

- [ ] Calculate income
- [ ] Calculate expenses
- [ ] Calculate savings
- [ ] Category aggregation
- [ ] Monthly spending
- [ ] Month-over-month comparison
- [ ] Recurring transaction detection
- [ ] Unusual spending detection

### Completion Criteria

The system can explain where the user's money is going.

---

# Phase 6 — Financial Health

### Tasks

- [ ] Define scoring methodology
- [ ] Implement score calculation
- [ ] Savings-rate calculation
- [ ] Spending-versus-income analysis
- [ ] Budget adherence calculation
- [ ] Financial summary

### Completion Criteria

The user receives a clear and explainable financial health score.

---

# Phase 7 — Budgets & Savings Goals

## Budgets

- [ ] Create budget
- [ ] Update budget
- [ ] Delete budget
- [ ] Track budget usage
- [ ] Detect overspending

## Savings Goals

- [ ] Create goal
- [ ] Update goal
- [ ] Track progress
- [ ] Display target versus current savings

### Completion Criteria

Users can set targets and understand their progress.

---

# Phase 8 — Insights & Recommendations

### Tasks

- [ ] Define insight rules
- [ ] Spending insights
- [ ] Trend insights
- [ ] Budget insights
- [ ] Savings insights
- [ ] Actionable recommendations

### Rule

Every insight must be derived from actual user data.

### Completion Criteria

The application can explain meaningful financial patterns and suggest actions.

---

# Phase 9 — Dashboard

### Tasks

- [ ] Dashboard layout
- [ ] Financial health card
- [ ] Income card
- [ ] Expense card
- [ ] Savings card
- [ ] Spending breakdown
- [ ] Spending trends
- [ ] Budget progress
- [ ] Savings goals
- [ ] Insights
- [ ] Recent transactions
- [ ] Responsive design

### Completion Criteria

A user can understand their financial situation within seconds.

---

# Phase 10 — Quality & Security

### Tasks

- [ ] Authentication review
- [ ] Authorization review
- [ ] Input validation review
- [ ] CSV security review
- [ ] Error handling review
- [ ] Loading states
- [ ] Empty states
- [ ] API testing
- [ ] Frontend testing
- [ ] Performance review
- [ ] Responsive testing

### Completion Criteria

The core application is stable enough for demonstration.

---

# Phase 11 — Optional Features

Only begin after the MVP is stable.

- [ ] PDF bank statement parsing
- [ ] Subscription detector
- [ ] Bill reminders
- [ ] Multi-account support
- [ ] AI financial assistant
- [ ] Benchmarking
- [ ] Savings simulation

---

# Phase 12 — Submission

### Tasks

- [ ] Deploy application
- [ ] Complete README
- [ ] Complete API documentation
- [ ] Create architecture diagram
- [ ] Add screenshots
- [ ] Prepare presentation
- [ ] Prepare demo data
- [ ] Review Git history
- [ ] Review individual contributions
- [ ] Prepare technical viva
- [ ] Perform final end-to-end demo

---

# Definition of Done

A phase is complete only when:

- Implementation works
- API/UI integration works
- Errors are handled
- Relevant documentation is updated
- Code is understandable
- Git history contains meaningful progress
- Team members understand the implementation