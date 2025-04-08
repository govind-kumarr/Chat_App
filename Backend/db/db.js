const mongoose = require("mongoose");
const { loadEnv } = require("../config");
const config = loadEnv();

const connectToDb = async () => {
  try {
    const db = await mongoose.connect(config.mongodbUrl);
    console.log("Connected to MongoDB");
    return db;
  } catch (error) {
    console.log("ERROR: WHILE CONNECTING TO MONGO: " + error);
  }
};

module.exports = {
  connectToDb,
};
