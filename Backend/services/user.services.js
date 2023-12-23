const { RegisterModel } = require("../models/Register.model")

const updateElseInsertUser = async (query,data) => {
  return await RegisterModel.findOneAndUpdate(query,data,{upsert: true,new: true})
}

module.exports = {
  updateElseInsertUser
}
