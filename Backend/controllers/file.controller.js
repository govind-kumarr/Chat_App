const { initializeS3, bucket, uploadObject } = require("../aws/s3");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const formidable = require("formidable");
const { FileModal } = require("../models/File.modal");
const { MessageModel } = require("../models/Message.model");

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

const uploadFile = async (req, res) => {
  try {
    const form = formidable({});
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.send({
          message: "Error uploading file!",
        });
      }
      console.log(fields);
      console.log(files);

      const { file } = files;
      let { messageData } = fields;
      messageData = JSON.parse(messageData);
      const user = req.user;
      console.log(user);

      if (file) {
        const { newFilename, mimetype, size, originalFilename, filepath } =
          file;
        const key = `${user.id}/${newFilename}`;
        await uploadObject(filepath, key);
        const newFile = new FileModal({
          fileName: originalFilename,
          fileKey: key,
          size,
          fileType: mimetype,
        });
        await newFile.save();
        const { sender, receiver, messageId } = messageData;
        const newMessage = MessageModel({
          messageId,
          sender,
          receiver,
          content: newFile,
          status: "received",
        });
        newMessage.save();
        return res.send(newMessage);
      }
      res.send({
        message: "No file found!",
      });
    });
  } catch (error) {
    console.log(error.message);
    res.send({
      error,
    });
  }
};

const downloadFile = async (req, res) => {
  const { fileName } = req.params;
  const file = await FileModal.findOne({ fileName });
  if (file) {
    const key = file.fileKey;
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
  } else {
    res.status(404);
  }
};

module.exports = {
  getAvatar,
  uploadFile,
  downloadFile,
};
