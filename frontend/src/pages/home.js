// // import React from "react";

// // function Home() {
// //   return (
// //     <div style={styles.container}>
// //       <div style={styles.overlay}>
// //         <div style={styles.header}>
         
// //         </div>
// //         <div style={styles.content}>
// //           <h1 style={styles.title}>Welcome to DocStamp!</h1>
// //           <p style={styles.description}>
// //             Manage, upload, and securely stamp your documents with ease.
// //           </p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // const styles = {
// //   container: {
// //     height: "80vh", // Full screen height
// //     display: "flex",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     backgroundImage:
// //       "url('https://plus.unsplash.com/premium_photo-1661549683908-b11e9855c469?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZG9jdW1lbnQlMjBzdGFtcGluZ3xlbnwwfHwwfHx8MA%3D%3D')",
// //     backgroundSize: "cover",
// //     backgroundPosition: "center",
// //     color: "#fff", // White text color
// //     position: "relative", // For positioning header buttons
// //   },
// //   overlay: {
// //     position: "absolute",
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay for contrast
// //     display: "flex",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     flexDirection: "column", // Ensure content is centered vertically
// //   },
// //   header: {
// //     position: "absolute",
// //     top: "20px", // Place buttons at the top
// //     left: "20px", // Position buttons to the left
// //     display: "flex",
// //     flexDirection: "column", // Stack buttons vertically
// //     gap: "10px", // Space between buttons
// //   },
// //   navButton: {
// //     padding: "0.8rem 1.5rem",
// //     backgroundColor: "#007BFF",
// //     color: "#FFF",
// //     border: "none",
// //     borderRadius: "4px",
// //     cursor: "pointer",
// //     fontSize: "1rem",
// //     transition: "background-color 0.3s ease",
// //   },
// //   content: {
// //     textAlign: "center",
// //     color: "#fff",
// //     fontFamily: "Arial, sans-serif",
// //     maxWidth: "600px",
// //     width: "100%",
// //     padding: "20px",
// //     backgroundColor: "rgba(0, 0, 0, 0.6)", // Slightly darker background for readability
// //     borderRadius: "8px",
// //   },
// //   title: {
// //     fontSize: "3rem",
// //     marginBottom: "20px",
// //     fontWeight: "bold",
// //   },
// //   description: {
// //     fontSize: "1.2rem",
// //     marginBottom: "30px",
// //     lineHeight: "1.6",
// //   },
// // };

// // export default Home;
// import React from "react";

// function Home() {
//   return (
//     <div style={styles.container}>
//       <div style={styles.overlay}>
//         {/* Header for navigation buttons */}
//         <div style={styles.header}>
//           <button style={styles.navButton}>About Us</button>
//           <button style={styles.navButton}>Contact Us</button>
//           <button style={styles.navButton}>Register</button>
//           <button style={styles.navButton}>Login</button>
//         </div>
//         <div style={styles.content}>
//           <h1 style={styles.title}>Welcome to DocStamp!</h1>
//           <p style={styles.description}>
//             Manage, upload, and securely stamp your documents with ease.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     height: "100vh", // Full viewport height
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundImage:
//       "url('https://plus.unsplash.com/premium_photo-1661549683908-b11e9855c469?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZG9jdW1lbnQlMjBzdGFtcGluZ3xlbnwwfHwwfHx8MA%3D%3D')",
//     backgroundSize: "cover", // Ensures the image covers the entire container
//     backgroundPosition: "center", // Centers the background image
//     backgroundRepeat: "no-repeat", // Prevents tiling of the image
//     position: "relative", // Enables absolute positioning for children
//   },
//   overlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay for contrast
//     display: "flex",
//     flexDirection: "column", // Stack items vertically
//     justifyContent: "center", // Center items vertically
//     alignItems: "center", // Center items horizontally
//   },
//   header: {
//     position: "absolute",
//     top: "20px",
//     left: "20px",
//     display: "flex",
//     flexDirection: "column",
//     gap: "10px",
//   },
//   navButton: {
//     padding: "0.8rem 1.5rem",
//     backgroundColor: "#007BFF",
//     color: "#FFF",
//     border: "none",
//     borderRadius: "4px",
//     cursor: "pointer",
//     fontSize: "1rem",
//   },
//   content: {
//     textAlign: "center",
//     color: "#fff",
//     fontFamily: "Arial, sans-serif",
//     maxWidth: "600px",
//     width: "100%",
//     padding: "20px",
//     backgroundColor: "rgba(0, 0, 0, 0.6)", // Slightly darker background for readability
//     borderRadius: "8px",
//   },
//   title: {
//     fontSize: "3rem",
//     marginBottom: "20px",
//     fontWeight: "bold",
//   },
//   description: {
//     fontSize: "1.2rem",
//     marginBottom: "30px",
//     lineHeight: "1.6",
//   },
// };

// export default Home;
import React from "react";

function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        {/* Header for navigation buttons */}
        {/* <div style={styles.header}>
          <button style={styles.navButton}>About Us</button>
          <button style={styles.navButton}>Contact Us</button>
          <button style={styles.navButton}>Register</button>
          <button style={styles.navButton}>Login</button>
        </div> */}
        <div style={styles.content}>
          <h1 style={styles.title}>Welcome to DocStamp!</h1>
          <p style={styles.description}>
            Manage, upload, and securely stamp your documents with ease.
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh", // Full viewport height
    width: "100vw", // Full viewport width
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage:
      "url('https://plus.unsplash.com/premium_photo-1661549683908-b11e9855c469?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZG9jdW1lbnQlMjBzdGFtcGluZ3xlbnwwfHwwfHx8MA%3D%3D')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay for contrast
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem", // Add padding for smaller screens
  },
  header: {
    position: "absolute",
    top: "20px",
    left: "20px",
    display: "flex",
    flexWrap: "wrap", // Ensure buttons wrap on smaller screens
    gap: "10px",
  },
  navButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#007BFF",
    color: "#FFF",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    textAlign: "center",
  },
  content: {
    textAlign: "center",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
    maxWidth: "600px",
    width: "90%", // Responsive width
    padding: "20px",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: "8px",
  },
  title: {
    fontSize: "2.5rem", // Responsive title size
    marginBottom: "20px",
    fontWeight: "bold",
  },
  description: {
    fontSize: "1.2rem",
    marginBottom: "30px",
    lineHeight: "1.6",
  },
};

export default Home;
