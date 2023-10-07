const mongoose = require("mongoose");
require("dotenv").config();

const connectToDb = async (cb) => {
  try {
    const MONGO_URL = process.env.MONGO_URL;
    const db = await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");
    cb();
    return db;
  } catch (error) {
    console.log("ERROR: WHILE CONNECTING TO MONGO: " + error);
  }
};

module.exports = {
  connectToDb,
};
