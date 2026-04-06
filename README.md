# WalletMind - AI-Powered Financial Intelligence

WalletMind is a high-end, production-ready MERN stack application designed for the modern financial era. It combines a premium "CRED-style" fintech interface with robust AI-driven insights to help you take full control of your spending DNA.

![Premium Dashboard Preview](https://github.com/Prabhakar4039/WalletMind/blob/main/docs/dashboard_preview.png?raw=true)

## 🚀 Key Features

- **Premium Fintech UI**: Dark mode by default with sophisticated glassmorphism, indigo gradients, and smooth Framer Motion transitions.
- **AI-Powered Insights**: Hyper-personalized financial strategies generated via Groq (LLaMA3) that analyze your spending patterns and suggest actionable saving tips.
- **Precision Filtering**: A comprehensive "Filter Horizon" system allowing you to slice data by Category, Type (Income/Expense), and Date Range.
- **Financial Pulse**: Real-time interactive charts (Area & Pie) for tracking total liquidity, inflows, and outflows.
- **Budget Guardrails**: Proactive system for setting and monitoring category-specific budget limits before they're breached.
- **Transaction Registry**: Full-audit trail with category-specific custom iconography (🍔 Food, 🚗 Travel, 💰 Salary, etc.).

## 🛠️ Tech Stack

- **Frontend**: React (TypeScript), Vite, Tailwind CSS 4, Zustand, Recharts, Framer Motion, Lucide React.
- **Backend**: Node.js, Express (TypeScript), MongoDB, Mongoose.
- **AI Engine**: Groq API (Inference for LLaMA-powered heuristics).

## ⚙️ Project Setup

### Prerequisites
- **Node.js**: v18 or later
- **MongoDB**: Atlas cluster or local instance
- **Groq API Key**: Obtain from [console.groq.com](https://console.groq.com)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Prabhakar4039/WalletMind.git
   cd WalletMind
   ```

2. **Backend Configuration**
   - Navigate to `server/`
   - Copy `.env.example` to `.env`
   - Configure your credentials:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     GROQ_API_KEY=your_groq_api_key
     ```
   ```bash
   npm install
   npm run dev
   ```

3. **Frontend Configuration**
   - Navigate to `client/`
   ```bash
   npm install
   npm run dev
   ```

### Running Locally
- The backend will start on [http://localhost:5000](http://localhost:5000)
- The frontend will start on [http://localhost:5173](http://localhost:5173)

## 📁 API Architecture

### Authentication
- `POST /api/auth/register`: Create a new user profile.
- `POST /api/auth/login`: Authenticate and start a session.
- `PUT /api/auth/profile`: Update user preferences and account settings.

### Transactions
- `GET /api/transactions`: Fetch filtered transaction history.
- `POST /api/transactions`: Record a new financial entry.
- `PUT /api/transactions/:id`: Update or modify an existing record.
- `DELETE /api/transactions/:id`: Permanently remove a registry entry.

### Analytics & AI
- `GET /api/ai/insights`: Generate AI-powered saving strategies.
- `GET /api/transactions/stats`: Retrieve historical data for visualization.

---
Built with ❤️ for better financial clarity.
