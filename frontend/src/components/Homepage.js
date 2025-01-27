import React from "react";
import "./Homepage.css";
import stampingImage from "../images/DocumentStamp.jpg";

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      
      <div className="container hero py-5">
        <div className="row align-items-center">
          {/* Hero Text - Left Side */}
          <div className="col-lg-6 hero-text text-center text-lg-start mb-4 mb-lg-0">
            <h1 className="display-4 mb-4">
              Document Stamping: The Future of Authentication
            </h1>
            
            <p className="lead mb-4">
              The Digital Stamping System is a cutting-edge solution designed to
              replace traditional physical stamps with an efficient, secure, and
              scalable platform for electronic document authentication. Whether
              you're an individual, small business, or large organization, our
              system makes document stamping fast, simple, and fully traceable.
              
            </p>
            
            <div className="hero-buttons">
              <button className="btn btn-primary me-3">Get Started</button>
              <button className="btn btn-outline-primary">Learn More</button>
            </div>
          </div>

          {/* Hero Image - Right Side */}
         
         
        </div>
        
       
      </div>
      

      {/* Services Section */}
      <div className="services bg-light py-5" id="services">
        <div className="container">
          <h2 className="text-center text-primary mb-4">Our Services</h2>
          <p className="text-center mb-4">
            We offer a range of services to help businesses and individuals
            authenticate their documents efficiently and securely. Our platform
            provides the following services:
          </p>

          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            <div className="col">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Digital Document Stamping</h5>
                  <p className="card-text">
                    Authenticate your documents digitally with our secure
                    stamping system.
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Customizable Stamp Designs</h5>
                  <p className="card-text">
                    Create custom stamps for your business or personal use with
                    ease.
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Bulk Document Authentication</h5>
                  <p className="card-text">
                    Authenticate multiple documents at once with our bulk
                    authentication feature.
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Secure Document Archiving</h5>
                  <p className="card-text">
                    Store and manage your documents securely with our
                    platform's archiving feature.
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Real-time Audit Logs</h5>
                  <p className="card-text">
                    Track every document's activity with detailed audit logs
                    for security and compliance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
