const { MessageModel } = require("../models/Message.model");

const saveMessageCont = async (req, res) => {
  try {
    console.log({ headers: req.headers });
    console.log({ body: req.body });
    const {
      messageId,
      sender,
      receiver,
      socketId,
      senderSocketId,
      status,
      content,
    } = req.body;
    const newMessage = {
      messageId,
      sender,
      receiver,
      socketId,
      senderSocketId,
      status,
      content,
    };
    await MessageModel.insertMany([newMessage]);
    res
      .send({
        message: "Message created successfully",
      })
      .status(201);
  } catch (error) {
    console.log(error);
    res
      .send({
        error: "Something went wrong",
      })
      .status(500);
  }
};

const getAllMessages = async (req, res) => {
  try {
    console.log({ headers: req.headers });
    const messages = await MessageModel.find({}).sort("-createdAt");
    res.send(messages);
  } catch (error) {
    console.log(error);
    res.send({
      message: "Something went wrong",
    });
  }
};

module.exports = {
  saveMessageCont,
  getAllMessages,
};
