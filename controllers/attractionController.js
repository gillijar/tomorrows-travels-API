const Attraction = require("../models/attractionModel");
const Location = require("../models/locationModel");
const ControllerFeatures = require("../utilities/controllerFeatures");
const slugify = require("slugify");
const AppError = require("../utilities/appError");
const catchAsync = require("../utilities/catchAsync");

exports.getAllAttractions = async (req, res) => {
  try {
    const features = new ControllerFeatures(Attraction.find(), req.query)
      .filter()
      .sort()
      .limit();

    const attractions = await features.query;

    res.status(200).json({
      status: "success",
      results: attractions.length,
      data: {
        attractions,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createAttraction = async (req, res) => {
  try {
    let newLocation;

    const newAttraction = await Attraction.create(req.body);
    const findLocation = await Location.find({
      city: req.body.city,
      state: req.body.state,
    });

    if (findLocation.length === 0) {
      const attractionLocation = `${req.body.city} ${req.body.state}`;
      const transformedLocation = attractionLocation.toLowerCase();

      const searchLocation = `${slugify(req.body.city, {
        lower: true,
      })}_${slugify(req.body.state, { lower: true })}`;

      newLocation = await Location.create({
        city: req.body.city,
        state: req.body.state,
        location: transformedLocation,
        searchLocation,
        numLocations: 1,
      });
    } else {
      const num = findLocation[0].numLocations + 1;
      newLocation = await Location.findOneAndUpdate(
        { city: req.body.city, state: req.body.state },
        { numLocations: num },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    res.status(201).json({
      status: "success",
      data: {
        newAttraction,
        newLocation,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getAttraction = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const attractions = await Attraction.findById(id).populate("reviews");

  if (!attractions) {
    return next(new AppError("No attraction found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      attractions,
    },
  });
});

exports.updateAttraction = async (req, res) => {
  try {
    const attraction = await Attraction.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        attraction,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteAttraction = async (req, res) => {
  try {
    const attraction = await Attraction.findByIdAndDelete(req.params.id);

    res.status(201).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
