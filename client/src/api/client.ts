import axios from 'axios';

/**
 * Single Axios instance for the entire app.
 *
 * Why one instance?
 * - Base URL set once. Change backend URL → change one line.
 * - Auth token injected by a request interceptor.
 *   When real auth lands, update the interceptor here.
 *   Zero other files need to change.
 * - Error handling interceptor normalises all API errors
 *   into a consistent shape before they reach the hooks.
 */
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor ────────────────────────────────────────────
// Attach auth token to every request (mocked for now).
// When JWT auth lands: read token from useAuthStore.getState().token
client.interceptors.request.use(
  config => {
    // TODO: replace with real token retrieval
    // const token = useAuthStore.getState().token;
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

// ── Response interceptor ───────────────────────────────────────────
// Unwrap the ApiResponse envelope so hooks receive data directly.
// Also normalise error messages so components don't do error.response.data.message.
client.interceptors.response.use(
  response => response,
  error => {
    const message =
      error.response?.data?.error ??
      error.response?.data?.message ??
      error.message ??
      'Something went wrong';

    // Attach a clean message to the error so hooks can display it
    error.friendlyMessage = message;
    return Promise.reject(error);
  }
);

export default client;