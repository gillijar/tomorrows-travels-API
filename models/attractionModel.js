const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const AttractionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "An attraction must have a name"],
      trim: true,
      maxLength: [60, "An attraction must be 40 or less characters"],
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
    },
    address: {
      type: String,
      trim: true,
      required: [true, "An attraction must have an address"],
    },
    price: {
      type: Number,
      required: [true, "An attraction must have a price. If free just put 0"],
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
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
    duration: {
      type: String,
      required: false,
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
      required: [true, "An attraction must have a tag"],
    },
    category: {
      type: String,
      required: [true, "An attraction must have a category"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

AttractionSchema.pre("save", function (next) {
  const city = this.city;
  const citySlug = slugify(city, { lower: true });

  const state = this.state;
  const stateSlug = slugify(state, { lower: true });

  const locationArr = new Array(citySlug, stateSlug);
  this.location = locationArr.join("_");
  next();
});

AttractionSchema.virtual("reviews", {
  ref: "review",
  foreignField: "destination",
  localField: "_id",
});

const Attraction = mongoose.model("attraction", AttractionSchema);

module.exports = Attraction;
