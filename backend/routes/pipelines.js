//Imports
const express = require("express");
const router = express.Router();
const {
  createPipeline,
  getPipelines,
  getPipeline,
  updatePipeline,
  deletePipeline,
} = require("../controllers/pipelines");




//GET all pipelines
router.route("/").post(createPipeline).get(getPipelines);

//GET a single pipeline by ID
router
  .route("/:id")
  .get(getPipeline)
  .put(updatePipeline)
  .delete(deletePipeline);

module.exports = router;
