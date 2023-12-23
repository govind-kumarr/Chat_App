const { default: mongoose } = require("mongoose");

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  valid: {type: Boolean, default: true}
})

const SessionModel = mongoose.model("sessions",sessionSchema)

module.exports = {
  SessionModel
}
