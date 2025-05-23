const { get } = require("mongoose");
const mongodb = require("../db/database");
const ObjectId = require("mongodb").ObjectId;

const collection_name = "users";

const getAllUsers = async (req, res, next) => {
  try {
    const result = await mongodb
      .getDatabase()
      .db()
      .collection(collection_name)
      .find();
    result.toArray().then((users) => {
      res.setHeader("Content-type", "applications/json");
      res.status(200).json(users);
    });
    if (!result) {
      send.status(400);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers };
