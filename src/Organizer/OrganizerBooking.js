import React, { useEffect, useState } from "react";
import axios from "axios";
import PageHeader from "../PageHeader/PageHeader";
import "./OrganizerBooking.css";

function OrganizerBookings() {

  const [bookings, setBookings] = useState([]);

  
   const organizerEmail =
    localStorage.getItem("userEmail") ||
    localStorage.getItem("user_email") ||
    localStorage.getItem("email");
  useEffect(() => {

    axios.get("http://127.0.0.1:8000/api/organizer-bookings/", {
      params: { email: organizerEmail }
    })
    .then(res => {
      setBookings(res.data);
    })
    .catch(err => {
      console.log(err);
    });

  }, []);

  return (

    <div className="bookings-page">

      <PageHeader
        title="Event Bookings"
        subtitle="View bookings for your events"
      />

      <div className="bookings-container">

        {bookings.length === 0 ? (
          <p className="no-bookings">No bookings found</p>
        ) : (

          <table className="bookings-table">

            <thead>
              <tr>
                <th>Event</th>
                <th>Date</th>
                <th>User</th>
                <th>Tickets</th>
                <th>Booking Date</th>
              </tr>
            </thead>

            <tbody>

              {bookings.map((b, index) => (
                <tr key={index}>
                  <td>{b.event_title}</td>
                  <td>{b.event_date}</td>
                   <td>{b.user}</td>
                   <td>{b.tickets}</td>
                  <td>{b.booking_date}</td>
                </tr>
              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}

export default OrganizerBookings;