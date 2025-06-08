// Imports
const express = require("express");
const router = express.Router();
// Corrected import: Import the customer controller functions
const customerCont = require("../controllers/customers"); 

// GET all customers
router.get("/", customerCont.getAllCustomers);

// GET a single customer by ID
router.get("/:id", customerCont.getCustomerById);

// POST create a new customer
router.post("/", customerCont.createCustomer);

// PUT update an existing customer by ID
router.put("/:id", customerCont.updateCustomer);

// DELETE a customer by ID
router.delete("/:id", customerCont.deleteCustomer);

module.exports = router;
