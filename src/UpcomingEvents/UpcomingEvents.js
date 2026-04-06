import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UpcomingEvents.css";


const UpcomingEvents = () => {

  const [events, setEvents] = useState([]);

  const [currentTime, setCurrentTime] = useState(Date.now());

  const navigate = useNavigate();


  // fetch events once
  useEffect(() => {

    fetchUpcomingEvents();

  }, []);


  // update countdown every second
  useEffect(() => {

    const timer = setInterval(() => {

      setCurrentTime(Date.now());

    }, 1000);


    return () => clearInterval(timer);

  }, []);


  const fetchUpcomingEvents = async () => {

    try {

      const res = await axios.get(
        "http://127.0.0.1:8000/api/upcoming-events/"
      );

      setEvents(res.data);

    }

    catch (error) {

      console.log(error);

    }

  };


  // live countdown logic

  const calculateCountdown = (eventDate) => {

    const distance =
      new Date(eventDate).getTime() - currentTime;


    if (distance < 0)

      return "Event Started!";


    const days = Math.floor(
      distance / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
      (distance %
        (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
    );

    const minutes = Math.floor(
      (distance %
        (1000 * 60 * 60)) /
        (1000 * 60)
    );

    const seconds = Math.floor(
      (distance %
        (1000 * 60)) / 1000
    );


    return `Starts in ${days}d ${hours}h ${minutes}m ${seconds}s`;

  };


  return (

    <section className="upcoming-section">

      <h2 className="section-title">

        Upcoming Events

      </h2>


      <div className="event-carousel">

        {events.map(event => (

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

              <p>

                {event.date} | {event.venue}

              </p>


              <p className="countdown">

                {calculateCountdown(event.date)}

              </p>


              <button

                onClick={() =>
                  navigate(`/event/${event.id}`)
                }

              >

                Book Now

              </button>

            </div>

          </div>

        ))}

      </div>

    </section>

  );

};


export default UpcomingEvents;