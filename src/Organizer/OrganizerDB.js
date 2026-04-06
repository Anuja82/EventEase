
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./OrganizerDB.css";

import PageHeader from "../PageHeader/PageHeader";

function OrganizerDB() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    total_events: 0,
    total_bookings: 0,
    revenue: 0,
    upcoming: 0,
  });

  // Get values from localStorage
  const email =
    localStorage.getItem("userEmail") ||
    localStorage.getItem("user_email") ||
    localStorage.getItem("email");

  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  useEffect(() => {
    console.log("EMAIL:", email);
    console.log("ROLE:", role);

    //  Protect route
    if (role !== "organizer") {
      navigate("/auth");
      return;
    }

    //  If email missing → go back to login
    if (!email) {
      console.log("❌ Email missing → redirecting");
      navigate("/auth");
      return;
    }

    fetchData();
  }, []);

  //  API call
  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/organizer-dashboard/",
        {
          params: { email: email }, 
        }
      );

      console.log("DATA:", res.data);

      setEvents(res.data.events);
      setStats(res.data.stats);

    } catch (error) {
      console.log(
        "❌ Dashboard error:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <>
      <PageHeader
        title="Organizer Dashboard"
        subtitle="Manage your events and bookings"
      />

      <div className="admin-layout">

        {/* Sidebar */}
        <div className="sidebar">
          <h2>EventEase</h2>

          <ul>
            <li className="active">Dashboard</li>
            <li onClick={() => navigate("/create-event")}>Create Event</li>
            <li onClick={() => navigate("/myevents")}>My Events</li>
            <li onClick={() => navigate("/organizer-bookings")}>Bookings</li>
            <li onClick={() => navigate("/organizer-profile")}>Profile</li>
          </ul>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <h1>Welcome, {username} 👋</h1>

          {/* Stats Cards */}
          <div className="cards">
            <div className="card purple">
              <h3>Total Events</h3>
              <p>{stats.total_events}</p>
            </div>

            <div className="card blue">
              <h3>Total Bookings</h3>
              <p>{stats.total_bookings}</p>
            </div>

            <div className="card green">
              <h3>Total Revenue</h3>
              <p>₹ {stats.revenue}</p>
            </div>

            <div className="card orange">
              <h3>Upcoming</h3>
              <p>{stats.upcoming}</p>
            </div>
          </div>

          {/* Events Table */}
          <div className="section">
            <h2>Upcoming Events</h2>

            {events.length === 0 ? (
              <p>No events found</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Price</th>
                    <th>Seats</th>
                  </tr>
                </thead>

                <tbody>
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td>{event.title}</td>
                      <td>{event.date}</td>
                      <td>₹ {event.price}</td>
                      <td>{event.total_seats}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

export default OrganizerDB;