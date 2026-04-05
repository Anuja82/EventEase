import React, { useEffect, useState } from "react";
import axios from "axios";
import PageHeader from "../PageHeader/PageHeader";
import "./AdminClientRequests.css";

function AdminClientRequests() {

  const [requests, setRequests] = useState([]);


  useEffect(() => {

    fetchRequests();

  }, []);


  const fetchRequests = () => {

    axios
      .get("http://127.0.0.1:8000/api/host-events/")
      .then((res) => {

        setRequests(res.data);

      })
      .catch((err) => {

        console.log("Error loading requests", err);

      });

  };


  const approveRequest = (id) => {

    axios
      .put(`http://127.0.0.1:8000/api/approve-host-event/${id}/`)
      .then(() => {

        fetchRequests();

      });

  };


  const markContacted = (id) => {

    axios
      .put(`http://127.0.0.1:8000/api/contacted-host-event/${id}/`)
      .then(() => {

        fetchRequests();

      });

  };


  return (

    <>

      <PageHeader
        title="Client Event Requests"
        subtitle="Manage event requests submitted by users"
      />

      <div className="client-requests-container">
        <div className="client-requests-card">

    <h2 className="client-requests-title">
      Client Requests
    </h2>

        <table>

          <thead>

            <tr>

              <th>Name</th>

              <th>Email</th>

              <th>Event Title</th>

              <th>Date</th>

              <th>Status</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {requests.map((item) => (

              <tr key={item.id}>

                <td>{item.client_name}</td>

                <td>{item.email}</td>

                <td>{item.event_type}</td>

                <td>{item.expected_date}</td>

                <td>

                  <span className={`status ${item.status}`}>

                    {item.status}

                  </span>

                </td>

                <td>

                  {item.status === "NEW" && (

                    <button
                      className="contact-btn"
                      onClick={() => markContacted(item.id)}
                    >
                      Contacted
                    </button>

                  )}

                  {item.status !== "APPROVED" && (

                    <button
                      className="approve-btn"
                      onClick={() => approveRequest(item.id)}
                    >
                      Approve
                    </button>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>
        </div>

      </div>

    </>

  );

}

export default AdminClientRequests;