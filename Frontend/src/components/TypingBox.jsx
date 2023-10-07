import React, { useState } from "react";
import { BiSolidSend } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { addNewMessage } from "../store/messanger/messanger";

const TypingBox = ({ addMessage, sendTypingIndication, stoppedTyping }) => {
  const [text, setText] = useState("");
  const { myInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleTextChange = (e) => {
    setText(e.target.value);
  };
  const handleSubmit = () => {
    //Send Message to reciever
    addMessage({ content: text, sender: myInfo.id });
    setText("");
  };
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
      e.preventDefault();
    }
  };
  return (
    <div className="flex-none h-1/6 w-full self-end flex items-center space-x-4 justify-center border-t-2">
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="Type your message here..."
        onKeyDown={handleKeyDown}
        className="w-5/6 resize-none h-5/6 bg-[#0a0e1585] outline-none rounded-lg px-2 py-1 text-lg text-white"
        onFocus={sendTypingIndication}
        onBlur={stoppedTyping}
      ></textarea>
      <div>
        {/* Send Icon  */}
        <div onClick={handleSubmit}>
          <BiSolidSend className="text-white text-3xl" />
        </div>
      </div>
    </div>
  );
};

export default TypingBox;
