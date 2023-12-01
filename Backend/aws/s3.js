const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
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

const uploadObject = async (filePath, fileKey) => {
  const readStream = fs.createReadStream(filePath);
  const client = initializeS3();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: fileKey,
    Body: readStream
  });
  const response = await client.send(command);
  console.log(response);
};

module.exports = {
  initializeS3,
  bucket,
  uploadObject,
};
