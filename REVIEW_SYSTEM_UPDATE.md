# Review System Update Summary

## Overview
Updated the review system to work with monastery-specific reviews where each monastery has separate reviews that are filtered and displayed based on the monastery name.

## Key Changes Made

### 1. Backend Integration (`reviewAPI.js`)
- Updated `getMonasteryReviews()` to use monastery names instead of IDs
- Added `getMonasteries()` method to fetch list of monasteries with reviews
- Added `getUserReviewsForMonastery()` to get user's review for specific monastery  
- Updated API endpoints to match your backend routes:
  - `GET /reviews/monastery/:monasteryName` - get reviews for specific monastery
  - `GET /reviews/my-reviews?monastery=monasteryName` - get user's reviews for monastery
  - `POST /reviews/` - create review with `monastery` field
  - `PUT /reviews/my-review/:reviewId` - update user's review
  - `DELETE /reviews/my-review` - delete user's review

### 2. Review Form (`ReviewForm.jsx`)
- Changed to send `monastery` field (string) instead of `monasteryId` and `monasteryName`
- Updated validation to check for `monasteryName` instead of `monasteryId`
- Ensures reviews are properly associated with monastery names
- Added monastery name to update requests

### 3. Review Section (`ReviewSection.jsx`)
- Uses `monasteryName` for all API calls instead of `monasteryId`
- Added user review checking - fetches user's existing review for the monastery
- Prevents multiple reviews per user per monastery
- Shows edit/delete options only for user's own review
- Added monastery-specific stats display (average rating, total reviews)
- Improved error handling and loading states
- Added pagination support
- Shows "No reviews yet" state when monastery has no reviews

### 4. Review List (`ReviewList.jsx`)  
- Updated user review identification to work with backend user IDs
- Added "Your Review" label for user's own reviews
- Updated delete functionality to work with backend API
- Improved review display with monastery stats
- Added pagination display

### 5. Enhanced UI Styles
- Added styles for new UI elements (edit/delete buttons, review status labels)
- Responsive design improvements
- Better visual feedback for user interactions
- Enhanced pagination controls

## How It Works

### For Users:
1. **First Time Review**: User can write a review for a monastery
2. **Existing Review**: If user already reviewed the monastery, they see "You have already reviewed this monastery" with edit/delete options
3. **Monastery-Specific**: Reviews are filtered by monastery - each monastery shows only its own reviews

### For Review Display:
1. **Monastery Page**: Shows only reviews for that specific monastery
2. **Statistics**: Shows average rating and total count for the monastery  
3. **Pagination**: Handles large numbers of reviews efficiently
4. **User Management**: Users can edit/delete only their own reviews

### Backend Data Flow:
```
1. User submits review → POST /reviews/ with {rating, difficulty, comment, monastery}
2. Backend creates review with user ID and monastery name
3. Review display → GET /reviews/monastery/{monasteryName}
4. User's review check → GET /reviews/my-reviews?monastery={monasteryName}
5. Edit review → PUT /reviews/my-review/{reviewId} 
6. Delete review → DELETE /reviews/my-review
```

## Key Features

✅ **Monastery-Specific Reviews**: Each monastery has its own separate review collection
✅ **One Review Per User**: Users can only have one review per monastery
✅ **Edit/Delete Own Reviews**: Users can modify their own reviews
✅ **Review Statistics**: Shows average rating and count per monastery
✅ **Responsive Design**: Works on mobile and desktop
✅ **Error Handling**: Proper error messages and loading states
✅ **Authentication**: Requires login to write reviews
✅ **Data Validation**: Frontend and backend validation

## Usage Example

When you visit "Monastery 1" page:
- Only reviews for "Monastery 1" are displayed
- If logged in and no review exists, you can write a review
- If logged in and you already reviewed, you can edit/delete your review
- All reviews shown are specifically for "Monastery 1"

When you visit "Monastery 2" page:
- Only reviews for "Monastery 2" are displayed  
- Reviews are completely separate from "Monastery 1"
- Same review management features apply

This creates a completely isolated review system for each monastery as requested.