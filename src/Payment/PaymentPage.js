import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import PageHeader from "../PageHeader/PageHeader";
import "./PaymentPage.css";
import API_BASE_URL from "../api";
import { useToast } from "../components/Toast";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();

  const event = location.state?.event;
  const tickets = location.state?.tickets;
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "EventEase | Payment";
  }, []);

  if (!event || !tickets) {
    return (
      <div style={{ textAlign: "center", marginTop: "120px", color: "white" }}>
        <h2>No booking data found</h2>
        <p>Please select an event first.</p>
        <button onClick={() => navigate("/")} style={{ marginTop: "20px", padding: "10px 20px", border: "none", background: "#ff2f92", color: "#fff", borderRadius: "6px", cursor: "pointer" }}>
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
      showToast("Please login first", "error");
      navigate("/auth");
      return;
    }
    if (paymentMethod === "card") {
      if (!cardNumber || cardNumber.length < 16) { showToast("Enter a valid 16-digit card number", "error"); return; }
      if (!name || !expiry || !cvv) { showToast("Please fill all card details", "error"); return; }
    }
    if (paymentMethod === "upi") {
      if (!upiId) { showToast("Please enter your UPI ID", "error"); return; }
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await axios.post(`${API_BASE_URL}/api/create-booking/`, {
        user_id: userId,
        event_id: event.id,
        tickets: tickets
      });
      showToast("Payment successful! Redirecting...", "success");
      setTimeout(() => navigate("/booking-success", { state: { event, tickets, total } }), 1500);
    } catch (error) {
      if (error.response && error.response.data.error) {
        showToast(error.response.data.error, "error");
      } else {
        showToast("Payment failed. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <ToastContainer />
      <PageHeader title="Payment" subtitle={event.title} />

      {/* Demo banner */}
      <div className="demo-banner">
        🔒 Demo Mode — This is a simulated payment. No real money will be charged.
      </div>

      <div className="booking-steps">
        <div className="step completed"><div className="step-circle">✓</div><p>Tickets</p></div>
        <div className="step-line active"></div>
        <div className="step active"><div className="step-circle">2</div><p>Payment</p></div>
        <div className="step-line"></div>
        <div className="step"><div className="step-circle">3</div><p>Confirmation</p></div>
      </div>

      <div className="payment-container">
        <div className="payment-sidebar">
          <h3>Payment Method</h3>
          <button className={paymentMethod === "card" ? "method active" : "method"} onClick={() => setPaymentMethod("card")}>💳 Card Payment</button>
          <button className={paymentMethod === "upi" ? "method active" : "method"} onClick={() => setPaymentMethod("upi")}>📱 UPI Payment</button>
        </div>

        <div className="payment-card">
          <h2>Secure Payment</h2>
          <div className="payment-summary">
            <p><strong>Event:</strong> {event.title}</p>
            <p><strong>Tickets:</strong> {tickets}</p>
            <p className="total">Total: ₹{total}</p>
          </div>

          <form onSubmit={handlePayment}>
            {paymentMethod === "card" && (
              <>
                <input type="text" placeholder="Card Number (16 digits)" value={cardNumber} maxLength={16} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))} />
                <input type="text" placeholder="Name on Card" value={name} onChange={(e) => setName(e.target.value)} />
                <div className="card-row">
                  <input type="text" placeholder="MM/YY" value={expiry} maxLength={5} onChange={(e) => setExpiry(e.target.value)} />
                  <input type="password" placeholder="CVV" value={cvv} maxLength={3} onChange={(e) => setCvv(e.target.value)} />
                </div>
              </>
            )}
            {paymentMethod === "upi" && (
              <div className="upi-section">
                <div className="upi-qr">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay" alt="UPI QR" />
                </div>
                <p className="or-text">OR</p>
                <input type="text" placeholder="Enter UPI ID (example@upi)" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
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
