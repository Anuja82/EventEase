

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageUsers.css";
import PageHeader from "../PageHeader/PageHeader";

function ManageUsers() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users
  const fetchUsers = () => {
    setLoading(true);

    axios
      .get("http://127.0.0.1:8000/api/admin-users/")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  // Search users
  const handleSearch = (e) => {

    const value = e.target.value;
    setSearch(value);

    if (value === "") {
      fetchUsers();
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/api/search-users/?search=${value}`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  };

  // Block / Unblock user
  const toggleStatus = (id) => {

    axios
      .put(`http://127.0.0.1:8000/api/toggle-user-status/${id}/`)
      .then(() => fetchUsers())
      .catch((err) => console.log(err));
  };
  // View booking history
  const viewBookings = (user) => {

    setSelectedUser(user);

    axios
      .get(`http://127.0.0.1:8000/api/user-bookings/${user.id}/`)
      .then((res) => {
        setBookings(res.data);
        setShowModal(true);
      })
      .catch((err) => console.log(err));
  };

  // Delete user
  const deleteUser = (id) => {

    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    axios
      .delete(`http://127.0.0.1:8000/api/delete-user/${id}/`)
      .then(() => fetchUsers())
      .catch((err) => console.log(err));
  };

  

  return (
    <>
      <PageHeader
        title="Manage Users"
        subtitle="Control and monitor platform users"
      />

      <div className="manage-users">

        <div className="users-container">

          <div className="users-top">

            <h2>All Users</h2>

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={handleSearch}
              className="search-box"
            />

          </div>

          {loading ? (
            <p className="loading">Loading users...</p>
          ) : (
            <table className="users-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="no-users">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (

                    <tr key={user.id}>

                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>

                      <td>
                        <span className={user.is_active ? "status active" : "status blocked"}>
                          {user.is_active ? "Active" : "Blocked"}
                        </span>
                      </td>

                      <td>

                        <button
                          className="view-button"
                          onClick={() => viewBookings(user)}
                        >
                          View
                        </button>

                        <button
                          className={user.is_active ? "block-btn" : "unblock-btn"}
                          onClick={() => toggleStatus(user.id)}
                        >
                          {user.is_active ? "Block" : "Unblock"}
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => deleteUser(user.id)}
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

      {/* Booking History Modal */}

      {showModal && (

        <div className="modal-overlay">

          <div className="modal">

            <h3>{selectedUser?.username}'s Bookings</h3>

            {bookings.length === 0 ? (
              <p className="no-bookings">No bookings found</p>
            ) : (

              <table className="booking-table">

                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Tickets</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  {bookings.map((b) => (

                    <tr key={b.id}>
                      <td>{b.event}</td>
                      <td>{b.tickets}</td>
                      <td>₹{b.total_price}</td>
                      <td>{b.status}</td>
                    </tr>

                  ))}

                </tbody>

              </table>

            )}

            <button
              className="close-btn"
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

export default ManageUsers;

