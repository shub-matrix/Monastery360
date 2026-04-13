import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { reviewAPI } from '../../services/reviewAPI';
import './ReviewSection.css';
import './additional-review-styles.css';

const ReviewSection = ({ monasteryId, monasteryName }) => {
    const { isAuthenticated, user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [userReview, setUserReview] = useState(null);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const params = {
                page: currentPage,
                limit: 10
            };

            let response;
            
            if (monasteryName && monasteryName.trim() !== '') {
                try {
                    response = await reviewAPI.getMonasteryReviews(monasteryName.trim(), params);
                } catch (monasteryError) {
                    response = await reviewAPI.getAllReviews(params);
                }
            } else {
                response = await reviewAPI.getAllReviews(params);
            }
            
            if (response) {
                setReviews(response.reviews || []);
                setStats(response.stats || null);
                setPagination(response.pagination || null);
            } else {
                setReviews([]);
                setStats(null);
                setPagination(null);
            }
            
        } catch (err) {
            const errorMessage = err.response?.data?.message || 
                               err.response?.data?.error || 
                               err.message || 
                               'Failed to load reviews. Please try again later.';
            
            setError(errorMessage);
            setReviews([]);
            setStats(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserReview = async () => {
        if (!isAuthenticated || !monasteryName) return;
        
        try {
            const response = await reviewAPI.getUserReviewsForMonastery(monasteryName.trim());
            if (response.reviews && response.reviews.length > 0) {
                setUserReview(response.reviews[0]);
            } else {
                setUserReview(null);
            }
        } catch (err) {
            setUserReview(null);
        }
    };

    useEffect(() => {
        fetchReviews();
        fetchUserReview();
    }, [currentPage, monasteryName, isAuthenticated]);

    const handleReviewSubmitted = () => {
        setShowForm(false);
        setEditingReview(null);
        fetchReviews();
        fetchUserReview();
    };

    const handleReviewUpdated = () => {
        setShowForm(false);
        setEditingReview(null);
        fetchReviews();
        fetchUserReview();
    };

    const handleEditReview = (review) => {
        setEditingReview(review);
        setShowForm(true);
    };

    const handleDeleteReview = async () => {
        if (!window.confirm('Are you sure you want to delete your review?')) {
            return;
        }
        
        try {
            await reviewAPI.deleteUserReview();
            fetchReviews();
            fetchUserReview();
        } catch (err) {
            alert('Failed to delete review. Please try again.');
        }
    };




    return (
        <div className="review-section-container">
            <div className="review-section">
                <div className="review-header-compact">
                    <h3>Reviews & Experiences</h3>
                    <p>Share and discover spiritual journeys at {monasteryName}</p>
                </div>

                <div className="review-actions">
                    {isAuthenticated ? (
                        <div className="review-action-buttons">
                            {userReview ? (
                                <div className="existing-review-actions">
                                    <p className="has-review-text">You have already reviewed this monastery</p>
                                    <div className="review-buttons">
                                        <button 
                                            className="btn btn-outline edit-review-btn"
                                            onClick={() => handleEditReview(userReview)}
                                        >
                                            Edit Review
                                        </button>
                                        <button 
                                            className="btn btn-danger delete-review-btn"
                                            onClick={handleDeleteReview}
                                        >
                                            Delete Review
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    className="btn btn-primary write-review-btn"
                                    onClick={() => setShowForm(!showForm)}
                                >
                                    {showForm ? 'Cancel' : 'Write a Review'}
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="auth-required">
                            <p>Please login to write a review</p>
                            <div className="auth-buttons">
                                <Link to="/login" className="btn btn-primary">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-outline">
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {showForm && isAuthenticated && !userReview && (
                    <div className="review-form-container">
                        <ReviewForm
                            existingReview={editingReview}
                            monasteryId={monasteryId}
                            monasteryName={monasteryName}
                            onClose={() => {
                                setShowForm(false);
                                setEditingReview(null);
                            }}
                            onReviewSubmitted={handleReviewSubmitted}
                            onReviewUpdated={handleReviewUpdated}
                            isInline={true}
                        />
                    </div>
                )}

                <div className="reviews-display">
                    {loading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <span>Loading reviews...</span>
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            <div className="error-icon">⚠️</div>
                            <h4>Unable to Load Reviews</h4>
                            <p className="error-message">{error}</p>
                            <div className="error-actions">
                                <button 
                                    className="btn btn-primary"
                                    onClick={fetchReviews}
                                >
                                    Try Again
                                </button>
                                {monasteryId && (
                                    <button 
                                        className="btn btn-outline"
                                        onClick={async () => {
                                            try {
                                                setLoading(true);
                                                const response = await reviewAPI.getAllReviews({ page: 1, limit: 10 });
                                                setReviews(response.reviews || []);
                                                setStats(response.stats || null);
                                                setError(null);
                                            } catch (err) {
                                                setError('Unable to load any reviews at this time.');
                                            } finally {
                                                setLoading(false);
                                            }
                                        }}
                                    >
                                        View All Reviews
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="reviews-list-compact">
                            <div className="reviews-header">
                                <h4>Reviews for {monasteryName}</h4>
                                {stats && (
                                    <div className="monastery-stats">
                                        <span className="average-rating">
                                            ⭐ {stats.averageRating ? stats.averageRating.toFixed(1) : 'No ratings'}
                                        </span>
                                        <span className="total-reviews">
                                            ({stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''})
                                        </span>
                                    </div>
                                )}
                                {reviews.length > 0 && (
                                    <span className="reviews-showing">
                                        Showing {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                                        {pagination && pagination.totalReviews > reviews.length && (
                                            <span> of {pagination.totalReviews}</span>
                                        )}
                                    </span>
                                )}
                            </div>
                            {reviews.length === 0 ? (
                                <div className="no-reviews">
                                    <p>No reviews yet for this monastery.</p>
                                    {isAuthenticated && !userReview && (
                                        <p>Be the first to share your experience!</p>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <ReviewList 
                                        reviews={reviews} 
                                        currentPage={currentPage}
                                        onPageChange={setCurrentPage}
                                        onEditReview={handleEditReview}
                                        onDeleteReview={handleDeleteReview}
                                        pagination={pagination}
                                        currentUser={user}
                                    />
                                    {pagination && pagination.totalPages > 1 && (
                                        <div className="pagination-container">
                                            <div className="pagination">
                                                {pagination.hasPrev && (
                                                    <button 
                                                        className="btn btn-outline"
                                                        onClick={() => setCurrentPage(currentPage - 1)}
                                                        disabled={loading}
                                                    >
                                                        Previous
                                                    </button>
                                                )}
                                                <span className="page-info">
                                                    Page {pagination.currentPage} of {pagination.totalPages}
                                                </span>
                                                {pagination.hasNext && (
                                                    <button 
                                                        className="btn btn-outline"
                                                        onClick={() => setCurrentPage(currentPage + 1)}
                                                        disabled={loading}
                                                    >
                                                        Next
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewSection;