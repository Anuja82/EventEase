import React, { useState } from "react";
import axios from "axios";
import PageHeader from "../PageHeader/PageHeader";
import "./OrganizerProfile.css";

const OrganizerProfile = () => {

  const email = localStorage.getItem("user_email");
  const storedUsername = localStorage.getItem("username");

  const [formData, setFormData] = useState({
    username: storedUsername || "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Update Profile
  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        "http://127.0.0.1:8000/api/update-profile/",
        {
          email: email,
          username: formData.username,
          password: formData.password
        }
      );

      setMessage(res.data.message);
      localStorage.setItem("username", formData.username);
      setFormData({ ...formData, password: "" });

    } catch (error) {
      console.error(error);
      setMessage("Profile update failed");
    }
  };

  //  Request Account Deletion
  const handleDeletionRequest = async () => {
    if (!window.confirm("Are you sure you want to request account deletion?"))
      return;

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/request-deletion/",
        { email: email }
      );

      setMessage(res.data.message);

    } catch (error) {
      console.error(error);
      setMessage("Deletion request failed");
    }
  };

  return (
    <>
      <PageHeader
        title="My Profile"
        subtitle="Manage your organizer account settings"
      />

      <div className="profile-container">
        <div className="profile-card">

          <h2 className="profile-heading">Edit Profile</h2>

          <label>Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="profile-input disabled-input"
          />

          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="profile-input"
          />

          <label>New Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Leave blank if no change"
            className="profile-input"
          />

          <div className="button-group">
            <button
              className="theme-btn"
              onClick={handleUpdate}
            >
              Update Profile
            </button>

            <button
              className="theme-btn outline-btn"
              onClick={handleDeletionRequest}
            >
              Request Deletion
            </button>
          </div>

          {message && <p className="message-text">{message}</p>}

        </div>
      </div>
    </>
  );
};

export default OrganizerProfile;