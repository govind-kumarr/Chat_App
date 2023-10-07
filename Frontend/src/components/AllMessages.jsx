import React from "react";
import { useSelector } from "react-redux";
import { BiCheck, BiCheckDouble } from "react-icons/bi";

const AllMessages = ({ makeMessageSeen }) => {
  const { myInfo } = useSelector((state) => state.auth);
  const { activeUser, messages, isTyping } = useSelector(
    (state) => state.messanger
  );

  function isCurrentUser(message) {
    return message?.sender == activeUser || message?.receiver == activeUser;
  }

  console.log("messages", messages);

  return (
    <div className="flex-grow w-full h-5/6 px-4 pt-2">
      <div className="w-full flex h-full flex-col gap-1 p-2 overflow-y-scroll">
        {messages.length > 0 &&
          messages.map((message) => {
            makeMessageSeen(message);
            return isCurrentUser(message) ? (
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
                <p className="pr-2">{message.content}</p>
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
