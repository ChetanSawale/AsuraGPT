import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://asuragpt-2.onrender.com';

const API = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default API;