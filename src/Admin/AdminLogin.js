import React, { useState } from "react";
import axios from "axios";
import PageHeader from "../PageHeader/PageHeader";
import "./AdminLogin.css";

function AdminLogin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://127.0.0.1:8000/api/admin-login/",
        {
          email: email,
          password: password
        }
      );

      if (res.data.role === "admin") {

        localStorage.setItem("admin_id", res.data.admin_id);

        alert("Admin login successful ✅");

        window.location.href = "/admin-dashboard";

      } else {

        alert("Access denied ❌ Not an admin");

      }

    } catch {

      alert("Invalid admin credentials ❌");

    }

  };

  return (

    <div className="admin-login-page">

      <PageHeader
        title="Admin Access Portal"
        subtitle="Securely manage users, organizers, and events inside EventEase"
      />

      <div className="admin-login-container">

        <div className="admin-login-card">

          <h2>Admin Login</h2>

          <p className="subtitle">
            Enter your credentials to continue
          </p>

          <form onSubmit={handleLogin}>

            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />

            <button type="submit">
              Login
            </button>

          </form>

          {/* Demo Credentials Section */}

          <div className="demo-admin-box">

            <p className="demo-title">
              Demo Admin Access
            </p>

            <p className="demo-credentials">
              eventease.project@gmail.com
            </p>

            <p className="demo-credentials">
              EventEase@2026!
            </p>

          </div>

        </div>

      </div>

    </div>

  );
}

export default AdminLogin;