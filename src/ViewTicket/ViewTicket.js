import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PageHeader from "../PageHeader/PageHeader";
import "./ViewTicket.css";

const ViewTicket = () => {

  const location = useLocation();
  const ticketRef = useRef();

  const booking = location.state;

  if (!booking) {
    return <p style={{color:"white",textAlign:"center"}}>Ticket not found</p>;
  }

  const { event, tickets } = booking;

  const downloadPDF = async () => {

    const canvas = await html2canvas(ticketRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p","mm","a4");

    pdf.addImage(imgData,"PNG",10,20,190,0);
    pdf.save("event-ticket.pdf");

  };

  return (

    <div className="booking-page-wrapper">

      <PageHeader
        title="Your Ticket"
        subtitle="Show this ticket at the event entrance"
      />

      <div className="ticket-wrapper">

        <div className="ticket-card" ref={ticketRef}>

          {/* Left perforation circle */}
          <div className="circle-left"></div>

          {/* Ticket Content */}

          <div className="ticket-content">

            <div className="ticket-left">

              <h2>{event.title}</h2>

              <div className="ticket-info">

                <p><span>Date</span>{event.date}</p>
                {/* <p><span>Time</span>{event.time}</p> */}
                <p><span>Time</span>
                {new Date(`1970-01-01T${event.time}`).toLocaleTimeString([], {
                 hour: "2-digit",
                 minute: "2-digit",
                 hour12: true,
                 })}</p>
                <p><span>Venue</span>{event.venue}</p>
                <p><span>Tickets</span>{tickets}</p>

              </div>

            </div>

            {/* Divider */}

            <div className="ticket-divider"></div>

            {/* QR Section */}

            <div className="ticket-right">

              <QRCodeCanvas
                value={`${event.title}-${tickets}-${event.date}`}
                size={130}
                bgColor="#ffffff"
              />

              <p className="scan-text">Scan for entry</p>

            </div>

          </div>

          {/* Right perforation circle */}
          <div className="circle-right"></div>

        </div>

        <button className="download-btn" onClick={downloadPDF}>
          📄 Download Ticket PDF
        </button>

      </div>

    </div>

  );
};

export default ViewTicket;