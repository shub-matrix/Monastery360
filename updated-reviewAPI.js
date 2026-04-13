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
        }
        return config;
    },
    (error) => {
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
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const reviewAPI = {
    // Public API - Get all reviews
    getAllReviews: async (params = {}) => {
        const queryParams = new URLSearchParams(params).toString();
        return await api.get(`/reviews/public${queryParams ? `?${queryParams}` : ''}`);
    },

    // Get reviews for specific monastery
    getMonasteryReviews: async (monasteryId, params = {}) => {
        const queryParams = new URLSearchParams(params).toString();
        return await api.get(`/reviews/monastery/${monasteryId}${queryParams ? `?${queryParams}` : ''}`);
    },

    // User APIs (require authentication)
    createReview: async (reviewData) => {
        return await api.post('/reviews', reviewData);
    },

    // Get current user's reviews (supports multiple reviews)
    getUserReviews: async (params = {}) => {
        const queryParams = new URLSearchParams(params).toString();
        return await api.get(`/reviews/my-reviews${queryParams ? `?${queryParams}` : ''}`);
    },

    // Update specific review by review ID
    updateReview: async (reviewId, reviewData) => {
        return await api.put(`/reviews/${reviewId}`, reviewData);
    },

    // Delete specific review by review ID
    deleteReview: async (reviewId) => {
        return await api.delete(`/reviews/${reviewId}`);
    },

    // Admin APIs (require admin role)
    getAllReviewsForAdmin: async (params = {}) => {
        const queryParams = new URLSearchParams(params).toString();
        return await api.get(`/reviews/admin${queryParams ? `?${queryParams}` : ''}`);
    },

    getReviewDetailsForAdmin: async (reviewId) => {
        return await api.get(`/reviews/admin/${reviewId}`);
    },

    deleteReviewByAdmin: async (reviewId) => {
        return await api.delete(`/reviews/admin/${reviewId}`);
    },

    getReviewDashboardStats: async () => {
        return await api.get('/reviews/admin/dashboard/stats');
    },

    // Debug endpoint
    debugReviewSubmission: async () => {
        return await api.get('/reviews/debug');
    },

    // Legacy methods (deprecated) - kept for backward compatibility
    updateUserReview: async (reviewData) => {
        console.warn('updateUserReview is deprecated. Use updateReview(reviewId, reviewData) instead.');
        return await api.put('/reviews/my-review', reviewData);
    },

    deleteUserReview: async () => {
        console.warn('deleteUserReview is deprecated. Use deleteReview(reviewId) instead.');
        return await api.delete('/reviews/my-review');
    }
};

export default reviewAPI;