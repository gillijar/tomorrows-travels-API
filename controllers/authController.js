const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utilities/appError");
const catchAsync = require("../utilities/catchAsync");
const sendEmail = require("../utilities/email");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

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

  createSendToken(newUser, 201, res);
  // const token = signToken(newUser._id);

  // res.status(201).json({
  //   status: "success",
  //   token,
  //   data: {
  //     user: newUser,
  //   },
  // });
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

  createSendToken(user, 200, res);
  // const token = signToken(user._id);
  // res.status(200).json({
  //   status: "success",
  //   token,
  //   user: {
  //     name: user.name,
  //     email: user.email,
  //     id: user.id,
  //   },
  // });
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
