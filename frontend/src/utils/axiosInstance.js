import axios from 'axios';

const apiBaseUrl = import.meta.env.DEV
    ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1`
    : '/api/v1';

const axiosInstance = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true
});

export default axiosInstance;