import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../PageHeader/PageHeader";
import "./Show.css";

const Show = () => {

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const { category } = useParams();

  const navigate = useNavigate();

  const userId = localStorage.getItem("user_id");


  useEffect(() => {
    fetchEvents();
    fetchWishlist();
  }, []);


  const fetchEvents = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/events/"
      );
      setEvents(res.data);
    } catch (error) {
      console.log(error);
    }
  };


  const fetchWishlist = async () => {

    if (!userId) return;

    try {

      const res = await axios.get(
        `http://127.0.0.1:8000/api/my-wishlist/${userId}/`
      );

      const ids = res.data.map(item => item.event.id);

      setWishlist(ids);

    } catch (error) {
      console.log(error);
    }

  };


  const toggleWishlist = async (eventId) => {

    if (!userId) {
      alert("Login first");
      return;
    }

    try {

      if (wishlist.includes(eventId)) {

        await axios.delete(
          `http://127.0.0.1:8000/api/remove-wishlist/${eventId}/${userId}/`
        );

        setWishlist(
          wishlist.filter(id => id !== eventId)
        );

      }

      else {

        await axios.post(
          "http://127.0.0.1:8000/api/add-wishlist/",
          {
            user_id: userId,
            event_id: eventId
          }
        );

        setWishlist([...wishlist, eventId]);

      }

    }

    catch (error) {
      console.log(error);
    }

  };


  useEffect(() => {

    let updated = events;

    if (category) {

      updated = updated.filter(
        event =>
          event.category &&
          event.category.toLowerCase() ===
          category.toLowerCase()
      );

    }

    setFilteredEvents(updated);

  }, [category, events]);


  return (

    <>

      <PageHeader
        title="Shows"
        subtitle="Discover and book exciting upcoming shows"
      />


      {/* HERO SECTION WITH CATEGORY TABS */}

      <section className="shows-hero">

        <div className="shows-overlay">

          <h1>{category ? category : "All Shows"}</h1>

          <div className="shows-filters">

            {["All", "Music", "Technology", "Business", "Workshop", "Sports"].map(cat => (

              <button
                key={cat}
                className={
                  (!category && cat === "All") ||
                  category?.toLowerCase() === cat.toLowerCase()
                    ? "active"
                    : ""
                }

                onClick={() =>
                  cat === "All"
                    ? navigate("/shows")
                    : navigate(`/shows/${cat}`)
                }
              >

                {cat}

              </button>

            ))}

          </div>

        </div>

      </section>



      {/* EVENT GRID */}

      <section className="shows-list">

        <div className="shows-grid">

          {filteredEvents.length > 0 ? (

            filteredEvents.map(event => (

              <div
                className="show-card"
                key={event.id}
              >

                <div className="image-wrapper">

                  <img
                    src={
                      event.image
                        ? `http://127.0.0.1:8000${event.image}`
                        : "/default-event.jpg"
                    }
                    alt={event.title}
                  />


                  {/*  WISHLIST BUTTON */}

                  <span
                    className={
                      wishlist.includes(event.id)
                        ? "heart active"
                        : "heart"
                    }

                    onClick={() =>
                      toggleWishlist(event.id)
                    }
                  >

                    ❤

                  </span>

                </div>


                <div className="show-info">

                  <h3>{event.title}</h3>

                  <span>{event.date}</span>

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

            ))

          ) : (

            <p className="no-events">
              No events found
            </p>

          )}

        </div>

      </section>

    </>

  );

};

export default Show;