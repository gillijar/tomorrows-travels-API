const mongoose = require("mongoose");
const validator = require("validator");

const LocationSchema = new mongoose.Schema({
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
  location: String,
  searchLocation: String,
  numLocations: Number,
});

const Location = mongoose.model("location", LocationSchema);

module.exports = Location;
