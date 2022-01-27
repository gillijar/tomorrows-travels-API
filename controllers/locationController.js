const Location = require("../models/locationModel");
const ControllerFeatures = require("../utilities/controllerFeatures");

exports.getAllLocations = async (req, res) => {
  try {
    const features = new ControllerFeatures(Location.find(), req.query)
      .filter()
      .sort()
      .limit();

    const allLocations = await features.query;

    res.status(200).json({
      status: "success",
      data: {
        allLocations,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
