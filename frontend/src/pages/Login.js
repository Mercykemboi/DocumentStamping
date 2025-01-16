// // import React from "react";

// // function Login() {
// //   return (
// //     <div style={styles.container}>
// //       <h2>Login</h2>
// //       <form>
// //         <input type="text" placeholder="Username" style={styles.input} />
// //         <input type="password" placeholder="Password" style={styles.input} />
// //         <button type="submit" style={styles.button}>Login</button>
// //       </form>
// //     </div>
// //   );
// // }

// // const styles = {
// //   container: { textAlign: "center", marginTop: "2rem" },
// //   input: { display: "block", margin: "1rem auto", padding: "0.5rem", width: "80%" },
// //   button: {
// //     padding: "0.5rem 1rem",
// //     backgroundColor: "#007BFF",
// //     color: "#FFF",
// //     border: "none",
// //     borderRadius: "4px",
// //     cursor: "pointer",
// //   },
// // };

// // export default Login;
// import React, { useState } from "react";
// import API from "../api"; // Your API instance with base URL

// function Login() {
//   const [formData, setFormData] = useState({ username: "", password: "" });
//   const [message, setMessage] = useState(""); // To display messages
//   const [loading, setLoading] = useState(false); // To handle loading state

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await API.post("/login/", formData);
//       if (response.status === 200) {
//         localStorage.setItem("access_token", response.data.access_token); // Store token
//         setMessage("Login successful!");
//         // Optionally, redirect user to a dashboard or homepage
//         window.location.href = "/dashboard"; // Change to your route
//       } else {
//         setMessage("Invalid credentials.");
//       }
//     } catch (error) {
//       setMessage("Error: " + (error.response?.data?.detail || "Login failed."));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit} style={styles.form}>
//         <input
//           type="text"
//           name="username"
//           placeholder="Username"
//           value={formData.username}
//           onChange={handleChange}
//           style={styles.input}
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           style={styles.input}
//           required
//         />
//         <button type="submit" style={styles.button} disabled={loading}>
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//       {message && <p style={styles.message}>{message}</p>}
//     </div>
//   );
// }

// const styles = {
//   container: {
//     textAlign: "center",
//     marginTop: "2rem",
//     padding: "2rem",
//     backgroundColor: "#f8f9fa",
//     borderRadius: "8px",
//     width: "100%",
//     maxWidth: "400px",
//     boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "1rem",
//   },
//   input: {
//     display: "block",
//     margin: "1rem auto",
//     padding: "0.8rem",
//     width: "80%",
//     borderRadius: "4px",
//     border: "1px solid #ced4da",
//   },
//   button: {
//     padding: "0.8rem",
//     fontSize: "1rem",
//     backgroundColor: "#007BFF",
//     color: "#FFF",
//     border: "none",
//     borderRadius: "4px",
//     cursor: "pointer",
//     transition: "background-color 0.3s",
//   },
//   message: {
//     marginTop: "1rem",
//     fontSize: "1rem",
//     color: "#28a745", // Green for success
//   },
// };

// export default Login;
import React, { useState } from "react";
import API from "../api"; // Your API instance with base URL

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState(""); // To display messages
  const [loading, setLoading] = useState(false); // To handle loading state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await API.post("/login/", formData);
      if (response.status === 200) {
        localStorage.setItem("access_token", response.data.access_token); // Store token
        setMessage("Login successful!");
        // Optionally, redirect user to a dashboard or homepage
        window.location.href = "/dashboard"; // Change to your route
      } else {
        setMessage("Invalid credentials.");
      }
    } catch (error) {
      setMessage("Error: " + (error.response?.data?.detail || "Login failed."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // Full height of the viewport
    backgroundColor: "#f8f9fa",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "2rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px", // Limit the card's max width
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
    display: "block",
    margin: "1rem auto",
    padding: "0.8rem",
    width: "80%",
    borderRadius: "4px",
    border: "1px solid #ced4da",
  },
  button: {
    padding: "0.8rem",
    fontSize: "1rem",
    backgroundColor: "#007BFF",
    color: "#FFF",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  message: {
    marginTop: "1rem",
    fontSize: "1rem",
    color: "#28a745", // Green for success
  },
};

export default Login;
