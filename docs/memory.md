
---

# `docs/memory.md`

This is intentionally different from the other files.

**Do not fill this with a giant specification.** This is the living memory that we update as the project progresses.

```md
# Project Memory

> Living project state. Update this file whenever an important implementation, decision, problem, or milestone changes.

---

# Current Project State

## Project

Smart Expense Analyzer & Financial Health Dashboard

## Theme

FinTech & Personal Finance

## Hackathon

HackInMotion 2026

## Current Phase

Phase 0 — Foundation

## Overall Progress

0%

---

# Completed

- [x] GitHub repository created
- [x] Base repository structure planned
- [x] Documentation structure defined
- [ ] Frontend initialized
- [ ] Backend initialized
- [ ] Database connected
- [ ] Authentication implemented

---

# Currently Working On

Initial project setup.

---

# Next Tasks

1. Initialize frontend
2. Initialize backend
3. Configure environment variables
4. Configure database
5. Establish backend structure
6. Establish frontend structure
7. Implement authentication
8. Implement transaction management

---

# Product Decisions

## Transaction Input

Core input methods:

1. Manual transaction entry
2. CSV bank-statement import

PDF bank-statement parsing is optional and must not become a dependency for the core MVP.

---

## Categorization

Categorization approach has not been finalized.

Before implementation, decide between:

- Rule-based
- Machine learning
- AI/NLP API

Document the final decision and reasoning.

---

## Financial Health

The financial health score must be explainable.

Potential factors:

- Spending versus income
- Savings rate
- Budget adherence

Final scoring methodology must be documented before implementation.

---

# Architecture Decisions

- Frontend and backend are separate applications.
- Financial records belong to individual users.
- Protected APIs require authentication.
- Controllers remain thin.
- Business logic belongs in services.
- External input must be validated.
- CSV data must be normalized before storage.
- Insights must come from actual user data.

---

# Current Repository Structure

```text
frontend/
backend/
docs/
assets/
architecture-diagram.png
api-documentation.md
presentation.pptx
README.md
.env.example
.gitignore