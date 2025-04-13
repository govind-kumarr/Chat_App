const Yup = require("yup");

// Reshape it
const createGroupSchema = Yup.object().shape({
  participants: Yup.array()
    .of(Yup.string())
    .min(1, "At least 2 participants are required")
    .required("Participants are required"),
  name: Yup.string().optional(),
  avatarFileId: Yup.string().optional(),
});

const getGroupMembersSchema = Yup.object().shape({
  chatId: Yup.string(),
});
module.exports = {
  createGroupSchema,
  getGroupMembersSchema,
};
