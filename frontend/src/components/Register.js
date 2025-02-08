import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import Logo from "../images/Logo.png";

const RegisterModal = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("individual"); // User type: individual or company
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState(null); // Store user ID for OTP verification
  const [message, setMessage] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Register User and Send OTP
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
          user_type: userType, // Sending user type
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("OTP sent to your email. Please verify.");
        setUserId(data.user.id); // Store user ID for OTP verification
        setIsOtpSent(true); // Show OTP input field
      } else {
        setMessage(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/verify-otp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId, // Send stored user ID
          otp_code: otp,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("OTP verified successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000); // Redirect after success
      } else {
        setMessage(data.error || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  // Back to Home
  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="register-container">
      {/* Left Section */}
      <div className="register-info">
        <h1>Digital Stamping System</h1>
        <p>
          Secure your business with digital stamping. Fast, efficient, and scalable document verification.
        </p>
      </div>

      {/* Right Section */}
      <div className="register-form">
        {/* Logo */}
        <img src={Logo} alt="Logo" className="register-logo" />
        <h2>Create Account</h2>

        {/* User Type Selection */}
        <div className="role-toggle">
          <label>
            <input
              type="radio"
              value="individual"
              checked={userType === "individual"}
              onChange={() => setUserType("individual")}
            />
            Individual
          </label>
          <label>
            <input
              type="radio"
              value="company"
              checked={userType === "company"}
              onChange={() => setUserType("company")}
            />
            Company
          </label>
        </div>

        {!isOtpSent ? (
          <>
            <input
              type="text"
              placeholder="Username"
              className="inputUser"
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
            <button className="register-btn" onClick={handleRegister}>
              Register
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button className="register-btn" onClick={handleVerifyOTP}>
              Verify OTP
            </button>
          </>
        )}

        {message && <p className="message">{message}</p>}

        <p>
          Already have an account?{" "}
          <button onClick={() => navigate("/login")}>Log In</button>
        </p>
        <button className="btn-back-to-home" onClick={handleBackToHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default RegisterModal;
