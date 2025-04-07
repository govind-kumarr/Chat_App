const yup = require("yup");

const fileSchema = yup.object({
  fileName: yup.string().required("File name is required"),
  size: yup
    .number()
    .positive("Size must be a positive number")
    .required("Size is required"),
  type: yup.string().required("Type is required"),
  mimeType: yup.string().required("Mime type is required"),
});

module.exports = {
  fileSchema,
};
