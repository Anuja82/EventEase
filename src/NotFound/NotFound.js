import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "EventEase | Page Not Found";
  }, []);

  return (
    <div className="notfound-wrapper">
      <div className="notfound-content">
        <h1 className="notfound-code">404</h1>
        <h2 className="notfound-title">Page Not Found</h2>
        <p className="notfound-desc">
          Looks like this page doesn't exist or was moved.
        </p>
        <button className="notfound-btn" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;