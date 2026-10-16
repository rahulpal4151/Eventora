import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '')}/api/v1`,
    withCredentials: true
});

export default axiosInstance;