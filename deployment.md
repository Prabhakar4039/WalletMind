# Deployment Guide - WalletMind

Follow these instructions to deploy WalletMind to production environments.

## 📁 Prerequisites
- A GitHub repository containing the latest code.
- A **MongoDB Atlas** account for the production database.
- A **Groq Cloud** account for the AI API key.

---

## 1. Backend Deployment (Render / Railway)

We recommend using **Render** for the backend as it handles Node.js/TypeScript environments natively.

1.  **Create a New Web Service** on Render.
2.  **Connect your GitHub Repository**.
3.  **Configure Build Settings**:
    -   Root Directory: `server`
    -   Build Command: `npm install && npm run build`
    -   Start Command: `npm start`
4.  **Add Environment Variables**:
    -   `PORT`: `5000` (or leave default)
    -   `MONGO_URI`: Your MongoDB Atlas connection string.
    -   `JWT_SECRET`: A long, random string.
    -   `GROQ_API_KEY`: Your Groq Cloud API key.
    -   `FRONTEND_URL`: The URL of your future Vercel deployment (e.g., `https://walletmind.vercel.app`).
    -   `NODE_ENV`: `production`

---

## 2. Frontend Deployment (Vercel / Netlify)

We recommend using **Vercel** for the frontend for seamless Vite integration.

1.  **Import your GitHub Repository** on Vercel.
2.  **Configure Project**:
    -   Framework Preset: `Vite`
    -   Root Directory: `client`
3.  **Add Environment Variables**:
    -   `VITE_API_URL`: The URL of your **Backend** service from Render (e.g., `https://walletmind-api.onrender.com`).
4.  **Deploy**.

---

## 🔒 Security Post-Deployment Checklist

1.  **CORS**: Ensure your `FRONTEND_URL` in the backend matches the actual Vercel URL exactly.
2.  **Credentials**: Verify that `withCredentials: true` is active in `apiClient.ts` to allow JWT persistence across domains.
3.  **Database Whitelisting**: On MongoDB Atlas, ensure you allow access from all IP addresses (`0.0.0.0/0`) or specific service IPs so Render can connect.
