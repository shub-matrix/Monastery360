// Example routes for the updated review controller
// Add these to your review routes file

import express from 'express';
import { 
  createReview, 
  getUserReviews, 
  updateReview, 
  deleteReview,
  getMonasteryReviews,
  getAllReviews,
  getAllReviewsForAdmin,
  getReviewDetailsForAdmin,
  deleteReviewByAdmin,
  getReviewDashboardStats,
  reviewHealthCheck,
  debugReviewSubmission,
  // Legacy methods (deprecated)
  updateUserReview,
  deleteUserReview
} from '../controllers/reviewController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/public', getAllReviews);
router.get('/monastery/:monasteryId', getMonasteryReviews);
router.get('/health', reviewHealthCheck);

// User routes (require authentication)
router.use(authMiddleware); // Apply auth middleware to all routes below

router.post('/', createReview);
router.get('/my-reviews', getUserReviews);
router.put('/:reviewId', updateReview);
router.delete('/:reviewId', deleteReview);
router.get('/debug', debugReviewSubmission);

// Legacy routes (deprecated but kept for backward compatibility)
router.put('/my-review', updateUserReview); // Will return deprecation message
router.delete('/my-review', deleteUserReview); // Will return deprecation message

// Admin routes (require admin role)
router.get('/admin', adminMiddleware, getAllReviewsForAdmin);
router.get('/admin/dashboard/stats', adminMiddleware, getReviewDashboardStats);
router.get('/admin/:id', adminMiddleware, getReviewDetailsForAdmin);
router.delete('/admin/:id', adminMiddleware, deleteReviewByAdmin);

export default router;