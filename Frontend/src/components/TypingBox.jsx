import React, { useState, useRef, useEffect } from "react";
import { BiSolidSend } from "react-icons/bi";
import { AiOutlineFileText } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { axios } from "./../config/axiosConfig.js";
import { getUniqueId } from "../utils/utils.js";

const TypingBox = ({
  addMessage,
  sendTypingIndication,
  stoppedTyping,
  setNewFile,
  selectedFile,
  setSelectedFile,
}) => {
  const [text, setText] = useState("");
  const { myInfo } = useSelector((state) => state.auth);
  const { activeUser } = useSelector((state) => state.messanger);
  const fileRef = useRef(null);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };
  const handleSubmit = () => {
    if (text) {
      //Send Message to reciever
      addMessage({ content: text, sender: myInfo.id });
      setText("");
    }
    if (selectedFile) {
      handleUpload();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
      e.preventDefault();
    }
  };

  function handleFileChange(e) {
    setSelectedFile(e.target.files[0]);
  }

  async function handleUpload() {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append(
      "messageData",
      JSON.stringify({
        sender: myInfo.id,
        receiver: activeUser,
        messageId: getUniqueId(),
      })
    );

    const uploadResponse = await axios.post("/api/file/upload", formData);
    console.log(uploadResponse);
  }

  useEffect(() => {
    console.log(fileRef);
  }, []);

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
      <div className="h-full">
        <div className="h-full flex flex-col justify-center gap-4">
          {/* Send Icon  */}
          <div onClick={handleSubmit} className="cursor-pointer">
            <BiSolidSend className="text-white text-3xl" />
          </div>
          {/* file send icon */}
          <input
            type="file"
            name=""
            id=""
            className="hidden"
            ref={fileRef}
            onChange={handleFileChange}
          />
          <div
            className="cursor-pointer"
            onClick={() => fileRef?.current?.click()}
          >
            <AiOutlineFileText className="text-white text-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingBox;
