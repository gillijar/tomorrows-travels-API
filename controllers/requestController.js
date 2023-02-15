const Request = require("../models/requestModel");
const Location = require("../models/locationModel");
const AppError = require("../utilities/appError");
const catchAsync = require("../utilities/catchAsync");

exports.getRequests = async (req, res) => {
  try {
    const requests = await Request.find();

    res.status(200).json({
      status: "success",
      results: requests.length,
      data: {
        requests,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createRequest = catchAsync(async (req, res) => {
  const request = await Request.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      request,
    },
  });
});

// exports.getAttraction = catchAsync(async (req, res, next) => {
//   const id = req.params.id;
//   const attractions = await Attraction.findById(id).populate("reviews");

//   if (!attractions) {
//     return next(new AppError("No attraction found with that ID", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       attractions,
//     },
//   });
// });

// exports.updateAttraction = async (req, res) => {
//   try {
//     const attraction = await Attraction.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     res.status(200).json({
//       status: "success",
//       data: {
//         attraction,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: "fail",
//       message: err,
//     });
//   }
// };

// exports.deleteAttraction = async (req, res) => {
//   try {
//     const attraction = await Attraction.findByIdAndDelete(req.params.id);

//     res.status(201).json({
//       status: "success",
//       data: null,
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: "fail",
//       message: err,
//     });
//   }
// };
