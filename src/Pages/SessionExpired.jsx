import React from "react";
import { useNavigate } from "react-router";


const SessionExpired = () => {

  const navigate = useNavigate();
  return (
    <div className=" bg-bg">
      <div className="container flex flex-col items-center justify-center min-h-screen ">

        <div className="bg-white p-8 rounded-2xl shadow-md sm:shadow-2xl text-center max-w-md">

          <h1 className="text-3xl font-semibold mt-4 mb-2">Session Expired</h1>
          <p className="text-gray-400 mb-6">
            Your session has expired for security reasons.
            Please log in again to continue.
          </p>
          <button
            onClick={() => navigate("/")}
            className="cursor-pointer bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-2 rounded-full font-medium hover:scale-105 transition-transform duration-200"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionExpired;
