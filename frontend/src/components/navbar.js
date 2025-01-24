import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate("/")}>
        Document Stamping
      </div>

      <div className="navbar-menu-container">
        <ul className="navbar-menu">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
          <a href="#about-us">About Us</a>
          </li>
          <li>
          <a href="#services">Services</a>
          </li>
          <li>
          <a href="#contact-us">Contact Us</a>
          </li>
        </ul>
      </div>

      <div className="auth-buttons">
        <button className="btn-register" onClick={() => navigate("/register")}>
          Register
        </button>
        <button className="btn-login" onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
