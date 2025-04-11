const Yup = require("yup");

// Reshape it
const createGroupSchema = Yup.object().shape({
  participants: Yup.array(),
  name: Yup.string(),
  avatar: Yup.string(),
});

module.exports = {
  createGroupSchema,
};
