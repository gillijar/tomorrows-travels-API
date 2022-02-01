const catchAsync = require("../utilities/catchAsync");
const Review = require("../models/reviewModel");
const AppError = require("../utilities/appError");

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const { review, rating, user } = req.body;

  if (!review && !rating && !user) {
    return next(new AppError("Please fill out all the fields", 401));
  }

  if (!review)
    return next(new AppError("Review field can not be left empty", 401));

  if (!rating) return next(new AppError("Review must have a rating.", 401));

  if (!user) return next(new AppError("Review must have a user field.", 401));

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      review: newReview,
    },
  });
});
