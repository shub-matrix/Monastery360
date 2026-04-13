// Updated Review Model Schema (ensure your model includes these fields)
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['easy', 'moderate', 'hard']
    },
    comment: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 1000
    },
    // NEW: Monastery-specific fields
    monasteryId: {
        type: String,
        default: null // Can be null for general reviews
    },
    monasteryName: {
        type: String,
        default: null // Can be null for general reviews
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Index for better query performance
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ monasteryId: 1, createdAt: -1 });
reviewSchema.index({ createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;