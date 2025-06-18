// db/database.js

const { MongoClient } = require('mongodb');
require('dotenv').config();

let _db;

const connectDB = async () => {
  if (_db) {
    console.log('MongoDB already connected.');
    return _db;
  }

  const uri = process.env.MONGODB_URL;
  if (!uri) throw new Error('MONGODB_URL is not defined.');

  const client = new MongoClient(url);
  await client.connect();
  _db = client;
  console.log('MongoDB connected.');
  return _db;
};

module.exports = connectDB;
