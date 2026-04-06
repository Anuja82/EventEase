
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RevenueAnalytics.css";
import PageHeader from "../PageHeader/PageHeader";

function RevenueAnalytics() {

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [eventRevenue, setEventRevenue] = useState([]);
  const [organizerRevenue, setOrganizerRevenue] = useState([]);

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = () => {

    axios.get("http://127.0.0.1:8000/api/admin-revenue/")
      .then((res) => {

        setTotalRevenue(res.data.total_revenue);
        setEventRevenue(res.data.revenue_by_event);
        setOrganizerRevenue(res.data.revenue_by_organizer);

      })
      .catch(err => console.log(err));

  };

  const topEvent = eventRevenue[0];
  const topOrganizer = organizerRevenue[0];

  return (
    <>
      <PageHeader
        title="Revenue Analytics"
        subtitle="Monitor earnings across events and organizers"
      />

      <div className="revenue-dashboard">

        {/* KPI CARDS */}
        <div className="kpi-grid">

          <div className="kpi-card total">
            <p>Total Revenue</p>
            <h2>₹ {totalRevenue}</h2>
          </div>

          <div className="kpi-card event">
            <p>Top Event Revenue</p>
            <h2>
              {topEvent ? `₹ ${topEvent.revenue}` : "₹ 0"}
            </h2>
            <span>{topEvent?.event_title}</span>
          </div>

          <div className="kpi-card organizer">
            <p>Top Organizer Revenue</p>
            <h2>
              {topOrganizer ? `₹ ${topOrganizer.revenue}` : "₹ 0"}
            </h2>
            <span>{topOrganizer?.organizer_name}</span>
          </div>

        </div>


        {/* ANALYTICS GRID */}
        <div className="analytics-grid">

          {/* EVENT TABLE */}
          <div className="analytics-card">

            <h3>Revenue by Event</h3>

            <table>

              <tbody>

                {eventRevenue.map((event, index) => (

                  <tr key={index}>

                    <td className="rank">#{index + 1}</td>

                    <td>{event.event_title}</td>

                    <td className="amount">
                      ₹ {event.revenue}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>


          {/* ORGANIZER TABLE */}
          <div className="analytics-card">

            <h3>Revenue by Organizer</h3>

            <table>

              <tbody>

                {organizerRevenue.map((org, index) => (

                  <tr key={index}>

                    <td className="rank">#{index + 1}</td>

                    <td>{org.organizer_name}</td>

                    <td className="amount">
                      ₹ {org.revenue}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </>
  );
}

export default RevenueAnalytics;