import React, { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";

const RegisterModal = ({ closeModal, openLogin }) => {
  // State to store form inputs
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Function to handle form submission
  const handleRegister = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful!");
        localStorage.setItem("username", data.username);
        console.log(data,username);
        navigate("/login");
        // closeModal(); 
        // Close modal after successful registration
        // openLogin(); // Redirect to Login modal (optional)
      } else {
        setMessage(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setMessage("An error occurred. Please try again.");
    }
  };
  const handleBackToHome = () => {
    navigate("/"); // Navigate to the homepage
  };

  return (
    <div className="register-modal">
      <div className="register-content">
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn-register" onClick={handleRegister}>
          Register
        </button>
        {message && <p className="message">{message}</p>}
        <p>
          Already have an account?{" "}
          <button className="btn-login-redirect" onClick={() => navigate("/login")}>
            Login
          </button>
          
        </p>
        {/* Back to Home Button */}
        <button className="btn-back-to-home" onClick={handleBackToHome}>
          Back to Home
        </button>
        {/* <button className="btn-close" onClick={closeModal}>
          Close
        </button> */}
      </div>
    </div>
  );
};

export default RegisterModal;
