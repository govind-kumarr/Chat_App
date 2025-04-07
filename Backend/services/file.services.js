const { FileModel } = require("../models/File.modal");

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
    console.log();
  }
};

module.exports = {
  createFile,
};
