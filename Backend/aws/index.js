const {
  CreateBucketCommand,
  S3Client,
  ListBucketsCommand,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { loadEnv } = require("../config");

const config = loadEnv();

class AWS_Setup {
  constructor() {
    this.accessKeyId = config.accessKeyId;
    this.secretAccessKey = config.secretAccessKey;
    this.region = config.region;
    this.bucket = config.bucket;
    this.client = new S3Client({
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      region: config.region,
    });
  }

  async checkBucket(bucketName) {
    try {
      const client = this.client;
      const listBucketCommand = new ListBucketsCommand({});
      const { Buckets = [] } = await client.send(listBucketCommand);
      return Buckets?.includes(bucketName);
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async setupBucket() {
    try {
      const bucketName = this.bucket;
      const client = this.client;
      const bucket = await this.checkBucket(bucketName);
      if (!bucket) {
        const createBucket = new CreateBucketCommand({
          Bucket: bucketName,
        });
        const response = await client.send(createBucket);
        console.log(`Bucket: ${bucketName} created`);
        return;
      }
      console.log(`Bucket: ${bucketName} already exist`);
    } catch (error) {
      console.log("Error setting up buckets", error);
    }
  }

  async setupDir(dirName) {
    try {
      const client = this.client;
      const bucketName = this.bucket;
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: `${dirName}/`,
        Body: "",
      });
      const response = await client.send(command);
    } catch (error) {
      console.log("Error setting up dirs", error);
    }
  }

  async getPreSignedUrl(key) {
    if (!key) throw new Error(`Object Unique Key is missing!`);
    const bucket = this.bucket;
    const client = this.client;
    const options = {
      Bucket: bucket,
      Key: key,
    };
    const command = new GetObjectCommand(options);
    const url = await getSignedUrl(client, command, {
      expiresIn: 7 * 24 * 60 * 60,
    });
    return url;
  }

  async generateUploadUrl(key, options = {}) {
    if (!key) throw new Error(`Object Unique Key is missing!`);

    const bucket = this.bucket;
    const client = this.client;
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: options?.mimeType,
    });
    const url = await getSignedUrl(client, command, {
      expiresIn: 60 * 60,
    });
    return url;
  }

  async deleteFile(key) {
    if (!key) throw new Error(`Object Unique Key is missing!`);

    const bucket = this.bucket;
    const client = this.client;
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    await client.send(command);
    return "Delete file from S3";
  }
}

const aws = new AWS_Setup();

module.exports = aws;
