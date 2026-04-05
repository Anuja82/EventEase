import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageEvents.css";
import PageHeader from "../PageHeader/PageHeader";

function ManageEvents() {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    date: "",
    price: "",
    venue: ""
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    setLoading(true);

    axios
      .get("http://127.0.0.1:8000/api/admin-events/")
      .then((res) => setEvents(res.data))
      .catch((err) => console.log("ERROR:", err))
      .finally(() => setLoading(false));
  };

  // Approve
  const handleApprove = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/approve-event/${id}/`);
      fetchEvents();
    } catch (err) {
      console.log(err);
    }
  };

  //  Reject
  const handleReject = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/reject-event/${id}/`);
      fetchEvents();
    } catch (err) {
      console.log(err);
    }
  };

  // OPEN MODAL
  const handleEdit = (event) => {
    setSelectedEvent(event);

    setFormData({
      title: event.title || "",
      category: event.category || "",
      date: event.date || "",
      price: event.price || "",
      venue: event.venue || ""
    });

    setShowModal(true);
  };

  //  HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  //  UPDATE EVENT
 const handleUpdate = async () => {
  try {
    const form = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        form.append(key, formData[key]);
      }
    });

    await axios.put(
      `http://127.0.0.1:8000/api/update-event/${selectedEvent.id}/`,
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    setShowModal(false);
    fetchEvents();

  } catch (error) {
    console.log(error);
    alert("Update failed");
  }
};
const handleDeleteEvent = async (id) => {
  if (!window.confirm("Are you sure you want to delete this event?")) return;

  try {
    await axios.delete(
      `http://127.0.0.1:8000/api/delete-event/${id}/`
    );

    setShowModal(false);
    fetchEvents();

  } catch (error) {
    console.log(error);
    alert("Delete failed");
  }
};
  return (
    <>
      <PageHeader
        title="Manage Events"
        subtitle="Approve, reject and manage platform events"
      />

      <div className="manage-events">

        <div className="events-container">

          <div className="top-bar">
            <h2>All Events</h2>
          </div>

          {loading ? (
            <p className="loading">Loading events...</p>
          ) : (
            <table className="events-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Price</th>
                  <th>Organizer</th>
                  <th>Status</th>
                  <th>Approval</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {events.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="no-data">
                      No events found
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (

                    <tr key={event.id}>

                      <td>{event.id}</td>
                      <td>{event.title}</td>
                      <td>{event.category}</td>
                      <td>{event.date}</td>
                      <td>₹{event.price}</td>
                      <td>{event.organizer_name}</td>

                      <td>
                        <span className={`status ${event.status === "Active" ? "active" : "pending"}`}>
                          {event.status}
                        </span>
                      </td>

                      <td>
                        <span className={event.is_approved ? "approved" : "pending"}>
                          {event.is_approved ? "Approved" : "Pending"}
                        </span>
                      </td>

                      <td>

                        {!event.is_approved && (
                          <>
                            <button
                              className="approve-btn"
                              onClick={() => handleApprove(event.id)}
                            >
                              Approve
                            </button>

                            <button
                              className="reject-btn"
                              onClick={() => handleReject(event.id)}
                            >
                              Reject
                            </button>
                            
                          </>
                        )}

                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(event)}
                        >
                          Edit
                        </button>
                      

                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                           Delete
                        </button>

                      </td>

                    </tr>

                  ))
                )}

              </tbody>

            </table>
          )}

        </div>

      </div>

      {/* MODAL */}
        {showModal && (
          <div
            className="event-modal-overlay"
            onClick={() => setShowModal(false)}
          >
          <div
            className="event-modal"
            onClick={(e) => e.stopPropagation()}
          >

          <h2>Edit Event</h2>

          <div className="modal-form">

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Event Title"
        />

        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />

        <input
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          placeholder="Venue"
        />

        <input
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
        />

        {/* IMAGE UPLOAD */}
        <input
          type="file"
          name="image"
          onChange={(e) =>
            setFormData({
              ...formData,
              image: e.target.files[0]
            })
          }
        />

        {/* IMAGE PREVIEW */}
        {selectedEvent?.image && (
          <img
            src={`http://127.0.0.1:8000${selectedEvent.image}`}
            alt="event"
            className="modal-image-preview"
          />
        )}

      </div>

      <div className="modal-actions">

        <button
          className="save-btn"
          onClick={handleUpdate}
        >
          Save Changes
        </button>

       

        <button
          className="closing-btn"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>

      </div>

    </div>
  </div>
)}

    </>
  );
}

export default ManageEvents;