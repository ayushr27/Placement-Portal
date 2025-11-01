import React from "react";

const ProfileCard = ({ profName }) => {
  return (
    <div className="flex flex-wrap items-center justify-between p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
      <div className="flex flex-wrap items-center space-x-4">
        <div className="w-20 h-20 rounded-full border-4 border-green-500 ">
          <img
            src="/avatar.png"
            alt="Avatar"
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        <div>
          <h2 className="text-xl font-medium text-gray-900">{profName}</h2>
        </div>
      </div>

      <button className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition">
        Edit Profile
      </button>
    </div>
  );
};

export default ProfileCard;
