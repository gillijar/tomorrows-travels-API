const Restaurant = require("../models/restaurantModel");
const Location = require("../models/locationModel");
const ControllerFeatures = require("../utilities/controllerFeatures");
const slugify = require("slugify");

exports.getAllRestaurants = async (req, res) => {
  try {
    const features = new ControllerFeatures(Restaurant.find(), req.query)
      .filter()
      .sort()
      .limit();

    const restaurants = await features.query;

    res.status(200).json({
      status: "success",
      data: {
        restaurants,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createRestaurant = async (req, res) => {
  try {
    let newLocation;

    const newRestaurant = await Restaurant.create(req.body);
    const findLocation = await Location.find({
      city: req.body.city,
      state: req.body.state,
    });

    if (findLocation.length === 0) {
      const restaurantLocation = `${req.body.city} ${req.body.state}`;
      const transformedLocation = restaurantLocation.toLowerCase();

      const searchLocation = `${slugify(req.body.city, {
        lower: true,
      })}_${slugify(req.body.state, { lower: true })}`;

      newLocation = await Location.create({
        city: req.body.city,
        state: req.body.state,
        location: transformedLocation,
        searchLocation,
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
        newRestaurant,
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

exports.getRestaurant = async (req, res) => {
  try {
    const id = req.params.id;
    const restaurants = await Restaurant.findById(id);

    res.status(200).json({
      status: "success",
      data: {
        restaurants,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
