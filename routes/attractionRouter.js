const express = require("express");
const attractionController = require("../controllers/attractionController");
const requestController = require("../controllers/requestController");

const router = express.Router();

router
  .route("/")
  .get(attractionController.getAllAttractions)
  .post(requestController.createRequest);

router
  .route("/:id")
  .get(attractionController.getAttraction)
  .patch(attractionController.updateAttraction)
  .delete(attractionController.deleteAttraction);

module.exports = router;
