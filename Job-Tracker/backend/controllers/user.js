const mongodb = require("../db/database");
const ObjectId = require("mongodb").ObjectId;

const collection_name = "users";

const getAllUsers = async (req, res, next) => {
  try {
    const users = await mongodb
      .getDatabase()
      .db()
      .collection(collection_name)
      .find()
      .toArray();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers };
