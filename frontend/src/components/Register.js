import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import Logo from "../images/Logo.png";

const RegisterModal = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");


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
    <div className="register-container">
      {/* Left Section */}
      <div className="register-info">
     
      <h1>Digital Stamping System</h1>
<p>
  Transform your business with our Digital Stamping System. Secure, efficient, and scalable, 
  our platform allows you to verify and track your documents digitally, anytime, anywhere.
</p>
<div className="testimonial">
  <p>
    "The Digital Stamping System has revolutionized the way we handle document verification. 
    It's quick, reliable, and has saved us countless hours of manual work. A must-have tool for any business!"
  </p>

</div>

      </div>

      {/* Right Section */}
      <div className="register-form">
         {/* Logo */}
         <img
          src={Logo} // Replace with the actual path to your logo
          alt="Logo"
          className="register-logo"
        />
        <h2>Create Account</h2>
        <div className="role-toggle">
          
          
        </div>
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
        <div className="privacy-policy">
          <input type="checkbox" id="privacy" />
          <label htmlFor="privacy">I accept the Privacy Policy</label>
        </div>

        <button className="register-btn" onClick={handleRegister}>
          Create an Account
        </button>
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
