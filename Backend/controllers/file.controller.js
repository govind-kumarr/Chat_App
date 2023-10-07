const { initializeS3, bucket } = require("../aws/s3");
const { GetObjectCommand } = require("@aws-sdk/client-s3");

const getAvatar = async (req, res) => {
  try {
    const key = req.params[0];
    const input = {
      Bucket: bucket,
      Key: key,
    };
    const command = new GetObjectCommand(input);
    const s3 = initializeS3();
    const data = await s3.send(command);
    res.setHeader("Content-Disposition", `attachment; filename="${key}"`);
    res.setHeader("Content-Type", data.ContentType);
    data.Body.pipe(res);
  } catch (error) {
    console.log(error);
    res.json({
      message: "something went wrong!",
    });
  }
};

module.exports = {
  getAvatar,
};
