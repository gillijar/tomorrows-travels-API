const mongoose = require("mongoose");
const validator = require("validator");
const slugify = require("slugify");

const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A restaurant must have a name"],
    trim: true,
  },
  city: {
    type: String,
    required: [true, "An attraction must have a location"],
    trim: true,
    maxLength: [40, "The city must be 40 or less characters"],
    validate: {
      validator: function (val) {
        return validator.isAlpha(val.split(" ").join(""));
      },
      message: "A city must only contain characters",
    },
  },
  state: {
    type: String,
    trim: true,
    required: [true, "An attraction must have a state field"],
  },
  location: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  price: {
    type: String,
    required: [true, "A restaurant must have a price"],
  },
  description: {
    type: String,
    trim: true,
  },
  coverImage: {
    type: String,
    // required: [true, "An attraction must have one or more cover images"],
  },
  images: {
    type: [String],
    // required: [true, "An attraction must have one or more images"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  ratingsAverage: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: [String],
  },
  reviewsAmount: {
    type: Number,
    default: 0,
  },
  hoursOfOperation: {
    type: String,
    required: false,
  },
  website: {
    type: String,
  },
  tag: {
    type: String,
    required: [true, "A restaurant must have a tag"],
  },
  category: {
    type: String,
    required: [true, "A restaurant must have a category"],
  },
});

RestaurantSchema.pre("save", function (next) {
  const city = this.city;
  const citySlug = slugify(city, { lower: true });

  const state = this.state;
  const stateSlug = slugify(state, { lower: true });

  const locationArr = new Array(citySlug, stateSlug);
  this.location = locationArr.join("_");
  next();
});

const Restaurant = mongoose.model("restaurant", RestaurantSchema);

module.exports = Restaurant;
