
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PageHeader from "../PageHeader/PageHeader";
import "./EventDetails.css";

const EventDetails = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const [event, setEvent] = useState(null);


  useEffect(() => {

    const fetchEvent = async () => {

      try {

        const res = await axios.get(
          `http://127.0.0.1:8000/api/event/${id}/`
        );

        setEvent(res.data);

      } catch (error) {

        console.error("Error fetching event details", error);

      }

    };

    fetchEvent();

  }, [id]);


  const handleBooking = () => {

    if (!event) return;

    navigate(`/book/${event.id}`);

  };


  if (!event)
    return <p className="loading">Loading...</p>;


  return (

    <div className="event-details-page">

      <PageHeader
        title={event.title}
        subtitle="Don't miss out on this unforgettable experience"
      />

      <div className="saas-container">

        <div className="event-card">

          {event.image && (

            <div className="event-image-wrapper">

              <img
                src={`http://127.0.0.1:8000${event.image}`}
                alt={event.title}
              />

            </div>

          )}


          <div className="event-content">

            <div className="event-meta">

              <div>
                <span>Date</span>
                <p>{event.date}</p>
              </div>

              <div>
                <span>Time</span>

                <p>
                  {new Date(
                    `1970-01-01T${event.time}`
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>

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


            <div className="event-description">

              <h3>Description</h3>

              <p>{event.description}</p>

            </div>


            <div className="event-footer">

              <div className="price">

                ₹ {event.price}

                <span> / ticket</span>

              </div>


              <button
                className="book-btn"
                onClick={handleBooking}
                disabled={event.available_seats === 0}
              >

                {event.available_seats === 0
                  ? "Sold Out"
                  : "Book Now"}

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};

export default EventDetails;