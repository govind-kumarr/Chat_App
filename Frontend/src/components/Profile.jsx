import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/auth/auth";

const Profile = ({ data }) => {
  const { image, username, email, id } = data;
  const dispatch = useDispatch();
  return (
    <div className="w-full flex flex-col items-center space-y-2">
      {/* Profile Pic  */}
      <div className="w-24 h-24">
        <img
          src={image}
          alt={"profile_pic"}
          className="w-full h-full rounded-full"
        />
      </div>
      {/* user details  */}
      <div className="flex flex-col space-x-2 justify-center items-center">
        <p className="text-white">{username}</p>
        <p className="text-white">{email}</p>
      </div>
      {/* logout button  */}
      <div>
        <button
          className="capitalize border-2 rounded-lg border-white px-4 py-2 text-white font-bold hover:bg-white hover:text-[#0a0e1585] hover:cursor-pointer"
          onClick={() => dispatch(logoutUser())}
        >
          logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
