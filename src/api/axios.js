import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});
console.log("AXIOS BASE URL:", import.meta.env.VITE_APP_BASE_URL); // debug
export default api;   // ✅ matches variable name