
import React, { useState } from "react";
import axios from "axios";
import PageHeader from "../PageHeader/PageHeader";
import "./HostEvent.css";

function HostEvent() {

  const [formData, setFormData] = useState({

    client_name: "",
    contact_person: "",
    email: "",
    phone: "",
    event_type: "",
    expected_date: "",
    location: "",
    budget: "",
    description: ""

  });

  const [showModal, setShowModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "http://127.0.0.1:8000/api/host-event/",
        formData
      );

      setShowModal(true);

      setFormData({

        client_name: "",
        contact_person: "",
        email: "",
        phone: "",
        event_type: "",
        expected_date: "",
        location: "",
        budget: "",
        description: ""

      });

    }

    catch {

      setErrorModal(true);

    }

  };


  return (

    <div className="host-event-page">

      <PageHeader
        title="Host Your Event With EventEase"
        subtitle="Tell us about your event and our team will handle the planning — or contact us directly for faster assistance."
      />


      <div className="host-form-header">

        <h2>📩 Mail us directly or fill the form below</h2>

        <a
          href="mailto:eventease.project@gmail.com"
          className="host-email-link"
        >
          eventease.project@gmail.com
        </a>

      </div>


      <div className="host-event-container">

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <input
              type="text"
              name="client_name"
              placeholder="Client / Company Name"
              value={formData.client_name}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="contact_person"
              placeholder="Contact Person Name"
              value={formData.contact_person}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <select
              name="event_type"
              value={formData.event_type}
              onChange={handleChange}
              required
            >

              <option value="">Select Event Type</option>
              <option>Music</option>
              <option>Technology</option>
              <option>Workshop</option>
              <option>Business</option>
              <option>Sports</option>
              <option>Other</option>

            </select>

            <input
              type="date"
              name="expected_date"
              value={formData.expected_date}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="location"
              placeholder="Event Location"
              value={formData.location}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="budget"
              placeholder="Estimated Budget"
              value={formData.budget}
              onChange={handleChange}
            />

          </div>


          <textarea
            name="description"
            placeholder="Describe your event requirements..."
            value={formData.description}
            onChange={handleChange}
            required
          />


          <button className="submit-btn">
            Submit Event Request
          </button>

        </form>

      </div>


      {/* SUCCESS MODAL */}

      {showModal && (

        <div className="modal-overlay">

          <div className="modal-box">

            <h3>🎉 Request Submitted Successfully</h3>

            <p>
              Our EventEase team will contact you shortly.
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="modal-btn"
            >
              Close
            </button>

          </div>

        </div>

      )}


      {/* ERROR MODAL */}

      {errorModal && (

        <div className="modal-overlay">

          <div className="modal-box error">

            <h3>⚠ Something went wrong</h3>

            <p>Please try again later.</p>

            <button
              onClick={() => setErrorModal(false)}
              className="modal-btn"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>

  );

}

export default HostEvent;