const { default: mongoose } = require("mongoose");

const FileSchema = new mongoose.Schema(
  {
    originalFileName: {
      type: String,
    },
    type: {
      type: String,
    },
    mimeType: {
      type: String,
    },
    size: {
      type: Number,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "users",
    },
    url: {
      type: String,
    },
    storageKey: {
      type: String,
    },
  },
  { timestamps: true }
);

FileSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    return ret;
  },
});

const FileModel = mongoose.model("files", FileSchema);

module.exports = { FileModel };
