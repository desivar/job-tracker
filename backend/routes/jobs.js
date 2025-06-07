//Imports
const express = require("express");
const router = express.Router();
const pipecont = require("../controllers/jobs");

//GET all pipelines
router.get("/", pipecont.getAllJobs);

//GET a single pipeline by ID
router.get("/:id", pipecont.getJobById);

router.post("/", pipecont.createJob);
router.put("/:id", pipecont.updateJob);
router.delete("/:id", pipecont.deleteJob);

module.exports = router;
