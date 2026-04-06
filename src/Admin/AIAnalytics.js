
import React, { useEffect, useState } from "react";
import axios from "axios";
import PageHeader from "../PageHeader/PageHeader";
import "./AIAnalytics.css";

function AIAnalytics() {

  const [analytics, setAnalytics] = useState({
    weekend_prediction: "",
    best_category: "",
    peak_booking_time: "",
    popular_event: "",
    organizer_count: "",
    booking_prediction: "",
    seat_prediction: "",
  });

  useEffect(() => {

    axios
      .get("http://127.0.0.1:8000/api/ai-analytics/")
      .then((res) => {

        setAnalytics(res.data);

      })
      .catch((err) => {

        console.log("Analytics API error:", err);

      });

  }, []);


  return (

    <>
      <PageHeader
        title="AI Analytics"
        subtitle="Smart insights and predictions based on platform bookings"
      />

      <div className="ai-wrapper">

        <h2 className="ai-title">
          📊 AI Analytics Dashboard
        </h2>

        <div className="ai-card-container">

          {/* Weekend Trend */}

          <div className="ai-card">
            <h4>Weekend Booking Trend</h4>
            <p>
              {analytics.weekend_prediction ||
                "Analyzing weekend booking patterns..."}
            </p>
          </div>


          {/* Best Category */}

          <div className="ai-card">
            <h4>Best Performing Category</h4>
            <p>
              {analytics.best_category ||
                "Detecting top category..."}
            </p>
          </div>


          {/* Peak Booking Time */}

          <div className="ai-card">
            <h4>Peak Booking Time</h4>
            <p>
              {analytics.peak_booking_time ||
                "Calculating peak hours..."}
            </p>
          </div>


          {/* Popular Event */}

          <div className="ai-card">
            <h4>Most Popular Event</h4>
            <p>
              {analytics.popular_event ||
                "Analyzing event engagement..."}
            </p>
          </div>


          {/* Organizer Count */}

          <div className="ai-card">
            <h4>Total Organizers</h4>
            <p>
              {analytics.organizer_count ||
                "Counting organizers..."}
            </p>
          </div>


          {/* NEW: Booking Prediction */}

          <div className="ai-card">
            <h4>Next Weekend Prediction</h4>
            <p>
              {analytics.booking_prediction ||
                "Analyzing booking growth trends..."}
            </p>
          </div>
          <div className="ai-card">

  <h4>Seat Demand Prediction</h4>

  <p>
    {analytics.seat_prediction ||
      "Analyzing seat demand trends..."}
  </p>

</div>

        </div>


        {/* Smart Recommendations */}

        <div className="ai-chart-section">

          <h3>📈 Smart Recommendations</h3>

          <ul>
            <li>✔ Schedule premium events on weekends</li>
            <li>✔ Launch offers during peak booking hours</li>
            <li>✔ Promote high-performing event categories</li>
            <li>✔ Encourage organizer participation</li>
          </ul>

        </div>

      </div>

    </>
  );

}

export default AIAnalytics;