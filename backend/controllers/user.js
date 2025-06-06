
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

const getUserById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await mongodb
      .getDatabase()
      .db()
      .collection(collection_name)
      .findOne({ _id: new ObjectId(id) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const user = {
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
      preferences: req.body.preferences || {}
    };
    const result = await mongodb
      .getDatabase()
      .db()
      .collection(collection_name)
      .insertOne(user);
    res.status(201).json({ id: result.insertedId });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = {
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
      preferences: req.body.preferences || {}
    };
    const result = await mongodb
      .getDatabase()
      .db()
      .collection(collection_name)
      .updateOne({ _id: new ObjectId(id) }, { $set: user });
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated" });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await mongodb
      .getDatabase()
      .db()
      .collection(collection_name)
      .deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
};
