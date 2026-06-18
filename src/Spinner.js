import React from "react";
import "./Spinner.css";

const Spinner = ({ message = "Loading..." }) => {
  return (
    <div className="spinner-overlay">
      <div className="spinner-box">
        <div className="spinner-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <p className="spinner-message">{message}</p>
      </div>
    </div>
  );
};

export default Spinner;