import React, { useState } from "react";
import TypingBox from "./TypingBox";
import AllMessages from "./AllMessages";

const Messages = ({
  addMessage,
  makeMessageSeen,
  sendTypingIndication,
  stoppedTyping,
}) => {
  return (
    <div className="w-full h-full flex flex-col">
      <AllMessages makeMessageSeen={makeMessageSeen} />
      <TypingBox
        addMessage={addMessage}
        sendTypingIndication={sendTypingIndication}
        stoppedTyping={stoppedTyping}
      />
    </div>
  );
};

export default Messages;
