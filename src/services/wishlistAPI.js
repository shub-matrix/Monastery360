import axios from 'axios';

const API_BASE_URL = 'https://form-backend-gold.vercel.app/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('API: Token included in request headers');
        } else {
            console.warn('API: No authentication token found');
        }
        return config;
    },
    (error) => {
        console.error('API: Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid, redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const getWishlist = async () => {
    try {
        return await api.get('/users/wishlist');
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        throw error;
    }
};

export const addToWishlist = async (monasteryId) => {
    try {
        return await api.post('/users/wishlist/add', { monasteryId });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        throw error;
    }
};

export const removeFromWishlist = async (monasteryId) => {
    try {
        return await api.post('/users/wishlist/remove', { monasteryId });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        throw error;
    }
};

export const toggleWishlist = async (monasteryId) => {
    try {
        console.log('API: Sending toggle request for monastery:', monasteryId);
        
        // Ensure monasteryId is a number
        const numericId = parseInt(monasteryId);
        if (isNaN(numericId)) {
            throw new Error(`Invalid monastery ID: ${monasteryId}`);
        }
        
        const response = await api.post('/users/wishlist/toggle', { 
            monasteryId: numericId 
        });
        
        console.log('API: Toggle response received:', response);
        return response;
    } catch (error) {
        console.error('Error toggling wishlist:', error);
        
        if (error.response) {
            console.error('API Error Details:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    data: error.config?.data
                }
            });
        }
        
        throw error;
    }
};