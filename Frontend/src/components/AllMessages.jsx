import React from "react";
import { useSelector } from "react-redux";
import { BiCheck, BiCheckDouble } from "react-icons/bi";
import FileCard from "./FileCard";

const AllMessages = ({ makeMessageSeen, newFile, setNewFile }) => {
  console.log({ newFile });
  let isThereMessage = false;
  const { myInfo } = useSelector((state) => state.auth);
  const { activeUser, messages, isTyping } = useSelector(
    (state) => state.messanger
  );

  function isCurrentUser(message) {
    return message?.sender == activeUser || message?.receiver == activeUser;
  }

  console.log("messages", messages);
  console.log(isThereMessage);

  return (
    <div className="flex-grow w-full h-5/6 px-4 pt-2">
      <div className="w-full flex h-full flex-col gap-1 p-2 overflow-y-scroll">
        {messages.length > 0 &&
          messages.map((message) => {
            makeMessageSeen(message);
            const condition = isCurrentUser(message);
            if (condition) isThereMessage = true;
            return condition ? (
              <div
                key={message.messageId}
                className={` px-2 py-1 ${
                  message.sender == myInfo.id ? "pb-2" : ""
                } rounded-lg relative flex flex-col items-end ${
                  message.sender === myInfo.id
                    ? "self-end text-white bg-[#0a0e1585]"
                    : "self-start text-[#0a0e1585] bg-white font-bold"
                }`}
              >
                {typeof message.content === "object" ? (
                  <FileCard fileData={message.content} />
                ) : (
                  <p className="pr-2">{message.content}</p>
                )}

                {message.sender == myInfo.id && (
                  <div className="h-3 w-3 rounded-full">
                    {message.status === "sent" ? (
                      <BiCheck className="text-white" />
                    ) : message.status === "delivered" ? (
                      <BiCheckDouble className="text-white" />
                    ) : message.status === "seen" ? (
                      <BiCheckDouble className="text-green-700 font-bold text-lg" />
                    ) : null}
                  </div>
                )}
              </div>
            ) : null;
          })}
        {/* Sending New File  */}
        {newFile && (
          <div
            key={"message.messageId"}
            className={` px-2 py-1 pb-2 self-end text-white bg-[#0a0e1585] rounded-lg relative flex flex-col items-end`}
          >
            <FileCard
              fileData={{ fileName: newFile?.name }}
              currentFile={newFile?.name ? true : false}
              setNewFile={setNewFile}
            />
          </div>
        )}
        {!isThereMessage && (
          <div className="w-full h-full flex justify-center items-center">
            <p className="border-2 rounded-lg border-white px-4 py-2 text-white font-bold">
              No messages to show
            </p>
          </div>
        )}
        {isTyping && (
          <div key={"TypingIndicator"} className={`h-10 inline-block`}>
            <img
              src="/square-loader.gif"
              alt="typing_indicator"
              className="h-full bg-[#0a0e1585] rounded-lg p-1"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllMessages;
