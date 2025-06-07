
const mongodb = require("../db/database");
const ObjectId = require("mongodb").ObjectId;

const collection_name = "jobs";

const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await mongodb
      .getDatabase()
      .db()
      .collection(collection_name)
      .find()
      .toArray();
    res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
};

const getJobById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const job = await mongodb
      .getDatabase()
      .db()
      .collection(collection_name)
      .findOne({ _id: new ObjectId(id) });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllJobs, getJobById };
