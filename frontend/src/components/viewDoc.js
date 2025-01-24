
// // import React, { useEffect, useRef, useState } from "react";
// // import { useParams, useNavigate,data } from "react-router-dom";

// // const DocumentViewer = () => {
// //   const { id } = useParams(); // Get the document ID from the URL
// //   const navigate = useNavigate();
// //   const [documentUrl, setDocumentUrl] = useState("");
// //   const canvasRef = useRef(null);

// //   // State for the stamp's position
// //   const [stampPosition, setStampPosition] = useState({ x: 50, y: 50 });
// //   const [isDragging, setIsDragging] = useState(false);

// //   // Fetch the document details
// //   useEffect(() => {
// //     const fetchDocument = async () => {
// //       try {
// //         const response = await fetch(`http://127.0.0.1:8000/api/auth/documents/${id}/`, {
// //           headers: {
// //             Authorization: `Bearer ${localStorage.getItem("authToken",data.access)}`,
// //           },
// //         });

// //         if (response.ok) {
// //           const data = await response.json();
// //           const fileUrl = data.file_url;
// //           setDocumentUrl(`http://127.0.0.1:8000${fileUrl}`);
// //         } else {
// //           console.error("Failed to fetch document:", response.statusText);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching document:", error);
// //       }
// //     };

// //     fetchDocument();
// //   }, [id]);

// //   // Draw the document and the stamp
// //   useEffect(() => {
// //     const drawCanvas = () => {
// //       const canvas = canvasRef.current;
// //       const ctx = canvas.getContext("2d");
// //       const img = new Image();

// //       img.src = documentUrl;
// //       img.onload = () => {
// //         // Set canvas size to match the image
// //         canvas.width = img.width;
// //         canvas.height = img.height;

// //         // Draw the document
// //         ctx.drawImage(img, 0, 0);

// //         // Draw the stamp
// //         drawStamp(ctx);
// //       };
// //     };

// //     const drawStamp = (ctx) => {
// //       ctx.font = "36px Arial";
// //       ctx.fillStyle = "red";
// //       ctx.fillText("STAMPED", stampPosition.x, stampPosition.y);
// //     };

// //     if (documentUrl) drawCanvas();
// //   }, [documentUrl, stampPosition]);

// //   // Mouse event handlers for dragging the stamp
// //   const handleMouseDown = (event) => {
// //     const rect = canvasRef.current.getBoundingClientRect();
// //     const mouseX = event.clientX - rect.left;
// //     const mouseY = event.clientY - rect.top;

// //     // Check if the click is on the stamp
// //     if (
// //       mouseX >= stampPosition.x &&
// //       mouseX <= stampPosition.x + 100 && // Width of the stamp
// //       mouseY >= stampPosition.y - 36 && // Height of the text
// //       mouseY <= stampPosition.y
// //     ) {
// //       setIsDragging(true);
// //     }
// //   };

// //   const handleMouseMove = (event) => {
// //     if (isDragging) {
// //       const rect = canvasRef.current.getBoundingClientRect();
// //       const mouseX = event.clientX - rect.left;
// //       const mouseY = event.clientY - rect.top;

// //       // Update stamp position
// //       setStampPosition({ x: mouseX, y: mouseY });
// //     }
// //   };

// //   const handleMouseUp = () => {
// //     setIsDragging(false);
// //   };

// //   const handleSave = () => {
// //     const canvas = canvasRef.current;
// //     const stampedImage = canvas.toDataURL("image/png");

// //     // Send the stamped image to the backend
// //     const saveStampedDocument = async () => {
// //       const formData = new FormData();
// //       formData.append("file", stampedImage);

// //       try {
// //         const response = await fetch(`http://127.0.0.1:8000/api/auth/documents/${id}/stamp/`, {
// //           method: "POST",
// //           headers: {
// //             Authorization: `Bearer ${localStorage.getItem("authToken",data.access)}`,
// //           },
// //           body: formData,
// //         });

// //         if (response.ok) {
// //           alert("Document stamped and saved successfully!");
// //           navigate("/dashboard");
// //         } else {
// //           console.error("Failed to save stamped document");
// //         }
// //       } catch (error) {
// //         console.error("Error saving stamped document:", error);
// //       }
// //     };

// //     saveStampedDocument();
// //   };

// //   return (
// //     <div style={{ textAlign: "center" }}>
// //       <h1>Document Viewer</h1>
// //       <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
// //       <div
// //         style={{ margin: "20px 0", position: "relative" }}
// //         onMouseDown={handleMouseDown}
// //         onMouseMove={handleMouseMove}
// //         onMouseUp={handleMouseUp}
// //         onMouseLeave={handleMouseUp}
// //       >
// //         <canvas ref={canvasRef} style={{ border: "1px solid #ccc" }}></canvas>
// //       </div>
// //       <button onClick={handleSave}>Save Stamped Document</button>
// //     </div>
// //   );
// // };

// // export default DocumentViewer;
// import React, { useEffect, useRef, useState } from "react";
// import { useParams, useNavigate,data } from "react-router-dom";

// const DocumentViewer = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [documentUrl, setDocumentUrl] = useState("");
//   const canvasRef = useRef(null);

//   const [stampPosition, setStampPosition] = useState({ x: 100, y: 100 });
//   const [isDragging, setIsDragging] = useState(false);

//   // Fetch the document
//   useEffect(() => {
//     const fetchDocument = async () => {
//       try {
//         const response = await fetch(`http://127.0.0.1:8000/api/auth/documents/${id}/`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("authToken",data.access)}`,
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           const fileUrl = data.file_url;
//           setDocumentUrl(`http://127.0.0.1:8000${fileUrl}`);
//         } else {
//           console.error("Failed to fetch document:", response.statusText);
//         }
//       } catch (error) {
//         console.error("Error fetching document:", error);
//       }
//     };

//     fetchDocument();
//   }, [id]);

//   // Draw the document and custom stamp
//   useEffect(() => {
//     const drawCanvas = () => {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext("2d");
//       const img = new Image();

//       img.src = documentUrl;
//       img.onload = () => {
//         // Set canvas size to match the image
//         canvas.width = img.width;
//         canvas.height = img.height;

//         // Draw the document
//         ctx.drawImage(img, 0, 0);

//         // Draw the custom stamp
//         drawCustomStamp(ctx);
//       };
//     };

//     const drawCustomStamp = (ctx) => {
//       // Draw a rounded rectangle as the stamp
//       const { x, y } = stampPosition;
//       const stampWidth = 120;
//       const stampHeight = 60;

//       ctx.fillStyle = "rgba(255, 0, 0, 0.5)"; // Semi-transparent red
//       ctx.strokeStyle = "red";
//       ctx.lineWidth = 2;

//       ctx.beginPath();
//       ctx.moveTo(x, y + 10);
//       ctx.arcTo(x, y, x + 10, y, 10); // Top-left corner
//       ctx.lineTo(x + stampWidth - 10, y);
//       ctx.arcTo(x + stampWidth, y, x + stampWidth, y + 10, 10); // Top-right corner
//       ctx.lineTo(x + stampWidth, y + stampHeight - 10);
//       ctx.arcTo(x + stampWidth, y + stampHeight, x + stampWidth - 10, y + stampHeight, 10); // Bottom-right corner
//       ctx.lineTo(x + 10, y + stampHeight);
//       ctx.arcTo(x, y + stampHeight, x, y + stampHeight - 10, 10); // Bottom-left corner
//       ctx.closePath();

//       ctx.fill();
//       ctx.stroke();

//       // Add text inside the stamp
//       ctx.font = "16px Arial";
//       ctx.fillStyle = "white";
//       ctx.textAlign = "center";
//       ctx.fillText("APPROVED", x + stampWidth / 2, y + stampHeight / 2 + 5);
//     };

//     if (documentUrl) drawCanvas();
//   }, [documentUrl, stampPosition]);

//   // Handle dragging the stamp
//   const handleMouseDown = (event) => {
//     const rect = canvasRef.current.getBoundingClientRect();
//     const mouseX = event.clientX - rect.left;
//     const mouseY = event.clientY - rect.top;

//     const { x, y } = stampPosition;
//     const stampWidth = 120;
//     const stampHeight = 60;

//     // Check if the user clicked on the stamp
//     if (
//       mouseX >= x &&
//       mouseX <= x + stampWidth &&
//       mouseY >= y &&
//       mouseY <= y + stampHeight
//     ) {
//       setIsDragging(true);
//     }
//   };

//   const handleMouseMove = (event) => {
//     if (isDragging) {
//       const rect = canvasRef.current.getBoundingClientRect();
//       const mouseX = event.clientX - rect.left;
//       const mouseY = event.clientY - rect.top;

//       // Update the stamp position
//       setStampPosition({ x: mouseX - 60, y: mouseY - 30 }); // Center the stamp on the cursor
//     }
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };

//   const handleSave = () => {
//     const canvas = canvasRef.current;
//     const stampedImage = canvas.toDataURL("image/png");

//     // Send the stamped image to the backend
//     const saveStampedDocument = async () => {
//       const formData = new FormData();
//       formData.append("file", stampedImage);

//       try {
//         const response = await fetch(`http://127.0.0.1:8000/api/auth/documents/${id}/stamp/`, {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("authToken",data.access)}`,
//           },
//           body: formData,
//         });

//         if (response.ok) {
//           alert("Document stamped and saved successfully!");
//           navigate("/dashboard");
//         } else {
//           console.error("Failed to save stamped document");
//         }
//       } catch (error) {
//         console.error("Error saving stamped document:", error);
//       }
//     };

//     saveStampedDocument();
//   };

//   return (
//     <div style={{ textAlign: "center" }}>
//       <h1>Document Viewer</h1>
//       <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
//       <div
//         style={{ margin: "20px 0", position: "relative" }}
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//         onMouseLeave={handleMouseUp}
//       >
//         <canvas ref={canvasRef} style={{ border: "1px solid #ccc" }}></canvas>
//       </div>
//       <button onClick={handleSave}>Save Stamped Document</button>
//     </div>
//   );
// };

// export default DocumentViewer;
// import React, { useEffect, useRef, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import StampDesigner from "./stamp";

// const DocumentViewer = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const canvasRef = useRef(null);
//     const [stampPosition, setStampPosition] = useState({ x: 100, y: 100 });
//   const [isDragging, setIsDragging] = useState(false);
//   const [documentUrl, setDocumentUrl] = useState("");
//   const [stampConfig, setStampConfig] = useState({
//     // text: "APPROVED",
//     // fontSize: 20,
//     // fontColor: "#ffffff",
//     // backgroundColor: "rgba(255, 0, 0, 0.5)",
//     // borderColor: "#ff0000",
//   });

//   // Fetch the document
//   useEffect(() => {
//     const fetchDocument = async () => {
//       try {
//         const response = await fetch(`http://127.0.0.1:8000/api/auth/documents/${id}/`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//           },
//         });
//         if (response.ok) {
//           const data = await response.json();
//           const fileUrl = data.file_url;
//           setDocumentUrl(`http://127.0.0.1:8000${fileUrl}`);
//         } else {
//           console.error("Failed to fetch document");
//         }
//       } catch (error) {
//         console.error("Error:", error);
//       }
//     };

//     fetchDocument();
//   }, [id]);

//   // Draw the document and stamp
//   useEffect(() => {
//     if (documentUrl) {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext("2d");
//       const img = new Image();

//       img.src = documentUrl;
//       img.onload = () => {
//         // Set canvas dimensions to match the document
//         canvas.width = img.width;
//         canvas.height = img.height;

//         // Draw the document
//         ctx.drawImage(img, 0, 0);

//         // Draw the stamp with the current configuration
//         drawStamp(ctx, 50, img.height - 100); // Example position (bottom-left)
//       };
//     }
//   }, [documentUrl, stampConfig]);

//   const drawStamp = (ctx, x, y) => {
//     const { text, fontSize, fontColor, backgroundColor, borderColor } = stampConfig;
//     const stampWidth = 200;
//     const stampHeight = 80;

//     // Draw stamp background
//     ctx.fillStyle = backgroundColor;
//     ctx.strokeStyle = borderColor;
//     ctx.lineWidth = 3;

//     ctx.beginPath();
//     ctx.rect(x, y, stampWidth, stampHeight);
//     ctx.fill();
//     ctx.stroke();

//     // Draw stamp text
//     ctx.font = `${fontSize}px Arial`;
//     ctx.fillStyle = fontColor;
//     ctx.textAlign = "center";
//     ctx.textBaseline = "middle";
//     ctx.fillText(text, x + stampWidth / 2, y + stampHeight / 2);
//   };
  
//   // Handle dragging the stamp
//   const handleMouseDown = (event) => {
//     const rect = canvasRef.current.getBoundingClientRect();
//     const mouseX = event.clientX - rect.left;
//     const mouseY = event.clientY - rect.top;

//     const { x, y } = stampPosition;
//     const stampWidth = 120;
//     const stampHeight = 60;

//     // Check if the user clicked on the stamp
//     if (
//       mouseX >= x &&
//       mouseX <= x + stampWidth &&
//       mouseY >= y &&
//       mouseY <= y + stampHeight
//     ) {
//       setIsDragging(true);
//     }
//   };

//   const handleMouseMove = (event) => {
//     if (isDragging) {
//       const rect = canvasRef.current.getBoundingClientRect();
//       const mouseX = event.clientX - rect.left;
//       const mouseY = event.clientY - rect.top;

//       // Update the stamp position
//       setStampPosition({ x: mouseX - 60, y: mouseY - 30 }); // Center the stamp on the cursor
//     }
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };

 

//   const handleSave = () => {
//     const canvas = canvasRef.current;
//     const stampedImage = canvas.toDataURL("image/png");

//     // Save the stamped image to the backend
//     const saveStampedDocument = async () => {
//       const formData = new FormData();
//       formData.append("file", stampedImage);

//       try {
//         const response = await fetch(`http://127.0.0.1:8000/api/auth/documents/${id}/stamp/`, {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//           },
//           body: formData,
//         });

//         if (response.ok) {
//           alert("Document stamped and saved successfully!");
//           navigate("/dashboard");
//         } else {
//           console.error("Failed to save stamped document");
//         }
//       } catch (error) {
//         console.error("Error saving stamped document:", error);
//       }
//     };

//     saveStampedDocument();
//   };

//   return (
    
//     // <div style={{ textAlign: "center" }}>
//     //   <h1>Document Viewer</h1>
//     //   <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
//     //   <StampDesigner onDesignUpdate={setStampConfig} />
//     //   <div style={{ margin: "20px 0" }}>
//     //     <canvas ref={canvasRef} style={{ border: "1px solid #ccc" }}></canvas>
//     //   </div>
//     //   <button onClick={handleSave}>Save Stamped Document</button>
//     // </div>
//     <div style={{ textAlign: "center" }}>
//          <h1>Document Viewer</h1>
//         <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
//           <div
//             style={{ margin: "20px 0", position: "relative" }}
//             onMouseDown={handleMouseDown}
//             onMouseMove={handleMouseMove}
//             onMouseUp={handleMouseUp}
//             onMouseLeave={handleMouseUp}
//           >
//             <StampDesigner onDesignUpdate={setStampConfig} />
//       <div style={{ margin: "20px 0" }}>
//         <canvas ref={canvasRef} style={{ border: "1px solid #ccc" }}></canvas>
//          </div>
//           </div>
//           <button onClick={handleSave}>Save Stamped Document</button>
//         </div>
//   );
// };

// export default DocumentViewer;
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, data } from "react-router-dom";
import StampDesigner from "./stamp";

const DocumentViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [documentUrl, setDocumentUrl] = useState("");
  const [stampConfig, setStampConfig] = useState({
    text: "APPROVED",
    fontSize: 20,
    fontColor: "#ffffff",
    backgroundColor: "rgba(255, 0, 0, 0.5)",
    borderColor: "#ff0000",
  });

  const [stampPosition, setStampPosition] = useState({ x: 100, y: 100 }); // Initial stamp position
  const [isDragging, setIsDragging] = useState(false);

  // Fetch the document
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/auth/documents/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          const fileUrl = data.file_url;
          setDocumentUrl(`http://127.0.0.1:8000${fileUrl}`);
        } else {
          console.error("Failed to fetch document");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchDocument();
  }, [id]);


  useEffect(() => {
    if (documentUrl) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
  
      // Set crossOrigin before setting src
      img.crossOrigin = "anonymous";
  
      img.src = documentUrl;
      img.onload = () => {
        // Set canvas size to match the document
        canvas.width = img.width;
        canvas.height = img.height;
  
        // Draw the document
        ctx.drawImage(img, 0, 0);
  
        // Draw the stamp
        drawStamp(ctx, 50, img.height - 100);
      };
    }
  }, [documentUrl, stampConfig]);
  

  const drawStamp = (ctx, x, y) => {
    const { text, fontSize, fontColor, backgroundColor, borderColor } = stampConfig;
    const stampWidth = 200;
    const stampHeight = 80;

    // Draw stamp background
    ctx.fillStyle = backgroundColor;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.rect(x, y, stampWidth, stampHeight);
    ctx.fill();
    ctx.stroke();

    // Draw stamp text
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = fontColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x + stampWidth / 2, y + stampHeight / 2);
  };

  // Handle mouse events
  const handleMouseDown = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const { x, y } = stampPosition;
    const stampWidth = 200;
    const stampHeight = 80;

    // Check if the user clicked on the stamp
    if (
      mouseX >= x &&
      mouseX <= x + stampWidth &&
      mouseY >= y &&
      mouseY <= y + stampHeight
    ) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // Update the stamp position
      setStampPosition({ x: mouseX - 100, y: mouseY - 40 }); // Adjust to center the stamp
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const stampedImage = canvas.toDataURL("image/png");

    // Save the stamped image to the backend
    const saveStampedDocument = async () => {
      const formData = new FormData();
      formData.append("file", stampedImage);

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/auth/documents/${id}/stamp/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken",data.access)}`,
          },
          body: formData,
        });

        if (response.ok) {
          alert("Document stamped and saved successfully!");
          navigate("/dashboard");
        } else {
          console.error("Failed to save stamped document");
        }
      } catch (error) {
        console.error("Error saving stamped document:", error);
      }
    };

    saveStampedDocument();
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Document Viewer</h1>
      <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
      <StampDesigner onDesignUpdate={setStampConfig} />
      <div
        style={{ margin: "20px 0", position: "relative" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas ref={canvasRef} style={{ border: "1px solid #ccc" }}></canvas>
      </div>
      <button onClick={handleSave}>Save Stamped Document</button>
    </div>
  );
};

export default DocumentViewer;

