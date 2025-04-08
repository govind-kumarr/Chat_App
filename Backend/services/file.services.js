const aws = require("../aws");
const { FileModel } = require("../models/File.modal");
const { oneWeekAhead } = require("../utils");

const createFile = async (fileObj) => {
  try {
    const { fileName, size, type, mimeType, userId } = fileObj;
    const file = new FileModel({
      originalFileName: fileName,
      size,
      type,
      mimeType,
      userId,
    });
    await file.save();
    return file;
  } catch (error) {
    console.log(`Error creating file ${error?.message}`);
  }
};

const updateUploadStatus = async (fileId) => {
  try {
    const file = await FileModel.findById(fileId).populate("userId");
    if (file && !file.uploaded) {
      const user = file.userId;
      console.log({ file, user });

      file.uploaded = true;
      file.uploadedAt = new Date();
      file.url = await aws.getPreSignedUrl(file.storageKey);
      file.urlExpiry = oneWeekAhead();
      await file?.save();

      if (file.type === "avatar" && user) {
        user.avatar = {
          key: file.storageKey,
          url: file.url,
          urlExpiry: file.urlExpiry,
        };
        await user?.save();
      }
    }
  } catch (error) {
    console.log(`Error updating upload status ${error?.message}`);
  }
};

module.exports = {
  createFile,
  updateUploadStatus,
};
