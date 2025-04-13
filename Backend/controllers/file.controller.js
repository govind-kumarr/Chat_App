const aws = require("../aws");
const {
  createFile,
  updateUploadStatus,
  isFileOwner,
  deleteFileObj,
} = require("../services/file.services");
const { getStorageKey, parseObjectId } = require("../utils");

const uploadUrl = async (req, res) => {
  try {
    const { type, mimeType } = req.body;
    const user = req.locals.user;
    const userId = user.id;
    const file = await createFile({ ...req.body, userId });
    const key = getStorageKey({
      type: type === "avatar" ? "user-data" : "chat-data",
      fileId: parseObjectId(file._id),
      userId,
    });
    file.storageKey = key;
    const url = await aws.generateUploadUrl(key, { mimeType });
    await file.save();
    res.status(200).json({
      message: "Successfully generated upload url!",
      url,
      fileId: file?._id,
    });
  } catch (error) {
    res.status(400).json({ message: error.message || "Something went wrong" });
  }
};

const saveFile = async (req, res) => {
  try {
    const { fileId } = req.body;
    await updateUploadStatus(fileId);
    res.status(200).json({
      message: "Successfully updated file!",
    });
  } catch (error) {
    res.status(400).json({ message: error.message || "Something went wrong" });
  }
};

const deleteFile = async (req, res) => {
  try {
    const userId = req.locals?.user?.id;
    const { fileId } = req.body;
    let file = await isFileOwner(fileId, userId);
    await aws.deleteFile(file.storageKey);
    await deleteFileObj(file?._id);
    res.status(200).json({
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error(`Error deleting file: ${error?.message}`);
    res.status(400).json({ message: error?.message || "Something went wrong" });
  }
};

module.exports = {
  uploadUrl,
  saveFile,
  deleteFile,
};
