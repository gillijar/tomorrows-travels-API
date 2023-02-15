const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utilities/appError");
const catchAsync = require("../utilities/catchAsync");
const sendEmail = require("../utilities/email");

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  if (!name || !email || !password || !passwordConfirm) {
    return next(new AppError("Please fill in all fields", 401));
  }

  const user = await User.findOne({ email: email });

  if (user) {
    return next(
      new AppError("User already exists. Please enter another email", 401)
    );
  }

  if (password !== passwordConfirm) {
    return next(new AppError("Passwords do not match.", 401));
  }

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide an email and password.", 400));
  }

  const user = await User.findOne({ email: email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password.", 401));
  }

  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        role: user.role,
      },
    },
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with that email address.", 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Go to ${resetURL} to reset your password. \nIf you didn't request this email, please ignore.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token (expires in 10 minutes)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token successfully sent!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email, try again later!",
        500
      )
    );
  }
});
