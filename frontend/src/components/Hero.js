import React from "react";
import "./Hero.css";
import stampingImage from "../images/DocumentStamp.jpg";

const Hero = () => {
  return (
    <div className="hero">
      {/* Hero Section */}
      <div className="hero-text">
        <h1>Document Stamping: The Future of Authentication</h1>
        <p>
          The Digital Stamping System is a cutting-edge solution designed to
          replace traditional physical stamps with an efficient, secure, and
          scalable platform for electronic document authentication. Whether you're
          an individual, small business, or large organization, our system makes
          document stamping fast, simple, and fully traceable.
        </p>
        
        <div className="hero-buttons">
          <button className="btn-primary">Get Started</button>
          <button className="btn-secondary">Learn More</button>
        </div>
      </div>
      <div className="hero-image">
        <img src={stampingImage} alt="Document Stamping Illustration" />
      </div>

      {/* About Us Section */}
      {/* <div className="about-us" id="about-us">
        <h2>About Us</h2>
        <p>
          At Document Stamping, we are committed to providing a seamless and
          secure solution for document authentication. Our innovative platform
          ensures that your documents are protected, traceable, and compliant with
          global standards.
        </p>
        <p>
          Whether you're streamlining operations or enhancing security, we are
          here to empower you with a reliable system built for the future.
        </p>
      </div> */}
      <div className="services" id="services">
  <h2>Our Services</h2>
  <p>
    We offer a range of services to help businesses and individuals authenticate their documents efficiently and securely. Our platform provides the following services:
  </p>
  <div className="services-container">
    <div className="service-card">
      <h3>Digital Document Stamping</h3>
      <p>Authenticate your documents digitally with our secure stamping system.</p>
    </div>
    <div className="service-card">
      <h3>Customizable Stamp Designs</h3>
      <p>Create custom stamps for your business or personal use with ease.</p>
    </div>
    <div className="service-card">
      <h3>Bulk Document Authentication</h3>
      <p>Authenticate multiple documents at once with our bulk authentication feature.</p>
    </div>
    <div className="service-card">
      <h3>Secure Document Archiving</h3>
      <p>Store and manage your documents securely with our platform's archiving feature.</p>
    </div>
    <div className="service-card">
      <h3>Real-time Audit Logs</h3>
      <p>Track every document's activity with detailed audit logs for security and compliance.</p>
    </div>
  </div>
</div>



      {/* Contact Us Section */}
      {/* <div className="contact-us" id="contact-us">
        <h2>Contact Us</h2>
        <p>We'd love to hear from you! Feel free to reach out to us through any of the channels below:</p>
        <ul>
          <li>Email: support@documentstamping.com</li>
          <li>Phone: +1 (555) 123-4567</li>
          <li>Address: 123 Document Lane, Secure City, SC 56789</li>
        </ul>
        <form className="contact-form">
          <input type="text" placeholder="Your Name" />
          <input type="email" placeholder="Your Email" />
          <textarea placeholder="Your Message"></textarea>
          <button className="btn-submit" type="submit">Send Message</button>
        </form>
      </div> */}
    </div>
  );
};

export default Hero;
