import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PageHeader from "../PageHeader/PageHeader";
import "./CreateEvent.css";

function CreateEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    date: "",
    time: "",
    venue: "",
    price: "",
    total_seats: "",
    description: "",
  });

  const [image, setImage] = useState(null);

  
  // const email = localStorage.getItem("userEmail");
   const email =
    localStorage.getItem("userEmail") ||
    localStorage.getItem("user_email") ||
    localStorage.getItem("email");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    formDataToSend.append("image", image);
    formDataToSend.append("organizer_email", email);

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/create-event/",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Event Created Successfully 🎉");

      //Redirect based on category
      const categoryPath = formData.category.toLowerCase();

      navigate(`/shows/${categoryPath}`);

    } catch (error) {
      console.error(error);
      alert("Something went wrong ❌");
    }
  };

  return (
    <>
      <PageHeader
        title="Create Event"
        subtitle="Create and manage your event professionally"
      />

      <div className="create-event-container">
        <div className="create-event-card">
          <h2>Create New Event 🎟</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input
                type="text"
                name="title"
                placeholder="Event Title"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Music">Music</option>
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Workshop">Workshop</option>
                <option value="Sports">Sports</option>
              </select>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />

              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="venue"
                placeholder="Venue"
                value={formData.venue}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="price"
                placeholder="Ticket Price"
                value={formData.price}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="total_seats"
                placeholder="Total Seats"
                value={formData.total_seats}
                onChange={handleChange}
                required
              />

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </div>

            <textarea
              name="description"
              placeholder="Event Description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            ></textarea>

            <button type="submit" className="create-btn">
              Create Event 
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateEvent;