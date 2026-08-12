# AI & Financial Intelligence Service

This service powers the AI and financial intelligence layer for the application.

## Overview

The `ai/` directory forms an independent Node.js + TypeScript service owned by the AI/ML team. It communicates with the main ezBookkeeping application through HTTP APIs.

In upcoming iterations, this service will handle:
- **Transaction Categorization**: Automated category assignment and merchant matching.
- **Spending Analytics**: Pattern discovery, spending trends, and anomaly detection.
- **Financial Health Scoring**: Calculating user wellness scores based on savings, debt, and cash flow.
- **Personalized Insights**: Delivering recommendations and financial advice.
- **AI Assistant Integration**: Powering conversational features and intelligent workflows.

## Environment & Configuration

Environment variables can be specified in a `.env` file or passed through standard environment variables:

- `PORT`: HTTP server port (Default: `3001`)
- `HOST`: HTTP server host address (Default: `127.0.0.1`)

## API Endpoints

### GET `/health`
Health check endpoint returning service status.

**Response:**
```json
{
  "status": "ok",
  "service": "ai"
}
```

## Running the Service

```bash
# Install dependencies (if needed)
npm install

# Run in development mode (Node 22+)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```
