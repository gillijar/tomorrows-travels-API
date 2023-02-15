const express = require("express");
const restaurantController = require("../controllers/restaurantController");
const requestController = require("../controllers/requestController");

const router = express.Router();

router
  .route("/")
  .get(restaurantController.getAllRestaurants)
  .post(requestController.createRequest);

router.route("/:id").get(restaurantController.getRestaurant);

module.exports = router;
