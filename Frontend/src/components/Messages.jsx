import React, { useState } from "react";
import TypingBox from "./TypingBox";
import AllMessages from "./AllMessages";

const Messages = ({
  addMessage,
  makeMessageSeen,
  sendTypingIndication,
  stoppedTyping,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <div className="w-full h-full flex flex-col">
      <AllMessages
        makeMessageSeen={makeMessageSeen}
        newFile={selectedFile}
        setNewFile={setSelectedFile}
      />
      <TypingBox
        addMessage={addMessage}
        sendTypingIndication={sendTypingIndication}
        stoppedTyping={stoppedTyping}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
      />
    </div>
  );
};

export default Messages;
