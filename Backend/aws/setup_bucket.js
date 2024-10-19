const { initializeS3 } = require("./s3");
const {
  HeadBucketCommand,
  CreateBucketCommand,
} = require("@aws-sdk/client-s3");

require("dotenv").config();

const bucketName = process.env.S3_BUCKET;
const client = initializeS3();

const checkBucket = async (bucket) => {
  try {
    const options = {
      Bucket: bucket,
    };

    await client.send(new HeadBucketCommand(options));
    return true;
  } catch (error) {
    if (error["$metadata"].httpStatusCode > 400) return false;
    return error;
  }
};

const setupBucket = async (bucketName) => {
  try {
    const bucket = await checkBucket(bucketName);
    if (!bucket) {
      const createBucket = new CreateBucketCommand({
        Bucket: bucketName,
      });
      const response = await client.send(createBucket);
      console.log("Bucket create", response);
      return;
    }
    console.log("Bucket exist", { bucketName });
  } catch (error) {
    console.log(error);
  }
};

setupBucket(bucketName);
