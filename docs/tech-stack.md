
---

# `docs/tech-stack.md`

```md
# Technology Stack

## 1. Frontend

### Next.js

Purpose:

- React application framework
- Routing
- Application structure
- Production-ready frontend

### TypeScript

Purpose:

- Type safety
- Maintainability
- Safer API contracts
- Better developer experience

### Tailwind CSS

Purpose:

- Responsive styling
- Consistent design
- Rapid UI development

---

## 2. Backend

### Node.js

Purpose:

- Server-side JavaScript runtime
- Asynchronous API handling

### Express.js

Purpose:

- REST APIs
- Routing
- Middleware
- Request/response handling

---

## 3. Database

### MongoDB

Purpose:

Store:

- Users
- Transactions
- Categories
- Budgets
- Savings goals
- Historical analysis where required

---

## 4. Authentication

Authentication is responsible for:

- Registration
- Login
- Protected resources
- User identity
- Authorization

Implementation details must ensure that users can access only their own financial data.

---

## 5. Validation

### Joi

Use Joi for:

- Request validation
- Authentication validation
- Transaction validation
- Budget validation
- Savings goal validation
- Query validation

---

## 6. CSV Processing

CSV is the required bulk transaction-import format.

Processing pipeline:

CSV
↓
File Validation
↓
CSV Parsing
↓
Row Validation
↓
Data Normalization
↓
Duplicate Detection
↓
Categorization
↓
Database

---

## 7. Categorization Engine

Automatic categorization is a core technical component.

Possible approaches:

1. Rule-based classification
2. Machine learning
3. AI/NLP API

The final approach must be selected based on:

- Accuracy
- Reliability
- Development time
- Explainability
- Cost
- Maintainability

The selected approach must be documented with its reasoning.

---

## 8. Charts

Use a suitable charting library for:

- Spending breakdown
- Monthly spending trends
- Budget progress
- Financial data visualization

Charts must communicate useful information and should not exist only for decoration.

---

## 9. Security

The application should use appropriate security practices for:

- Authentication
- Authorization
- Input validation
- CORS
- HTTP security headers
- Environment variables
- Safe error handling

---

## 10. Environment Variables

Secrets must never be hardcoded.

Use:

.env

for local secrets.

Use:

.env.example

for documenting required variables.

Never commit the actual `.env` file.

---

## 11. Dependency Rule

Do not add a library simply because it is popular.

Every significant dependency must have a clear purpose.

Before adding a dependency ask:

> What problem does this dependency solve?

Prefer simple, understandable solutions when a dependency is not necessary.

---

## 12. AI Usage

AI development tools are permitted by HackInMotion.

AI may be used for:

- Boilerplate
- Debugging
- Documentation
- Testing assistance
- Code explanation
- Implementation suggestions
- Research

AI-generated code must be reviewed and understood by the team.

Every participant must be able to explain the code they contribute.

AI must enhance productivity, not replace engineering understanding.

---

## 13. Technology Decision Rule

When choosing between technologies:

1. Prefer reliability
2. Prefer simplicity
3. Prefer explainability
4. Prefer maintainability
5. Prefer hackathon feasibility
6. Avoid unnecessary complexity