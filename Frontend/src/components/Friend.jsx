import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveUser } from "../store/messanger/messanger";

const Friend = ({
  data,
  isActive,
  setCurrentFriend,
  socketId,
  setCurrentUser,
}) => {
  const { _id, username, image } = data;
  const { activeUser } = useSelector((state) => state.messanger);
  const dispatch = useDispatch();

  return (
    <div
      className={`flex w-full space-x-2 items-center px-4 py-1 border-2 rounded-lg cursor-pointer ${
        activeUser == _id ? "bg-[#0a0e1585]" : ""
      }`}
      onClick={() => {
        setCurrentFriend(socketId);
        setCurrentUser(_id);
        dispatch(setActiveUser(_id));
      }}
    >
      {/* avatar */}
      <div className="w-14 h-14 relative">
        <img
          src={image}
          alt={username}
          className="w-full h-full rounded-full"
        />
        <p
          className={`w-3 h-3 rounded-full absolute bottom-0 right-0 ${
            isActive ? "bg-green-500" : "bg-gray-400"
          }`}
        ></p>
      </div>
      {/* userInfo  */}
      <div>
        <p className={`text-xl text-white`}>{username}</p>
      </div>
    </div>
  );
};

export default Friend;
