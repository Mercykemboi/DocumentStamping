// import React from "react";
// import { Link } from "react-router-dom";

// function Navbar() {
//   return (
//     <nav style={styles.nav}>
//       <h1 style={styles.logo}>Document Stamping</h1>
//       <ul style={styles.navLinks}>
//       <li>
//           <Link to="/register" style={styles.link}>About Us</Link>
//         </li>
//         <li>
//           <Link to="/register" style={styles.link}>Contact Us</Link>
//         </li>
//         <li>
//           <Link to="/register" style={styles.link}>Register</Link>
//         </li>
//         <li>
//           <Link to="/login" style={styles.link}>Login</Link>
//         </li>
//       </ul>
//     </nav>
//   );
// }

// const styles = {
//   nav: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "1rem",
//     backgroundColor: "#007BFF",
//     color: "#FFF",
//   },
//   logo: { margin: 0 },
//   navLinks: { listStyle: "none", display: "flex", gap: "1rem", margin: 0, padding: 0 },
//   link: { color: "#FFF", textDecoration: "none" },
// };

// export default Navbar;
import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={styles.nav}>
      <h1 style={styles.logo}>Document Stamping</h1>
      <ul style={styles.navLinks}>
        <li>
          <Link to="/about-us" style={styles.link}>About Us</Link> {/* Change link to appropriate route */}
        </li>
        <li>
          <Link to="/contact-us" style={styles.link}>Contact Us</Link> {/* Change link to appropriate route */}
        </li>
        <li>
          <Link to="/register" style={styles.link}>Register</Link>
        </li>
        <li>
          <Link to="/login" style={styles.link}>Login</Link>
        </li>
      </ul>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    backgroundColor: "#007BFF",
    color: "#FFF",
  },
  logo: { margin: 0 },
  navLinks: { 
    listStyle: "none", 
    display: "flex", 
    gap: "3rem", // Adjust this value to control the spacing between links
    margin: 0, 
    padding: 0 
  },
  link: { 
    color: "#FFF", 
    textDecoration: "none" 
  },
};

export default Navbar;
