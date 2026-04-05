

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageOrganizer.css";
import PageHeader from "../PageHeader/PageHeader";

function ManageOrganizers() {

  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchOrganizers();
  }, []);

  // Fetch organizers
  const fetchOrganizers = () => {
    setLoading(true);

    axios
      .get("http://127.0.0.1:8000/api/admin-organizers/")
      .then((res) => {
        console.log("DATA:", res.data);
        setOrganizers(res.data);
      })
      .catch((err) => {
        console.log("ERROR:", err.response || err);
      })
      .finally(() => setLoading(false));
  };

  //  Approve Organizer
  const handleApprove = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/approve-organizer/${id}/`);
      fetchOrganizers();
    } catch (error) {
      console.log(error);
    }
  };

  // Block / Unblock
  const handleToggleStatus = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/toggle-organizer/${id}/`);
      fetchOrganizers();
    } catch (error) {
      console.log(error);
    }
  };

  //Delete Organizer
  const handleDelete = async (requestId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/approve-delete/${requestId}/`);
      fetchOrganizers();
    } catch (error) {
      console.log(error);
    }
  };

  // View Events → OPEN MODAL
  const handleViewEvents = async (id) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/organizer-event/${id}/`
      );

      setEvents(res.data);
      setShowModal(true);

    } catch (error) {
      console.log(error);
      alert("Error fetching events");
    }
  };

  return (
    <>
      <PageHeader
        title="Manage Organizers"
        subtitle="Control organizers and their activities"
      />

      <div className="manage-organizers">
        <div className="organizers-container">

          <div className="top-bar">
            <h2>Manage Organizers</h2>
          </div>

          {loading ? (
            <p className="loading">Loading organizers...</p>
          ) : (
            <>
              {organizers.length === 0 ? (
                <p className="no-data">No organizers found</p>
              ) : (
                <table className="organizers-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Approval</th>
                      <th>Deletion Request</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {organizers.map((org) => (
                      <tr key={org.id}>
                        <td>{org.id}</td>
                        <td>{org.username}</td>
                        <td>{org.email}</td>

                        <td>
                          <span className={org.is_active ? "status active" : "status blocked"}>
                            {org.is_active ? "Active" : "Blocked"}
                          </span>
                        </td>

                        <td>
                          <span className={org.is_approved ? "approved" : "pending"}>
                            {org.is_approved ? "Approved" : "Pending"}
                          </span>
                        </td>

                        <td>
                          {org.deletion_requested ? (
                            <span className="request">Requested</span>
                          ) : (
                            <span className="no-request">None</span>
                          )}
                        </td>

                        <td>
                          {!org.is_approved && (
                            <button
                              className="approve-btn"
                              onClick={() => handleApprove(org.id)}
                            >
                              Approve
                            </button>
                          )}

                          <button
                            className="view-btn"
                            onClick={() => handleViewEvents(org.id)}
                          >
                            View Events
                          </button>

                          <button
                            className={org.is_active ? "block-btn" : "unblock-btn"}
                            onClick={() => handleToggleStatus(org.id)}
                          >
                            {org.is_active ? "Block" : "Unblock"}
                          </button>

                          {org.deletion_requested && (
                            <button
                              className="delete-btn"
                              onClick={() => handleDelete(org.deletion_requested)}
                            >
                              Approve Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

        </div>
      </div>

      {showModal && (
  <div className="modal-overlays">
    <div className="modal-boxes">

      <h3 className="modal-title">Organizer's Events</h3>

      {events.length === 0 ? (
        <p className="no-data">No events found</p>
      ) : (
        <table className="modal-tables">
          <thead>
            <tr>
              <th>Event</th>
              <th>Category</th>
              <th>Date</th>
              <th>Venue</th>
              <th>Price</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>{event.title}</td>
                <td>{event.category}</td>
                <td>{event.date}</td>
                <td>{event.venue}</td>
                <td>₹{event.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        className="modal-close-btn"
        onClick={() => setShowModal(false)}
      >
        Close
      </button>

    </div>
  </div>
)}
    </>
  );
}

export default ManageOrganizers;

