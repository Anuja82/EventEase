import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../PageHeader/PageHeader";
import "./SearchPage.css";

function SearchPage() {

  const [events, setEvents] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {

    if (!query) return;

    axios
      .get("http://127.0.0.1:8000/api/search-events/", {
        params: { query: query },
      })
      .then((res) => {
        setEvents(res.data);
      });

  }, [query]);

  return (
    <div className="search-page">

      <PageHeader
        title="Search Results"
        subtitle={`Results for "${query}"`}
      />

      <div className="search-container">

        {events.length === 0 ? (
          <p className="no-results">No events found</p>
        ) : (

          <div className="search-grid">

            {events.map((event) => (

              <div
                key={event.id}
                className="search-card"
                onClick={() => navigate(`/event/${event.id}`)}
              >

                <div className="search-image">

                  <img
                     src={`http://127.0.0.1:8000${event.image}`}
                      alt={event.title}
/>

                  <span className="date-badge">
                    {event.date}
                  </span>

                </div>

                <div className="search-info">

                  <h3>{event.title}</h3>

                  <p className="venue">{event.venue}</p>

                  <div className="search-footer">

                    <span className="price">
                      ₹ {event.price}
                    </span>

                    <button className="vw-btn">
                      View
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default SearchPage;