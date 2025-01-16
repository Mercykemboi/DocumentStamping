
import React, { useState } from "react";
import API from "../api";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await API.post("/register/", formData);
  //     if (response.status === 201) {
  //       setMessage("Registration successful! Welcome, " + formData.username);
  //     } else {
  //       setMessage("Unexpected response from the server.");
  //     }
  //   } catch (error) {
  //     setMessage("Error: " + (error.response?.data?.detail || "Registration failed."));
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await API.post("/register/", {
  //       username: formData.username,
  //       email: formData.email,
  //       password: formData.password,
  //     });
  
  //     if (response.status === 201) {
  //       setMessage("Registration successful!");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     setMessage("Error: " + (error.response?.data?.detail || "Registration failed."));
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/register/", {
        username: formData.username,
        email: formData.email,  // Assuming email is required
        password: formData.password,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 201) {
        setMessage("Registration successful!");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error: " + (error.response?.data?.detail || "Registration failed."));
    }
  };
  
  
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Register</button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "2rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  title: {
    marginBottom: "1.5rem",
    fontSize: "1.8rem",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.8rem",
    fontSize: "1rem",
    border: "1px solid #ced4da",
    borderRadius: "4px",
  },
  button: {
    padding: "0.8rem",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  message: {
    marginTop: "1rem",
    fontSize: "1rem",
    color: "#28a745",
  },
};

export default Register;
