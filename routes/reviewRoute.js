const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { reviewSchema } = require('../schemas.js');
const { isReviewOwner, validateReview, isLoggedIn } = require('../middleware');
const review = require('../controllers/review')


router.post('/', isLoggedIn, validateReview, catchAsync(review.reviewSection))

router.delete('/:reviewId', isLoggedIn, isReviewOwner, catchAsync(review.deletingReview))

module.exports = router;