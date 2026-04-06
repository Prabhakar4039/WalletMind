import axios from 'axios';

// Base URL: Fallback to localhost for development, or use environment variable for production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Required for cookies (JWT)
});

export default apiClient;
