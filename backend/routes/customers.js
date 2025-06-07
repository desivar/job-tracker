//Imports
const express = require("express");
const router = express.Router();
const pipecont = require("../controllers/customers");

//GET all pipelines
router.get("/", pipecont.getAllCustomers);

//GET a single pipeline by ID
router.get("/:id", pipecont.getCustomerById);

router.post("/", pipecont.createCustomer);

router.put("/:id", pipecont.updateCustomer);

router.delete("/:id", pipecont.deleteCustomer);

module.exports = router;
