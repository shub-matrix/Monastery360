import reviewModel from "../models/reviewModel.js";
import userModel from "../models/userModel.js";

export const createReview = async (req, res) => {
  try {
    const { difficulty, comment, rating, monasteryId, monasteryName } = req.body;
    const userId = req.user.id;

    console.log("Creating review for user:", userId); // Debug log
    console.log("Review data:", { difficulty, comment, rating, monasteryId, monasteryName }); // Debug log

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validation for required fields
    if (!rating || !difficulty || !comment) {
      return res.status(400).json({ 
        message: "Rating, difficulty, and comment are required" 
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        message: "Rating must be between 1 and 5" 
      });
    }

    if (!["easy", "moderate", "hard"].includes(difficulty)) {
      return res.status(400).json({ 
        message: "Difficulty must be 'easy', 'moderate', or 'hard'" 
      });
    }

    if (comment.length < 10 || comment.length > 1000) {
      return res.status(400).json({ 
        message: "Comment must be between 10 and 1000 characters" 
      });
    }

    const newReview = new reviewModel({
      user: userId,
      userName: `${user.firstName} ${user.lastName}`,
      difficulty,
      comment,
      rating,
      monasteryId: monasteryId || null,
      monasteryName: monasteryName || null
    });

    await newReview.save();

    res.status(201).json({
      message: "Review submitted successfully!",
      review: newReview
    });
  } catch (err) {
    console.log("Review creation error:", err);
    res.status(400).json({ message: "Error creating review", error: err.message });
  }
};

export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const { monasteryId, page = 1, limit = 10 } = req.query;
    
    // Build filter for user's reviews
    const filter = { user: userId };
    if (monasteryId) {
      filter.monasteryId = monasteryId;
    }

    const reviews = await reviewModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await reviewModel.countDocuments(filter);

    res.status(200).json({
      message: "User reviews retrieved successfully",
      reviews,
      count: reviews.length,
      total,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error retrieving reviews", error: err.message });
  }
};

// Updated to work with specific review ID instead of user ID
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { difficulty, comment, rating } = req.body;
    const userId = req.user.id;

    // Validation
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ 
        message: "Rating must be between 1 and 5" 
      });
    }

    if (difficulty && !["easy", "moderate", "hard"].includes(difficulty)) {
      return res.status(400).json({ 
        message: "Difficulty must be 'easy', 'moderate', or 'hard'" 
      });
    }

    if (comment && (comment.length < 10 || comment.length > 1000)) {
      return res.status(400).json({ 
        message: "Comment must be between 10 and 1000 characters" 
      });
    }

    // Find review and ensure it belongs to the current user
    const review = await reviewModel.findOne({ _id: reviewId, user: userId });
    if (!review) {
      return res.status(404).json({ 
        message: "Review not found or you don't have permission to update it" 
      });
    }

    // Update only provided fields
    if (difficulty !== undefined) review.difficulty = difficulty;
    if (comment !== undefined) review.comment = comment;
    if (rating !== undefined) review.rating = rating;

    await review.save();

    res.status(200).json({
      message: "Review updated successfully",
      review
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error updating review", error: err.message });
  }
};

// Updated to work with specific review ID instead of user ID
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    // Find and delete review, ensuring it belongs to the current user
    const review = await reviewModel.findOneAndDelete({ 
      _id: reviewId, 
      user: userId 
    });
    
    if (!review) {
      return res.status(404).json({ 
        message: "Review not found or you don't have permission to delete it" 
      });
    }

    res.status(200).json({
      message: "Review deleted successfully",
      deletedReview: review
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error deleting review", error: err.message });
  }
};

// Legacy method - kept for backward compatibility but deprecated
export const updateUserReview = async (req, res) => {
  try {
    return res.status(400).json({ 
      message: "This endpoint is deprecated. Please use PUT /reviews/:reviewId instead",
      deprecated: true,
      newEndpoint: "PUT /reviews/:reviewId"
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error updating review", error: err.message });
  }
};

// Legacy method - kept for backward compatibility but deprecated
export const deleteUserReview = async (req, res) => {
  try {
    return res.status(400).json({ 
      message: "This endpoint is deprecated. Please use DELETE /reviews/:reviewId instead",
      deprecated: true,
      newEndpoint: "DELETE /reviews/:reviewId"
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error deleting review", error: err.message });
  }
};

// Get reviews for specific monastery
export const getMonasteryReviews = async (req, res) => {
  try {
    const { monasteryId } = req.params;
    const { difficulty, page = 1, limit = 10 } = req.query;
    
    const filter = { monasteryId };
    if (difficulty) {
      filter.difficulty = difficulty;
    }

    const reviews = await reviewModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'firstName lastName');

    const total = await reviewModel.countDocuments(filter);

    // Calculate stats for this monastery
    const stats = await reviewModel.aggregate([
      { $match: { monasteryId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          difficultyBreakdown: {
            $push: "$difficulty"
          }
        }
      }
    ]);

    const difficultyStats = {};
    if (stats.length > 0) {
      stats[0].difficultyBreakdown.forEach(diff => {
        difficultyStats[diff] = (difficultyStats[diff] || 0) + 1;
      });
    }

    res.status(200).json({
      message: "Monastery reviews retrieved successfully",
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      stats: stats.length > 0 ? {
        averageRating: stats[0].averageRating,
        totalReviews: stats[0].totalReviews,
        difficultyBreakdown: difficultyStats
      } : null
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error retrieving monastery reviews", error: err.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const { difficulty, monasteryId, page = 1, limit = 10 } = req.query;
    const filter = {};
    
    if (difficulty) {
      filter.difficulty = difficulty;
    }
    
    if (monasteryId) {
      filter.monasteryId = monasteryId;
    }

    const reviews = await reviewModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await reviewModel.countDocuments(filter);

    const stats = await reviewModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          difficultyBreakdown: {
            $push: "$difficulty"
          }
        }
      }
    ]);

    const difficultyStats = {};
    if (stats.length > 0) {
      stats[0].difficultyBreakdown.forEach(diff => {
        difficultyStats[diff] = (difficultyStats[diff] || 0) + 1;
      });
    }

    res.status(200).json({
      message: "Reviews retrieved successfully",
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      stats: stats.length > 0 ? {
        averageRating: stats[0].averageRating,
        totalReviews: stats[0].totalReviews,
        difficultyBreakdown: difficultyStats
      } : null
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error retrieving reviews", error: err.message });
  }
};

export const getAllReviewsForAdmin = async (req, res) => {
  try {
    const { difficulty, monasteryId, page = 1, limit = 10 } = req.query;
    const filter = {};
    
    if (difficulty) filter.difficulty = difficulty;
    if (monasteryId) filter.monasteryId = monasteryId;

    const reviews = await reviewModel
      .find(filter)
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await reviewModel.countDocuments(filter);

    const overviewStats = await reviewModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$difficulty",
          count: { $sum: 1 },
          avgRating: { $avg: "$rating" }
        }
      }
    ]);

    res.status(200).json({
      message: "Admin reviews retrieved successfully",
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalReviews: total
      },
      overviewStats
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error retrieving admin reviews", error: err.message });
  }
};

export const getReviewDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await reviewModel
      .findById(id)
      .populate('user', 'firstName lastName email role status createdAt');

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({
      message: "Review details retrieved successfully",
      review
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error retrieving review details", error: err.message });
  }
};

export const deleteReviewByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await reviewModel.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({
      message: "Review deleted successfully",
      deletedReview: review
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error deleting review", error: err.message });
  }
};

export const getReviewDashboardStats = async (req, res) => {
  try {
    const stats = await reviewModel.aggregate([
      {
        $facet: {
          difficultyBreakdown: [
            {
              $group: {
                _id: "$difficulty",
                count: { $sum: 1 },
                avgRating: { $avg: "$rating" }
              }
            }
          ],
          monasteryBreakdown: [
            {
              $group: {
                _id: "$monasteryId",
                monasteryName: { $first: "$monasteryName" },
                count: { $sum: 1 },
                avgRating: { $avg: "$rating" }
              }
            }
          ],
          overallStats: [
            {
              $group: {
                _id: null,
                totalReviews: { $sum: 1 },
                averageRating: { $avg: "$rating" }
              }
            }
          ],
          recentReviews: [
            {
              $sort: { createdAt: -1 }
            },
            {
              $limit: 5
            },
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userInfo"
              }
            }
          ]
        }
      }
    ]);

    res.status(200).json({
      message: "Dashboard stats retrieved successfully",
      stats: stats[0]
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error retrieving dashboard stats", error: err.message });
  }
};

// Health check function for review system
export const reviewHealthCheck = async (req, res) => {
  try {
    const startTime = Date.now();
    
    // Test database connectivity and basic operations
    const healthStatus = {
      service: "Review System",
      status: "healthy",
      timestamp: new Date().toISOString(),
      checks: {
        database: { status: "unknown", message: "", responseTime: 0 },
        publicReviews: { status: "unknown", message: "", count: 0 },
        totalReviews: { status: "unknown", message: "", count: 0 }
      }
    };

    // Test 1: Database connection
    try {
      const dbStartTime = Date.now();
      const dbResult = await reviewModel.findOne().limit(1);
      healthStatus.checks.database = {
        status: "healthy",
        message: "Database connection successful",
        responseTime: Date.now() - dbStartTime
      };
    } catch (dbErr) {
      healthStatus.checks.database = {
        status: "unhealthy",
        message: `Database connection failed: ${dbErr.message}`,
        responseTime: Date.now() - startTime
      };
      healthStatus.status = "unhealthy";
    }

    // Test 2: Public reviews functionality
    try {
      const publicStartTime = Date.now();
      const allReviews = await reviewModel.find({});
      healthStatus.checks.publicReviews = {
        status: "healthy",
        message: "Public reviews retrieval successful",
        count: allReviews.length,
        responseTime: Date.now() - publicStartTime
      };
    } catch (publicErr) {
      healthStatus.checks.publicReviews = {
        status: "unhealthy",
        message: `Public reviews retrieval failed: ${publicErr.message}`,
        count: 0
      };
      healthStatus.status = "unhealthy";
    }

    // Test 3: Total reviews count
    try {
      const totalStartTime = Date.now();
      const totalCount = await reviewModel.countDocuments();
      healthStatus.checks.totalReviews = {
        status: "healthy",
        message: "Total reviews count successful",
        count: totalCount,
        responseTime: Date.now() - totalStartTime
      };
    } catch (totalErr) {
      healthStatus.checks.totalReviews = {
        status: "unhealthy",
        message: `Total reviews count failed: ${totalErr.message}`,
        count: 0
      };
      healthStatus.status = "unhealthy";
    }

    // Overall response time
    healthStatus.totalResponseTime = Date.now() - startTime;

    // Return appropriate status code
    const statusCode = healthStatus.status === "healthy" ? 200 : 503;
    
    res.status(statusCode).json({
      message: `Review system health check completed - ${healthStatus.status}`,
      health: healthStatus
    });

  } catch (err) {
    console.log("Health check error:", err);
    res.status(503).json({
      message: "Review system health check failed",
      health: {
        service: "Review System",
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: err.message
      }
    });
  }
};

// Debug endpoint to help troubleshoot review submission issues
export const debugReviewSubmission = async (req, res) => {
  try {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      auth: {
        hasUser: !!req.user,
        userId: req.user?.id || "undefined",
        userEmail: req.user?.email || "undefined",
        userRole: req.user?.role || "undefined"
      },
      requestBody: req.body,
      validation: {},
      database: {}
    };

    // Check user authentication
    if (!req.user?.id) {
      debugInfo.auth.issue = "No user ID found in request";
      return res.status(401).json({
        message: "Authentication debug - User not properly authenticated",
        debug: debugInfo
      });
    }

    // Check if user exists in database
    try {
      const user = await userModel.findById(req.user.id);
      debugInfo.database.userExists = !!user;
      debugInfo.database.userData = user ? {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      } : null;
    } catch (userError) {
      debugInfo.database.userCheckError = userError.message;
    }

    // Check for existing reviews (now supports multiple)
    try {
      const existingReviews = await reviewModel.find({ user: req.user.id });
      debugInfo.database.existingReviewsCount = existingReviews.length;
      debugInfo.database.existingReviews = existingReviews.map(review => ({
        id: review._id,
        monasteryId: review.monasteryId,
        monasteryName: review.monasteryName,
        rating: review.rating,
        createdAt: review.createdAt
      }));
    } catch (reviewError) {
      debugInfo.database.reviewCheckError = reviewError.message;
    }

    // Validate request body
    const { difficulty, comment, rating, monasteryId, monasteryName } = req.body;
    debugInfo.validation = {
      difficulty: {
        value: difficulty,
        valid: ["easy", "moderate", "hard"].includes(difficulty),
        required: true
      },
      comment: {
        value: comment,
        length: comment ? comment.length : 0,
        valid: comment && comment.length >= 10 && comment.length <= 1000,
        required: true
      },
      rating: {
        value: rating,
        type: typeof rating,
        valid: Number.isInteger(rating) && rating >= 1 && rating <= 5,
        required: true
      },
      monasteryId: {
        value: monasteryId,
        provided: !!monasteryId,
        required: false
      },
      monasteryName: {
        value: monasteryName,
        provided: !!monasteryName,
        required: false
      }
    };

    res.status(200).json({
      message: "Review submission debug information",
      debug: debugInfo
    });

  } catch (err) {
    res.status(500).json({
      message: "Debug endpoint error",
      error: err.message
    });
  }
};