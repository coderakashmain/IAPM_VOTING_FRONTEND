import React from "react";
import { useNavigate } from "react-router";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white">
      <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-2xl text-center max-w-md">
        <h1 className="text-6xl text-error font-bold text-dangar mb-4">404</h1>
        <h2 className="text-3xl text-white  font-semibold mb-2">Page Not Found</h2>
        <p className="text-white mb-6">
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>
        <button
          onClick={() => navigate("/")}
          className="cursor-pointer bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-2 rounded-full font-medium hover:scale-105 transition-transform duration-200"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
