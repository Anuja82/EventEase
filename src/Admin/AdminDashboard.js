

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";
import PageHeader from "../PageHeader/PageHeader";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function AdminDashboard() {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_users: 0,
    total_events: 0,
    total_bookings: 0,
    total_revenue: 0
  });

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  // Client Request Notification Count
  const [requestCount, setRequestCount] = useState(0);


  useEffect(() => {

    // Dashboard stats
    axios
      .get("http://127.0.0.1:8000/api/admin-dashboard/")
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.log("Error fetching stats:", err);
      });


    // Chart data
    axios
      .get("http://127.0.0.1:8000/api/bookings-chart/")
      .then((res) => {

        const labels = res.data.map(item => item.month);
        const data = res.data.map(item => item.total);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Bookings",
              data: data,
              backgroundColor: "#ff2a8b"
            }
          ]
        });

      })
      .catch((err) => {
        console.log("Error fetching chart:", err);
      });


    // Fetch NEW client request notifications
    axios
      .get("http://127.0.0.1:8000/api/host-event-count/")
      .then((res) => {
        setRequestCount(res.data.new_requests);
      })
      .catch((err) => {
        console.log("Error fetching client requests:", err);
      });

  }, []);


  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Platform Management & Analytics"
      />

      <div className="admin-dashboard">

        <div className="admin-layout">

          {/* Sidebar */}

          <div className="sidebar">

            <h2>EventEase</h2>

            <ul>

              <li className="active">Dashboard</li>

              <li onClick={() => navigate("/admin-users")}>
                Manage Users
              </li>

              <li onClick={() => navigate("/admin-organizers")}>
                Manage Organizers
              </li>

              <li onClick={() => navigate("/admin-events")}>
                Manage Events
              </li>

              <li onClick={() => navigate("/admin-bookings")}>
                Bookings
              </li>

              <li onClick={() => navigate("/admin-revenue")}>
                Revenue Analytics
              </li>

              {/* Client Requests with notification badge */}

              <li onClick={() => navigate("/admin-client-requests")}>

                Client Requests

                {requestCount > 0 && (
                  <span className="badge">
                    {requestCount}
                  </span>
                )}

              </li>


              <li onClick={() => navigate("/admin-ai")}>
                AI Analytics
              </li>

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

            <h1>Welcome Admin 👋</h1>


            {/* Stats Cards */}

            <div className="cards">

              <div className="card">
                <h3>Total Users</h3>
                <p>{stats.total_users}</p>
              </div>

              <div className="card">
                <h3>Total Events</h3>
                <p>{stats.total_events}</p>
              </div>

              <div className="card">
                <h3>Total Bookings</h3>
                <p>{stats.total_bookings}</p>
              </div>

              <div className="card">
                <h3>Total Revenue</h3>
                <p>₹{stats.total_revenue}</p>
              </div>

            </div>


            {/* Chart Section */}

            <div className="section">

              <h2>Bookings Per Month</h2>

              <div style={{ width: "700px", marginTop: "20px" }}>
                <Bar data={chartData} />
              </div>

            </div>

          </div>

        </div>

      </div>

    </>
  );
}

export default AdminDashboard;
