const express = require("express");
const requestController = require("../controllers/requestController");
const attractionController = require("../controllers/attractionController");
const restaurantController = require("../controllers/restaurantController");

const router = express.Router();

router.route("/").get(requestController.getRequests);

router.route("/attraction").post(attractionController.createAttraction);

router.route("/restaurant").post(restaurantController.createRestaurant);

module.exports = router;
