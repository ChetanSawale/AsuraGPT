import axios from 'axios';

// In development, Vite runs on :5173 and backend on :3000, so we need the full URL.
// In production (Render), Express serves the frontend from the same origin,
// so relative URLs work perfectly and avoid all cross-origin cookie issues.
const isDev = import.meta.env.DEV;
export const API_BASE_URL = isDev ? 'http://localhost:3000' : '';

const API = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Attach JWT token from localStorage as Authorization header fallback
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('asura_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default API;