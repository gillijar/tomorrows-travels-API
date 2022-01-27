const express = require("express");
const cors = require("cors");
const attractionRouter = require("./routes/attractionRouter");
const locationRouter = require("./routes/locationRouter");
const restaurantRouter = require("./routes/restaurantRouter");
const userRouter = require("./routes/userRouter");

const AppError = require("./utilities/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/attractions", attractionRouter);
app.use("/api/v1/locations", locationRouter);
app.use("/api/v1/restaurants", restaurantRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
