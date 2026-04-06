
import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./FeaturedEvents.css";

const FeaturedEvents = () => {

  const scrollRef = useRef(null);

  const [events, setEvents] = useState([]);

  const navigate = useNavigate();


  useEffect(() => {

    fetchFeaturedEvents();

  }, []);


  const fetchFeaturedEvents = async () => {

    try {

      const res = await axios.get(
        "http://127.0.0.1:8000/api/featured-events/"
      );

      setEvents(res.data);

    }

    catch (error) {

      console.log(error);

    }

  };


  const scroll = (direction) => {

    const { current } = scrollRef;

    const scrollAmount = direction === "left" ? -350 : 350;

    current.scrollBy({

      left: scrollAmount,

      behavior: "smooth"

    });

  };


  useEffect(() => {

    const interval = setInterval(() => {

      scroll("right");

    }, 4000);

    return () => clearInterval(interval);

  }, []);


  return (

    <section className="featured-section">

      <h2>Featured Events</h2>


      <div className="relative">

        <button

          onClick={() => scroll("left")}

          className="arrow-btn left"

        >

          <ChevronLeft size={24} />

        </button>


        <div

          ref={scrollRef}

          className="featured-scroll no-scrollbar"

        >

          {events.map((event) => (

            <div

              key={event.id}

              className="event-card"

            >

              <img

                src={

                  event.image

                    ? `http://127.0.0.1:8000${event.image}`

                    : "/default-event.jpg"

                }

                alt={event.title}

              />


              <div className="content">

                <h3>{event.title}</h3>

                <p>{event.date}</p>

                <p>{event.venue}</p>


                <button

                  onClick={() =>

                    navigate(`/event/${event.id}`)

                  }

                >

                  View Details

                </button>

              </div>

            </div>

          ))}

        </div>


        <button

          onClick={() => scroll("right")}

          className="arrow-btn right"

        >

          <ChevronRight size={24} />

        </button>

      </div>

    </section>

  );

};

export default FeaturedEvents;
