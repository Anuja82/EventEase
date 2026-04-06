import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import PageHeader from "../PageHeader/PageHeader";
import "./PaymentPage.css";

const PaymentPage = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const event = location.state?.event;
  const tickets = location.state?.tickets;

  const [paymentMethod, setPaymentMethod] = useState("card");

  const [cardNumber, setCardNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [upiId, setUpiId] = useState("");

  const [loading, setLoading] = useState(false);

  // If page opened directly
  if (!event || !tickets) {
    return (
      <div style={{ textAlign: "center", marginTop: "120px" }}>
        <h2>No booking data found</h2>
        <p>Please select an event first.</p>

        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            border: "none",
            background: "#ff2f92",
            color: "#fff",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Go Back to Events
        </button>
      </div>
    );
  }

  const total = tickets * event.price;

  const handlePayment = async (e) => {
    e.preventDefault();

    
    const userId = parseInt(localStorage.getItem("user_id"));

    if (!userId) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    // Card Validation
    if (paymentMethod === "card") {
      if (!cardNumber || cardNumber.length < 16) {
        alert("Enter valid card number");
        return;
      }

      if (!name || !expiry || !cvv) {
        alert("Please fill all card details");
        return;
      }
    }

    // UPI Validation
    if (paymentMethod === "upi") {
      if (!upiId) {
        alert("Please enter UPI ID");
        return;
      }
    }

    setLoading(true);

    try {

      // Fake payment delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      await axios.post("http://127.0.0.1:8000/api/create-booking/", {
  user_id: userId,
  event_id: event.id,
  tickets: tickets
});
      navigate("/booking-success", {
        state: { event, tickets, total }
      });

    }catch (error) {

  console.log("FULL ERROR:", error);
  console.log("SERVER ERROR:", error.response?.data);

  if (error.response && error.response.data.error) {
    alert(error.response.data.error);
  } else {
    alert("Payment failed. Please try again.");
  }

}

    
   
  };

  return (
    <div className="payment-page">

      <PageHeader title="Payment" subtitle={event.title} />

      {/* Step Indicator */}
      <div className="booking-steps">

        <div className="step completed">
          <div className="step-circle">✓</div>
          <p>Tickets</p>
        </div>

        <div className="step-line active"></div>

        <div className="step active">
          <div className="step-circle">2</div>
          <p>Payment</p>
        </div>

        <div className="step-line"></div>

        <div className="step">
          <div className="step-circle">3</div>
          <p>Confirmation</p>
        </div>

      </div>

      {/* Payment Layout */}
      <div className="payment-container">

        {/* Payment Methods */}
        <div className="payment-sidebar">

          <h3>Payment Method</h3>

          <button
            className={paymentMethod === "card" ? "method active" : "method"}
            onClick={() => setPaymentMethod("card")}
          >
            💳 Card Payment
          </button>

          <button
            className={paymentMethod === "upi" ? "method active" : "method"}
            onClick={() => setPaymentMethod("upi")}
          >
            📱 UPI Payment
          </button>

        </div>

        {/* Payment Form */}
        <div className="payment-card">

          <h2>Secure Payment</h2>

          <div className="payment-summary">
            <p><strong>Event:</strong> {event.title}</p>
            <p><strong>Tickets:</strong> {tickets}</p>
            <p className="total">Total: ₹{total}</p>
          </div>

          <form onSubmit={handlePayment}>

            {/* Card Payment */}
            {paymentMethod === "card" && (
              <>
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Name on Card"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <div className="card-row">

                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                  />

                  <input
                    type="password"
                    placeholder="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                  />

                </div>
              </>
            )}

            {/* UPI Payment */}
            {paymentMethod === "upi" && (
              <div className="upi-section">

                <div className="upi-qr">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay"
                    alt="UPI QR"
                  />
                </div>

                <p className="or-text">OR</p>

                <input
                  type="text"
                  placeholder="Enter UPI ID (example@upi)"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />

              </div>
            )}

            <button className="pay-btn" type="submit" disabled={loading}>
              {loading ? "Processing Payment..." : `Pay ₹${total}`}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default PaymentPage;

