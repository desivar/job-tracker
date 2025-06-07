//Imports
const express = require("express");
const router = express.Router();
const userCon = require("../controllers/user");

//GET all users
router.get("/", userCon.getAllUsers);
router.get("/:id", userCon.getUserById);
router.post("/", userCon.createUser);
router.put("/:id", userCon.updateUser);
router.delete("/:id", userCon.deleteUser);
module.exports = router;
