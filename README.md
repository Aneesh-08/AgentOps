# BizSync

**Synchronizing Business Operations with AI**

BuzSync is a multi-agent AI assistant that helps small business owners manage inventory, pricing, and logistics through a single natural-language interface. Instead of switching between separate tools for each operational task, an owner asks one question and an Orchestrator Agent routes it to the specialist agent — or agents — needed to answer it.

```
"What is the total cost of 50 wireless keyboards and when will the order arrive?"
```

BuzSync recognizes that this request spans both pricing and logistics, and coordinates both agents to produce a single response.

---

## Table of Contents

- [Overview](#overview)
- [How It Works](#how-it-works)
- [Agent Responsibilities](#agent-responsibilities)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Example Queries](#example-queries)
- [Roadmap](#roadmap)
- [Team](#team)

---

## Overview

Small businesses routinely juggle several operational tasks:

- Checking inventory levels
- Looking up product prices
- Calculating discounts and GST
- Tracking orders
- Estimating deliveries and shipping costs

BuzSync consolidates these into one system built on a multi-agent architecture, so an owner can manage all of them from a single conversational interface.

## How It Works

```
                    Business Owner
                          │
                          ▼
                  ┌────────────────┐
                  │    BuzSync     │
                  │  Orchestrator  │
                  └───────┬────────┘
                          │
             ┌────────────┼────────────┐
             │            │            │
             ▼            ▼            ▼
       ┌──────────┐ ┌──────────┐ ┌──────────┐
       │Inventory │ │ Pricing  │ │Logistics │
       │  Agent   │ │  Agent   │ │  Agent   │
       └────┬─────┘ └────┬─────┘ └────┬─────┘
            │             │             │
            ▼             ▼             ▼
        Stock Data    Price Data    Order Data
             \            │            /
              \           │           /
               └──────────┼──────────┘
                          ▼
                  Business Response
```

The Orchestrator Agent interprets each query, determines which specialist agent(s) are relevant, dispatches the request, and returns a consolidated response.

### Single-Domain Query

```
User → Orchestrator → Inventory Agent → Inventory Tool → Response
```

### Multi-Domain Query

```
                    User Query
                        │
                        ▼
                  Orchestrator
                   /         \
                  ▼           ▼
             Pricing      Logistics
               Agent         Agent
                  │           │
                  ▼           ▼
              Pricing      Delivery
              Tools          Tools
                  \           /
                   \         /
                    ▼       ▼
                  Response
```

## Agent Responsibilities

| Agent | Responsibility |
|---|---|
| **Orchestrator Agent** | Interprets the query and routes it to the required specialist agent(s) |
| **Inventory Agent** | Handles product availability and stock levels |
| **Pricing Agent** | Handles pricing, discounts, GST, and order totals |
| **Logistics Agent** | Handles order lookup, delivery estimates, and shipping costs |

## Key Features

**Multi-agent architecture**
Specialist agents handle their own domain rather than relying on one general-purpose agent; the Orchestrator routes each request dynamically.

**Inventory intelligence**
Stock availability, product quantities, and general inventory queries.

**Pricing intelligence**
Price lookup, quantity-based pricing, discounts, GST, subtotal and total calculation, and formatted pricing quotations, for example:

```
🛒 Pricing Quote

Wireless Keyboard
Quantity: 50 units
────────────────────────
Unit price:        ₹1,200.00
Subtotal:          ₹60,000.00
Discount:          -₹9,000.00
Taxable amount:    ₹51,000.00
GST (18%):         ₹9,180.00
────────────────────────
Total:             ₹60,180.00
────────────────────────
```

**Logistics intelligence**
Order lookup, order status, destination, expected delivery, and shipping cost estimation.

## Architecture

```
┌─────────────────────────────────────────────┐
│                 BuzSync UI                   │
│           HTML / CSS / JavaScript            │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                   FastAPI                    │
│                  /chat API                   │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│              Orchestrator Agent              │
│         Query Understanding & Routing        │
└─────────────┬──────────┬──────────┬──────────┘
              │          │          │
              ▼          ▼          ▼
        Inventory     Pricing    Logistics
          Agent        Agent       Agent
              │          │          │
              ▼          ▼          ▼
        Inventory      Pricing    Logistics
           Tools        Tools       Tools
              │          │          │
              └──────────┼──────────┘
                         ▼
                 Business Data / Services
```

## Tech Stack

| Category | Technologies |
|---|---|
| AI & Cloud | Azure AI Foundry, Azure OpenAI (GPT-4.1-mini), Multi-Agent AI, Tool Calling |
| Backend | Python, FastAPI, Uvicorn |
| Frontend | HTML, CSS, JavaScript, Lucide Icons |
| Data | JSON-based inventory, pricing, and order data |

## Project Structure

```
BuzSync/
│
├── FrontEnd/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── multi-agent-business-assistant/
    │
    ├── app/
    │   ├── main.py
    │   ├── test.py
    │   │
    │   ├── agents/
    │   │   ├── orchestrator.py
    │   │   ├── inventory_agent.py
    │   │   ├── pricing_agent.py
    │   │   └── logistics_agent.py
    │   │
    │   ├── tools/
    │   │   ├── inventory_tool.py
    │   │   ├── pricing_tools.py
    │   │   └── logistics_tools.py
    │   │
    │   └── data/
    │       ├── inventory.json
    │       ├── pricing.json
    │       └── orders.json
    │
    ├── .env
    └── requirements.txt
```

## Getting Started

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd BuzSync
```

### 2. Create a virtual environment

**Windows**
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux / macOS**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r multi-agent-business-assistant/requirements.txt
```

### 4. Configure environment variables

Create a `.env` file inside `multi-agent-business-assistant/`:

```env
FOUNDRY_PROJECT_ENDPOINT="YOUR_FOUNDRY_PROJECT_ENDPOINT"
FOUNDRY_MODEL_NAME="gpt-4.1-mini"
```

> **Note:** Do not commit `.env` or any Azure credentials to version control.

### 5. Run the backend

From `multi-agent-business-assistant/`:

```bash
uvicorn app.main:app --reload
```

- Backend: `http://localhost:8000`
- API documentation: `http://localhost:8000/docs`

### 6. Run the frontend

Serve the `FrontEnd/` directory with a local development server (for example, VS Code Live Server), and confirm `script.js` points to the running backend:

```js
const CONFIG = {
    API_BASE_URL: "http://localhost:8000",
    USE_MOCK: false
};
```

## API Reference

### `POST /chat`

Send a natural-language business query.

**Request**
```json
{
  "message": "What is the price of 50 wireless keyboards?"
}
```

**Response**
```json
{
  "agents": [
    {
      "name": "PricingAgent",
      "response": "🛒 Pricing Quote..."
    }
  ]
}
```

For queries spanning multiple domains, the `agents` array contains one entry per specialist agent that contributed to the response.

## Example Queries

| Domain | Example |
|---|---|
| Inventory | "How many wireless keyboards are currently in stock?" |
| Pricing | "What is the total price for 50 wireless keyboards including GST?" |
| Logistics | "Where is order ORD1001 and when is it expected to arrive?" |
| Multi-agent | "What will 50 wireless keyboards cost and when will the order arrive?" |

## Roadmap

- Sales analytics agent
- Demand forecasting agent
- Invoice generation agent
- Email automation agent
- Low-stock alert agent
- Product expiry tracking agent
- Automated inventory updates
- Database integration
- Authentication and role-based access
- Cloud deployment
- Mobile interface
- Additional business-domain agents

## Team

**BuzSync — Multi-Agent Business Assistant**

Developed by:
- Aneesh Ranhotra
- Priya Verma
- Parv Mahajan
- Pulkit Bajaj
- Trisha Sharma 
