import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginModal.css";
import Logo from "../images/Logo.png";

const LoginModal = ({ closeModal }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Login successful!");
        localStorage.setItem("authToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        localStorage.setItem("username", username);
        navigate("/dashboard");
        closeModal();
      } else {
        setMessage(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  const handleBackToHome = () => {
    navigate("/"); // Navigate to the homepage
  };

  return (
    <div className="login-container">
      <div className="login-info">
        <h1>Digital Stamping System</h1>
        <p>Access your digital stamps and manage your business efficiently!</p>
      </div>

      <div className="login-form">
        {/* Logo */}
        <img
          src={Logo} // Replace with the actual path to your logo
          alt="Logo"
          className="register-logo"
        />
        <h2>Login To Your Account</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {message && <p className="message">{message}</p>}
        <button className="btn-login" onClick={handleLogin}>
          Login
        </button>
        <button className="btn-back-to-home" onClick={handleBackToHome}>
          Back to Home
        </button>
        <p>
          Don't have an account?{" "}
          <button onClick={() => navigate("/register")}>Sign Up</button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
