import React, { useState } from "react";
import "./Newsletter.css";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube
} from "react-icons/fa";

export default function Newsletter() {

  const [email, setEmail] = useState("");


  const handleSubscribe = async (e) => {

    e.preventDefault();

    if (!email) {

      alert("Please enter your email");

      return;

    }

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/subscribe-newsletter/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: email
          })
        }
      );

      const data = await response.json();

      alert(data.message);

      setEmail(""); // clear input

    }

    catch (error) {

      console.log(error);

      alert("Server error. Try again later.");

    }

  };


  return (

    <footer className="eventease-footer">

      <div className="footer-inner">


        {/* Newsletter Column */}

        <div className="footer-col newsletter-col">

          <h2 className="footer-title">

            Stay Updated on New Events

          </h2>

          <p className="footer-sub">

            Subscribe to receive the latest event updates and exclusive offers.

          </p>


          <form
            className="newsletter-form"
            onSubmit={handleSubscribe}
          >

            <input

              type="email"

              placeholder="Enter your email"

              value={email}

              onChange={(e) =>
                setEmail(e.target.value)
              }

              required

            />


            <button type="submit">

              Subscribe

            </button>

          </form>

        </div>


        {/* Contact Column */}

        <div className="footer-col contact-col">

          <h3 className="footer-title small">

            Contact Us

          </h3>

          <p className="contact-line">

            Email: eventease.project@gmail.com

          </p>

          <p className="contact-line">

            Phone: +91 xxxxxxxxxx

          </p>

          <p className="contact-line">

            Location: Kerala

          </p>

        </div>


        {/* Quick Links Column */}

        <div className="footer-col nav-col">

          <h3 className="footer-title small">

            Quick Links

          </h3>

          <ul className="footer-links">

            <li>

              <a href="#events">

                Events

              </a>

            </li>

            <li>

              <a href="#">

                About Us

              </a>

            </li>

            <li>

              <a href="#">

                Partners

              </a>

            </li>

            <li>

              <a href="#">

                Contact

              </a>

            </li>

          </ul>

        </div>


        {/* Social Column */}

        <div className="footer-col social-col">

          <h3 className="footer-title small">

            Follow Us

          </h3>

          <p className="footer-sub">

            Stay connected - find us on social

          </p>

          <div className="social-icons">

            <a href="#">

              <FaFacebook />

            </a>

            <a href="#">

              <FaInstagram />

            </a>

            <a href="#">

              <FaTwitter />

            </a>

            <a href="#">

              <FaYoutube />

            </a>

          </div>

        </div>

      </div>


      {/* Footer Bottom */}

      <div className="footer-bottom">

        <p>

          © 2025 EventEase - All Rights Reserved

        </p>

      </div>

    </footer>

  );

}