import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewBookings.css";
import PageHeader from "../PageHeader/PageHeader";

function ViewBookings() {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    setLoading(true);

    axios
      .get("http://127.0.0.1:8000/api/admin-bookings/")
      .then((res) => setBookings(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <PageHeader
        title="View Bookings"
        subtitle="Track all user bookings and payments"
      />

      <div className="admin-bookings">

        <div className="admin-bookings-container">

          <div className="top-bar">
            <h2>All Bookings</h2>
          </div>

          {loading ? (
            <p className="loading">Loading bookings...</p>
          ) : (
            <table className="admin-bookings-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Event</th>
                  <th>Tickets</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Booked At</th>
                </tr>
              </thead>

              <tbody>

                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-data">
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (

                    <tr key={b.id}>

                      <td>{b.id}</td>
                      <td>{b.user_name}</td>
                      <td>{b.event_title}</td>
                      <td>{b.tickets}</td>
                      <td>₹{b.total_price}</td>

                      {/* Status */}
                      <td>
                        <span className={`admin-status ${b.status === "Booked" ? "success" : "cancel"}`}>
                          {b.status}
                        </span>
                      </td>

                      <td>{b.booked_at}</td>

                    </tr>

                  ))
                )}

              </tbody>

            </table>
          )}

        </div>

      </div>
    </>
  );
}

export default ViewBookings;
