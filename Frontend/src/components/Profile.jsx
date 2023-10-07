import React from "react";

const Profile = ({ data }) => {
  const { image, username, email, id } = data;
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
    </div>
  );
};

export default Profile;
