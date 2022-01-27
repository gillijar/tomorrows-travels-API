const express = require("express");
const attractionController = require("../controllers/attractionController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(attractionController.getAllAttractions)
  .post(attractionController.createAttraction);

router
  .route("/:id")
  .get(attractionController.getAttraction)
  .patch(attractionController.updateAttraction)
  .delete(attractionController.deleteAttraction);

module.exports = router;
