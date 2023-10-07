const { S3Client } = require("@aws-sdk/client-s3");
require("dotenv").config();

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.S3_REGION;
const bucket = process.env.S3_BUCKET;

const initializeS3 = () => {
  try {
    const s3_client = new S3Client({
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      region,
    });
    return s3_client;
  } catch (error) {
    console.log("Error while initializing client", error);
    throw new Error("Error while initializing client");
  }
};

module.exports = {
  initializeS3,
  bucket,
};
