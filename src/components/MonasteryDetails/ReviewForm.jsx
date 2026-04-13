import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { reviewAPI } from '../../services/reviewAPI';
import './ReviewForm.css';

const ReviewForm = ({ existingReview, monasteryId, monasteryName, onClose, onReviewSubmitted, onReviewUpdated, isInline = false }) => {    const { isAuthenticated, user } = useAuth();    const [formData, setFormData] = useState({
        rating: 5,
        difficulty: 'Select',
        comment: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (existingReview) {
            setFormData({
                rating: existingReview.rating,
                difficulty: existingReview.difficulty,
                comment: existingReview.comment
            });
        }
    }, [existingReview]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRatingChange = (rating) => {
        setFormData(prev => ({
            ...prev,
            rating
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.comment.trim().length < 10) {
            setError('Please write at least 10 characters in your review.');
            return;
        }

        if (formData.comment.trim().length > 1000) {
            setError('Review must be less than 1000 characters.');
            return;
        }

        if (formData.difficulty === 'Select') {
            setError('Please select a difficulty level for your visit.');
            return;
        }

        console.log('Auth state:', { isAuthenticated, user });
        const token = localStorage.getItem('token');
        console.log('Token exists:', !!token);
        console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
        
        if (!isAuthenticated || !token) {
            setError('You must be logged in to submit a review. Please log in and try again.');
            return;
        }

        if (!monasteryName || monasteryName.trim() === '') {
            console.error('Missing monasteryName:', { monasteryId, monasteryName });
            setError('Monastery name is missing. Please refresh the page and try again.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (existingReview) {
                console.log('Updating existing review:', existingReview._id);
                const updateData = {
                    ...formData,
                    monastery: monasteryName.trim()
                };
                await reviewAPI.updateReview(existingReview._id, updateData);
                onReviewUpdated();
            } else {
                const reviewData = {
                    ...formData,
                    monastery: monasteryName.trim()
                };
                console.log('Submitting new review data:', reviewData);
                console.log('User info:', user);
                console.log('API endpoint:', 'https://form-backend-gold.vercel.app/api/reviews');
                
                console.log('Testing API connectivity...');
                try {
                    const testResponse = await fetch('https://form-backend-gold.vercel.app/api/reviews/public');
                    console.log('API connectivity test - Status:', testResponse.status);
                    console.log('API connectivity test - OK:', testResponse.ok);
                } catch (connectError) {
                    console.error('API connectivity test failed:', connectError);
                }
                
                const result = await reviewAPI.createReview(reviewData);
                console.log('Review created successfully:', result);
                onReviewSubmitted();
            }
        } catch (err) {
            console.error('Error submitting review:', err);
            console.error('Error details:', {
                status: err.response?.status,
                statusText: err.response?.statusText,
                data: err.response?.data,
                message: err.message,
                code: err.code,
                config: err.config,
                request: err.request
            });
            
            console.error('Full error object:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
            
            let errorMessage = 'Failed to submit review. Please try again.';
            
            if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
                errorMessage = 'Network error. Please check your internet connection.';
            } else if (err.code === 'ERR_NETWORK') {
                errorMessage = 'Cannot connect to server. Please try again later.';
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.response?.status === 401) {
                errorMessage = 'Authentication failed. Please log in again.';
            } else if (err.response?.status === 400) {
                errorMessage = 'Invalid review data. Please check all fields.';
            } else if (err.response?.status === 500) {
                errorMessage = 'Server error. Please try again later.';
            } else if (err.response?.status === 404) {
                errorMessage = 'API endpoint not found. Please contact support.';
            } else if (!navigator.onLine) {
                errorMessage = 'No internet connection. Please check your connection and try again.';
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!existingReview) return;
        
        if (!window.confirm('Are you sure you want to delete your review? This action cannot be undone.')) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            await reviewAPI.deleteReview(existingReview._id);
            onReviewUpdated();
        } catch (err) {
            console.error('Error deleting review:', err);
            setError(err.response?.data?.message || 'Failed to delete review. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={isInline ? "inline-review-form-container" : "review-form-overlay"}>
            <div className={isInline ? "inline-review-form-content" : "review-form-modal"}>
                {!isInline && (
                    <div className="review-form-header">
                        <h3>{existingReview ? 'Edit Your Review' : 'Write a Review'}</h3>
                        <button 
                            className="close-btn"
                            onClick={onClose}
                            disabled={loading}
                        >
                            ×
                        </button>
                    </div>
                )}

                <div className="review-form-content">
                    {!isInline && (
                        <div className="monastery-info">
                            <h4>{monasteryName}</h4>
                            <p>Share your experience and help fellow travelers plan their visit</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="review-form">
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label>Overall Rating *</label>
                            <div className="rating-input">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`star-btn ${star <= formData.rating ? 'filled' : ''}`}
                                        onClick={() => handleRatingChange(star)}
                                    >
                                        ⭐
                                    </button>
                                ))}
                                <span className="rating-text">
                                    {formData.rating} {formData.rating === 1 ? 'star' : 'stars'}
                                </span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="difficulty">Difficulty Level *</label>
                            <select
                                id="difficulty"
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="Select">Select Any One</option>
                                <option value="easy">Easy - Suitable for all ages</option>
                                <option value="moderate">Moderate - Some walking required</option>
                                <option value="hard">Hard - Challenging terrain/altitude</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="comment">Your Experience *</label>
                            <textarea
                                id="comment"
                                name="comment"
                                value={formData.comment}
                                onChange={handleInputChange}
                                placeholder="Share your experience... What did you enjoy most? Any tips for other visitors?"
                                rows={isInline ? 3 : 5}
                                minLength={10}
                                maxLength={1000}
                                required
                            />
                            <div className="character-count">
                                {formData.comment.length}/1000 characters
                                {formData.comment.length < 10 && (
                                    <span className="min-char-warning">
                                        (Minimum 10 characters required)
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="form-actions">
                            <div className="primary-actions">
                                <button 
                                    type="button" 
                                    className="btn btn-outline btn-small"
                                    onClick={onClose}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className={`btn btn-primary ${isInline ? 'btn-small' : ''}`}
                                    disabled={loading || formData.comment.length < 10 || formData.difficulty === 'Select'}
                                >
                                    {loading ? 'Submitting...' : (existingReview ? 'Update Review' : 'Submit Review')}
                                </button>
                            </div>

                            {existingReview && !isInline && (
                                <div className="delete-action">
                                    <button 
                                        type="button"
                                        className="btn btn-danger btn-small"
                                        onClick={handleDelete}
                                        disabled={loading}
                                    >
                                        {loading ? 'Deleting...' : 'Delete Review'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReviewForm;