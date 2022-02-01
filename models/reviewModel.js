const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "Review field can not be empty"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  destination: {
    type: mongoose.Schema.ObjectId,
    ref: "destination",
    required: [true, "Review must belong to a destination"],
  },
  user: {
    type: String,
    ref: "user",
    required: [true, "Review must belong to a user"],
  },
});

const Review = mongoose.model("review", ReviewSchema);

module.exports = Review;
