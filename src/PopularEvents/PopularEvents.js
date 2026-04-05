import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PopularEvents.css";

const PopularEvents = () => {

  const [events, setEvents] = useState([]);

  const navigate = useNavigate();


  useEffect(() => {

    fetchPopularEvents();

  }, []);


  const fetchPopularEvents = async () => {

    try {

      const res = await axios.get(
        "http://127.0.0.1:8000/api/popular_this_week/"
      );

      setEvents(res.data);

    }

    catch (error) {

      console.log(error);

    }

  };


  return (

    <section className="popular-events">

      <h2>Popular This Week</h2>


      <div className="popular-container">

        {events.length > 0 ? (

          events.map(event => (

            <div
              className="event-card"
              key={event.id}
            >

              <img
                src={
                  event.image
                    ? `http://127.0.0.1:8000${event.image}`
                    : "/default-event.jpg"
                }
                alt={event.title}
              />


              <div className="event-info">

                <h3>{event.title}</h3>

                <p>{event.venue}</p>


                <button
                  className="book-btn"
                  onClick={() =>
                    navigate(`/event/${event.id}`)
                  }
                >

                  View Details

                </button>

              </div>

            </div>

          ))

        ) : (

          <p className="no-events">

            No popular events this week

          </p>

        )}

      </div>

    </section>

  );

};

export default PopularEvents;