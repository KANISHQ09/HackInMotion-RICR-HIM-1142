# Development Phases

This roadmap reflects the current Spendly repository. Checkboxes describe product progress, not only file existence.

## Phase 0 - Foundation

Status: Mostly complete.

- [x] Repository structure exists.
- [x] Frontend app initialized.
- [x] Backend app initialized.
- [x] AI service initialized.
- [x] Documentation folder exists.
- [x] Environment example exists.
- [x] Backend configuration exists.
- [x] Base UI system exists.
- [ ] Finalize local developer setup instructions.

Completion criteria:

Frontend, backend, and AI service can be installed, built, and run independently by a new contributor.

## Phase 1 - Authentication

Status: Backend partial, frontend pending.

- [x] Registration API.
- [x] Login API.
- [x] Current user API.
- [x] Token creation.
- [x] Protected API middleware.
- [ ] Login page.
- [ ] Register page.
- [ ] Frontend auth state.
- [ ] Logout flow.
- [ ] Auth error handling.
- [ ] Protected frontend routes.

Completion criteria:

A user can register, log in, stay authenticated in the frontend, and access only their own protected resources.

## Phase 2 - Transaction Management

Status: Backend partial, frontend pending.

- [x] Transaction create API.
- [x] Transaction list API.
- [x] Transaction update API.
- [x] Transaction delete API.
- [x] Transaction validation.
- [x] User-scoped transaction access.
- [ ] Transaction list UI.
- [ ] Transaction form UI.
- [ ] Transaction filters.
- [ ] Transaction edit/delete interactions.
- [ ] Empty/loading/error states.

Completion criteria:

A user can fully manage transactions from the UI.

## Phase 3 - CSV Import

Status: Backend partial, frontend pending.

- [x] CSV import API.
- [x] File extension and size validation.
- [x] Required header validation.
- [x] Row parsing.
- [x] Date normalization.
- [x] Amount normalization.
- [x] Duplicate detection.
- [x] Import summary response.
- [ ] CSV upload UI.
- [ ] Import preview UI.
- [ ] Import error reporting UI.
- [ ] Sample CSV documentation.

Completion criteria:

A realistic CSV bank statement can be imported safely from the frontend, with clear success and error reporting.

## Phase 4 - Categorization

Status: Initial implementation exists.

- [x] Backend rule-based categorization.
- [x] AI service rule-based categorization.
- [x] Basic financial categories.
- [ ] Align backend and AI category taxonomy.
- [ ] Add category confidence where needed.
- [ ] Handle unknown/ambiguous merchants consistently.
- [ ] Add category management UI if required.
- [ ] Expand test coverage for common Indian transaction merchants.

Core categories:

- Food.
- Transport.
- Bills and utilities.
- Shopping.
- Entertainment.
- Health.
- Rent.
- Salary and income.
- Subscriptions.
- Other.

Completion criteria:

Transactions receive useful, explainable categories, and unknown cases are handled gracefully.

## Phase 5 - Spending Analytics

Status: Backend partial, dashboard UI pending.

- [x] Income calculation.
- [x] Expense calculation.
- [x] Net savings calculation.
- [x] Category breakdown.
- [x] Monthly trends.
- [x] Recurring transaction detection.
- [x] Basic anomaly detection.
- [ ] Analytics dashboard cards.
- [ ] Date range filters.
- [ ] Chart interactions.
- [ ] Empty state for no transactions.

Completion criteria:

The user can understand where money is going from the dashboard.

## Phase 6 - Financial Health

Status: Backend partial, product refinement pending.

- [x] Health score endpoint.
- [x] Savings-rate signal.
- [x] Budget-adherence signal.
- [x] Volatility signal.
- [x] Plain-language score insights.
- [ ] Final scoring methodology documentation.
- [ ] Dashboard health score card.
- [ ] Explanation UI for score factors.
- [ ] Tests for score edge cases.

Completion criteria:

The user receives a clear, explainable financial health score with actionable context.

## Phase 7 - Budgets And Savings Goals

Status: Backend partial, frontend pending.

Budgets:

- [x] Create budget API.
- [x] List budget API.
- [x] Budget progress calculation.
- [ ] Update budget API.
- [ ] Delete budget API.
- [ ] Budget UI.
- [ ] Overspending warning UI.

Savings goals:

- [x] Create goal API.
- [x] List goal API.
- [x] Goal progress response.
- [ ] Update goal API.
- [ ] Delete goal API.
- [ ] Savings goal UI.

Completion criteria:

Users can set targets and understand progress against budgets and savings goals.

## Phase 8 - Insights And Recommendations

Status: Backend initial implementation exists.

- [x] Recommendation endpoint.
- [x] Recommendation from expense-to-income ratio.
- [x] Recommendation from top category.
- [ ] Insight cards in dashboard.
- [ ] Prioritized recommendation severity.
- [ ] Dismiss/save insight behavior.
- [ ] More insight rules based on real user data.

Completion criteria:

The application explains meaningful financial patterns and suggests practical next actions.

## Phase 9 - Dashboard

Status: Pending.

- [ ] Dashboard route.
- [ ] Dashboard app shell.
- [ ] Financial health card.
- [ ] Income card.
- [ ] Expense card.
- [ ] Savings card.
- [ ] Spending breakdown chart.
- [ ] Spending trend chart.
- [ ] Budget progress widgets.
- [ ] Savings goal widgets.
- [ ] Insight/recommendation panel.
- [ ] Recent transactions table.
- [ ] Responsive layout.

Completion criteria:

A user can understand their financial situation within seconds.

## Phase 10 - Quality And Security

Status: Ongoing.

- [ ] Authentication review.
- [ ] Authorization review.
- [ ] User ownership review.
- [ ] Input validation review.
- [ ] CSV security review.
- [ ] Error handling review.
- [ ] API tests.
- [ ] Frontend tests.
- [ ] AI service tests remain passing.
- [ ] Performance review.
- [ ] Responsive testing.

Completion criteria:

The core application is stable enough for a live demo.

## Phase 11 - Optional Features

Only begin after the MVP is stable.

- [ ] PDF bank statement parsing.
- [ ] Bill reminders.
- [ ] Advanced subscription detector.
- [ ] Multi-account dashboard UI.
- [ ] AI financial assistant.
- [ ] Peer benchmarking.
- [ ] Savings simulation.
- [ ] MCP production hardening.

## Phase 12 - Submission

- [ ] Deploy frontend.
- [ ] Deploy backend.
- [ ] Configure production environment variables.
- [ ] Complete README.
- [ ] Complete API documentation.
- [ ] Add screenshots.
- [ ] Prepare demo data.
- [ ] Prepare presentation.
- [ ] Review Git history.
- [ ] Review individual contributions.
- [ ] Perform final end-to-end demo.

## Definition Of Done

A phase is complete only when:

- Implementation works.
- Frontend and API integration works where applicable.
- Errors are handled.
- Relevant documentation is updated.
- Code is understandable.
- Security rules are followed.
- Team members can explain the implementation.
