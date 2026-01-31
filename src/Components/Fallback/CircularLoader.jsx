import React from "react";
import "./CircularLoader.css";

const CircularLoader = ({ size = 50, color = "var(--color-primary)" }) => {
  return (
    <div
      className="circular-loader"
      style={{
        width: size,
        height: size,
        borderColor: `${color} transparent ${color} transparent`,
      }}
    ></div>
  );
};

export default CircularLoader;
