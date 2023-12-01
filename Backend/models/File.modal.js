const { default: mongoose } = require("mongoose");


const fileSchema = mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  fileKey: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: new Date(),
  },
  size: {
    type: Number,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
});

const FileModal = mongoose.model("files", fileSchema);

module.exports = {
  FileModal,
};
