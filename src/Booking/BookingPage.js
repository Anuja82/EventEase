import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PageHeader from "../PageHeader/PageHeader";
import "./BookingPage.css";

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/event/${id}/`
      );
      setEvent(res.data);
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = () => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      alert("Please login first");
      return;
    }

    if (!event) {
      alert("Event not loaded yet");
      return;
    }

    if (tickets > event.available_seats) {
      alert("Not enough seats available");
      return;
    }

    // Navigate to Step 2 (Payment Page)
    navigate("/payment", {
      state: {
        event: event,
        tickets: tickets
      }
    });
  };

  if (loading) return <p className="loading">Loading event...</p>;
  if (!event) return <p className="loading">Event not found</p>;

  return (
    <div className="booking-page-wrapper">

      <PageHeader title="Confirm Booking" subtitle={event.title} />

      {/* STEP INDICATOR */}
      <div className="booking-steps">

        <div className="step active">
          <div className="step-circle">1</div>
          <p>Tickets</p>
        </div>

        <div className="step-line active"></div>

        <div className="step">
          <div className="step-circle">2</div>
          <p>Payment</p>
        </div>

        <div className="step-line"></div>

        <div className="step">
          <div className="step-circle">3</div>
          <p>Confirmation</p>
        </div>

      </div>

      <div className="booking-theme-container">

        <div className="booking-theme-card">

          <h2 className="booking-title">{event.title}</h2>

          <div className="booking-theme-grid">

            <div>
              <span>Date</span>
              <p>{event.date}</p>
            </div>

            <div>
              <span>Time</span>
              <p>{event.time}</p>
            </div>

            <div>
              <span>Venue</span>
              <p>{event.venue}</p>
            </div>

            <div>
              <span>Available Seats</span>
              <p>{event.available_seats}</p>
            </div>

          </div>

          <div className="theme-divider"></div>

          <div className="ticket-theme-section">

            <label>Select Tickets</label>

            <div className="ticket-theme-controls">

              <button
                onClick={() => tickets > 1 && setTickets(tickets - 1)}
              >
                −
              </button>

              <span>{tickets}</span>

              <button
                onClick={() =>
                  tickets < event.available_seats &&
                  setTickets(tickets + 1)
                }
              >
                +
              </button>

            </div>

          </div>

          <div className="total-theme-section">
            <span>Total Amount</span>
            <strong>₹ {tickets * event.price}</strong>
          </div>

          <button
            className="confirm-theme-btn"
            onClick={handleConfirmBooking}
          >
            Continue to Payment
          </button>

        </div>

      </div>

    </div>
  );
};

export default BookingPage;

