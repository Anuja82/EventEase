import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../PageHeader/PageHeader";
import "./BookingSuccess.css";

const BookingSuccess = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state;

  if (!bookingData) {
    return <p style={{color:"white",textAlign:"center"}}>No booking data</p>;
  }

  const { event, tickets } = bookingData;

  return (
    <div className="booking-page-wrapper">

      <PageHeader title="Booking Confirmation" subtitle={event.title} />

      {/* STEP INDICATOR */}
      <div className="booking-steps">

        <div className="step active">
          <div className="step-circle">✓</div>
          <p>Tickets</p>
        </div>

        <div className="step-line active"></div>

        <div className="step active">
          <div className="step-circle">✓</div>
          <p>Payment</p>
        </div>

        <div className="step-line active"></div>

        <div className="step active">
          <div className="step-circle">✓</div>
          <p>Confirmation</p>
        </div>

      </div>

      <div className="booking-theme-container">

        <div className="booking-success-card">

          <div className="success-icon">🎉</div>

          <h2>Booking Confirmed!</h2>
          <p>Your ticket has been successfully booked.</p>

          <div className="success-details">

            <div>
              <span>Event</span>
              <p>{event.title}</p>
            </div>

            <div>
              <span>Date</span>
              <p>{event.date}</p>
            </div>

            <div>
              <span>Tickets</span>
              <p>{tickets}</p>
            </div>

            <div>
              <span>Total Paid</span>
              <p>₹ {tickets * event.price}</p>
            </div>

          </div>

          {/* BUTTONS */}
          <div className="success-buttons">

            <button
  className="ticket-btn"
  onClick={() =>
    navigate("/view-ticket", {
      state: {
        event: event,
        tickets: tickets
      }
    })
  }
>
  🎫 View Ticket
</button>

            <button
              className="confirm-theme-btn"
              onClick={() => navigate("/shows")}
            >
              Explore More Events
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default BookingSuccess;