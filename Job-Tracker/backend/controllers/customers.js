
const mongodb = require("../db/database");
const ObjectId = require("mongodb").ObjectId;

const collection_name = "customers";

const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await mongodb
      .getDatabase()
      .db()
      .collection(collection_name)
      .find()
      .toArray();
    res.status(200).json(customers);
  } catch (error) {
    next(error);
  }
};

const getCustomerById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const customer = await mongodb
      .getDatabase()
      .db()
      .collection(collection_name)
      .findOne({ _id: new ObjectId(id) });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllCustomers, getCustomerById };
