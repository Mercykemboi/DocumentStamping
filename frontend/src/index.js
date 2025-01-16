// import React from "react";
// import ReactDOM from "react-dom";
// import App from "./App";

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById("root") // Ensure your public/index.html has this "root" div
// );
import React from "react";
import ReactDOM from "react-dom/client"; // Updated import for React 18
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")); // Ensure "root" div exists in index.html
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
