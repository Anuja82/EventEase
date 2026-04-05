import React, { useState } from "react";
import "./User.css";
import { useNavigate } from "react-router-dom";
import PageHeader from "../PageHeader/PageHeader";

function User() {

  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);

  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [role, setRole] = useState("user");

  const [showModal, setShowModal] = useState(false);

  const [resetEmail, setResetEmail] = useState("");


  const handleSubmit = async (e) => {

    e.preventDefault();

    const url = isSignup
      ? "http://127.0.0.1:8000/api/register/"
      : "http://127.0.0.1:8000/api/login/";

    const bodyData = isSignup
      ? {
          username,
          email,
          password,
          confirm_password: confirmPassword,
          role
        }
      : {
          email,
          password
        };

    try {

      const response = await fetch(url, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(bodyData)

      });

      const data = await response.json();

      if (response.ok) {

        localStorage.setItem("user_id", data.user_id);

        localStorage.setItem("user_email", data.email);

        localStorage.setItem("username", data.username);

        localStorage.setItem("role", data.role);

        alert(data.message);


        if (!isSignup) {

          if (data.role === "organizer") {

            navigate("/organizer-dashboard");

          }

          else if (data.role === "user") {

            navigate("/dashboard");

          }

          else if (data.role === "admin") {

            navigate("/admin-dashboard");

          }

        }


        setUsername("");

        setEmail("");

        setPassword("");

        setConfirmPassword("");

      }

      else {

        alert(data.error || "Something went wrong");

      }

    }

    catch {

      alert("Server error");

    }

  };


  const handleForgotPassword = async () => {

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/forgot-password/",
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: resetEmail
          })

        }
      );

      const data = await response.json();

      alert(data.message || data.error);

      setShowModal(false);

      setResetEmail("");

    }

    catch {

      alert("Server error");

    }

  };


  return (

    <>

      <PageHeader

        title="Create Your EventEase Account"

        subtitle="Join EventEase to discover exciting events, save favorites, and never miss important updates"
      />


      <div className="auth-wrapper">

        <div className="auth-card">

          <h2>

            {isSignup ? "Signup Form" : "Login Form"}

          </h2>


          <div className="auth-toggle">

            <button

              className={!isSignup ? "active" : ""}

              onClick={() => setIsSignup(false)}

            >

              Login

            </button>


            <button

              className={isSignup ? "active" : ""}

              onClick={() => setIsSignup(true)}

            >

              Signup

            </button>

          </div>


          <form onSubmit={handleSubmit}>

            {isSignup && (

              <input

                type="text"

                placeholder="Enter username"

                value={username}

                onChange={(e) =>
                  setUsername(e.target.value)
                }

              />

            )}


            <input

              type="email"

              placeholder="Enter email"

              value={email}

              onChange={(e) =>
                setEmail(e.target.value)
              }

            />


            <input

              type="password"

              placeholder="Enter password"

              value={password}

              onChange={(e) =>
                setPassword(e.target.value)
              }

            />


            {isSignup && (

              <>

                <input

                  type="password"

                  placeholder="Confirm password"

                  value={confirmPassword}

                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }

                />


                <div className="role-section">

                  <p className="role-title">

                    Register As

                  </p>


                  <div className="role-toggle">

                    <button

                      type="button"

                      className={`role-btn ${
                        role === "user"
                          ? "active-role"
                          : ""
                      }`}

                      onClick={() =>
                        setRole("user")
                      }

                    >
                      {role === "user" && "✓ "}

                      User

                    </button>


                    <button

                      type="button"

                      className={`role-btn ${
                        role === "organizer"
                          ? "active-role"
                          : ""
                      }`}

                      onClick={() =>
                        setRole("organizer")
                      }

                    >
                      {role === "organizer" && "✓ "}

                      Organizer

                    </button>

                  </div>

                </div>

              </>

            )}


            {!isSignup && (

              <p

                className="forgot"

                onClick={() =>
                  setShowModal(true)
                }

              >

                Forgot Password?

              </p>

            )}


            <button type="submit" className="submit-btn">

              {isSignup ? "Signup" : "Login"}

            </button>

          </form>


          {/* RESTORED SWITCH TEXT */}

          {isSignup ? (

            <p className="switch-text">

              Already a member?{" "}

              <span onClick={() => setIsSignup(false)}>

                Login

              </span>

            </p>

          ) : (

            <p className="switch-text">

              Not a member?{" "}

              <span onClick={() => setIsSignup(true)}>

                Signup now

              </span>

            </p>

          )}

        </div>

      </div>


      {showModal && (

        <div className="modal-overlay">

          <div className="modal-box">

            <h3>Reset Password</h3>


            <input

              type="email"

              placeholder="Enter your email"

              value={resetEmail}

              onChange={(e) =>
                setResetEmail(e.target.value)
              }

            />


            <button onClick={handleForgotPassword}>

              Send Reset Link

            </button>


            <button

              onClick={() =>
                setShowModal(false)
              }

            >

              Cancel

            </button>

          </div>

        </div>

      )}

    </>

  );

}

export default User;