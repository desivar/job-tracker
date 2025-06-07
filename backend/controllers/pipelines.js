
const mongodb = require("../db/database");
const ObjectId = require("mongodb").ObjectId;

const collection_name = "pipelines";

const getAllPipelines = async (req, res, next) => {
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


const getPipelineById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const pipeline = await mongodb
      .getDatabase()
      .db()
      .collection(collection_name)
      .findOne({ _id: new ObjectId(id) });
    if (!pipeline) {
      return res.status(404).json({ message: "Pipeline not found" });
    }
    res.status(200).json(pipeline);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllPipelines, getPipelineById };
