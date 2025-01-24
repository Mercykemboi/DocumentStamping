import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Dashboard from "./components/dashboard";
import DocumentView from "./components/viewDoc";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/Register";
import AboutUs from "./components/aboutUs";
import StampPage from "./components/stamp";


// Authentication check
const isAuthenticated = () => !!localStorage.getItem("authToken");

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Landing Page Route */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Hero />
              <Footer />
            </>
          }
        />

        {/* Register Page */}
        <Route path="/register" element={<RegisterModal />} />

        {/* Login Page */}
        <Route path="/login" element={<LoginModal />} />
        <Route path="/about" element={<AboutUs />} />

        {/* Dashboard Route */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        />
         <Route
          path="/stamp"
          element={<ProtectedRoute element={<StampPage />} />}
        />
        


        {/* Document View Route */}
        <Route
          path="/document/:id"
          element={<ProtectedRoute element={<DocumentView />} />}
        />

        {/* 404 Error Page */}
        <Route
          path="*"
          element={<div style={{ padding: "20px", textAlign: "center" }}>Page Not Found</div>}
        />
      </Routes>
    </Router>
  );
};

export default App;
