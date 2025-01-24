import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./LoginModal.css";

const LoginModal = ({ closeModal }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username, // Ensure backend accepts this field name
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Login successful!");
        // Save the authentication token in localStorage
        localStorage.setItem("authToken", data.access); // Save the access token
        localStorage.setItem("refreshToken", data.refresh);
        localStorage.setItem("username", username);
        console.log(username);
        
        // Redirect to dashboard after successful login
        navigate("/dashboard");
        closeModal(); // Close the modal on success
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
   
    <div className="login-modal">
      <div className="login-content">
        <h2>Login</h2>
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
        <button className="btn-login" onClick={handleLogin}>
          Login
        </button>
        {message && <p className="message">{message}</p>}
        {/* <button className="btn-close" onClick={closeModal}>
          Close
        </button> */}
         <button className="btn-back-to-home" onClick={handleBackToHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
