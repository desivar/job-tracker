//Imports
const express = require("express");
const router = express.Router();
const pipecont = require("../controllers/customers");

//GET all pipelines
router.get("/", pipecont.getAllCustomers);

//GET a single pipeline by ID
router.get("/:id", pipecont.getCustomerById);

module.exports = router;
