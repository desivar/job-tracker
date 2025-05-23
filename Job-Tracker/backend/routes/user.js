//Imports
const express = require('express');
const router = express.Router();
const userCon = require('../controllers/user');


//GET all users
router.get('/', userCon.getAllUsers);

module.exports = router;