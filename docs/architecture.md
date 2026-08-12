# Architecture

## 1. Project Overview

Smart Expense Analyzer & Financial Health Dashboard is a full-stack FinTech application that converts raw financial transaction data into meaningful financial insights.

The core product pipeline is:

User
↓
Authentication
↓
Transaction Input
↓
Data Validation & Cleaning
↓
Automatic Categorization
↓
Transaction Storage
↓
Spending Analysis
↓
Financial Health Calculation
↓
Insights & Recommendations
↓
Dashboard

---

## 2. Core User Flow

### Authentication

User
↓
Register / Login
↓
Authenticated Session
↓
Dashboard

Every financial resource must belong to the authenticated user.

---

## 3. Transaction Input

The application supports two core transaction-input methods.

### Method 1 — Manual Entry

User
↓
Transaction Form
↓
Frontend Validation
↓
Backend Validation
↓
Transaction Service
↓
Categorization
↓
Database

### Method 2 — CSV Import

User
↓
CSV Upload
↓
File Validation
↓
CSV Parser
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
↓
Analytics

PDF bank-statement parsing is not part of the core MVP.

It may be added later as an optional advanced feature if the core MVP is complete.

---

## 4. Backend Request Flow

Every protected API request should follow:

Client
↓
Route
↓
Authentication Middleware
↓
Validation Middleware
↓
Controller
↓
Service
↓
Database / Model
↓
Response

Controllers should remain thin.

Business logic belongs in services.

---

## 5. Frontend Architecture

The frontend should use a feature-oriented structure.

```text
frontend/
└── src/
    ├── app/
    ├── components/
    ├── features/
    │   ├── auth/
    │   ├── transactions/
    │   ├── analytics/
    │   ├── budgets/
    │   ├── goals/
    │   ├── financial-health/
    │   └── insights/
    ├── hooks/
    ├── lib/
    ├── services/
    ├── types/
    ├── constants/
    └── utils/