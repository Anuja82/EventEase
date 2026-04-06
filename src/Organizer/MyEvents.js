import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyEvents.css";
import PageHeader from "../PageHeader/PageHeader";

const MyEvents = () => {

  const [events, setEvents] = useState([]);
  const [editEventId, setEditEventId] = useState(null);
  const [editData, setEditData] = useState({});

  
  
   const email =
    localStorage.getItem("userEmail") ||
    localStorage.getItem("user_email") ||
    localStorage.getItem("email");

  useEffect(() => {
    if (email) {
      fetchMyEvents();
    }
  }, []);

  const fetchMyEvents = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/organizer-events/?email=${email}`
      );
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/delete-event/${id}/`
      );
      fetchMyEvents();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  // Start Editing
  const handleEditClick = (event) => {
    setEditEventId(event.id);
    setEditData({
      title: event.title,
      date: event.date,
      venue: event.venue,
      status: event.status
    });
  };

  // Handle Input Change
  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  // Save Update
  const handleUpdate = async (id) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/update-event/${id}/`,
        editData
      );

      setEditEventId(null);
      fetchMyEvents();
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <>
      <PageHeader
        title="My Events"
        subtitle="Create and manage your events professionally"
      />

      <div className="my-events-container">
        {/* <h2 className="my-events-title">My Events</h2> */}

        <div className="my-events-grid">
          {events.length > 0 ? (
            events.map((event) => (
              <div className="event-card" key={event.id}>

                <img
                  src={
                    event.image
                      ? `http://127.0.0.1:8000${event.image}`
                      : "/default-event.jpg"
                  }
                  alt={event.title}
                />

                <div className="event-info">

                  {editEventId === event.id ? (
                    <>
                      <input
                        type="text"
                        name="title"
                        value={editData.title}
                        onChange={handleChange}
                        className="edit-input"
                      />

                      <input
                        type="date"
                        name="date"
                        value={editData.date}
                        onChange={handleChange}
                        className="edit-input"
                      />

                      <input
                        type="text"
                        name="venue"
                        value={editData.venue}
                        onChange={handleChange}
                        className="edit-input"
                      />

                      <select
                        name="status"
                        value={editData.status}
                        onChange={handleChange}
                        className="edit-input"
                      >
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                      </select>

                      <div className="event-actions">
                        <button
                          className="update-btn"
                          onClick={() => handleUpdate(event.id)}
                        >
                          Save
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => setEditEventId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3>{event.title}</h3>
                      <p><strong>Date:</strong> {event.date}</p>
                      <p><strong>Venue:</strong> {event.venue}</p>
                      <p><strong>Status:</strong> {event.status}</p>

                      <div className="event-actions">
                        <button
                          className="update-btn"
                          onClick={() => handleEditClick(event)}
                        >
                          Update
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(event.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}

                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "white" }}>No events created yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default MyEvents;