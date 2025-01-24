
import React, { useState, useEffect } from "react";
import { data, useNavigate } from "react-router-dom";
import "./dashboard.css";

const Dashboard = () => {

const savedUsername = localStorage.getItem("username");
const [uploadedCount, setUploadedCount] = useState(0);
const [deletedCount, setDeletedCount] = useState(0);
const [stampedCount, setStampedCount] = useState(0);
const [selectedDocument, setSelectedDocument] = useState(null);
const [showViewer, setShowViewer] = useState(false);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [documents, setDocuments] = useState([]);
   

// Fetch username from local storage or API

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("authToken",data.access);
    navigate("/");
  };

  // File selection handler
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

 
const handleUpload = async (event) => {
  const selectedFile = event.target.files[0];

  if (!selectedFile) {
    setUploadStatus("No file selected.");
    return;
  }

  setFile(selectedFile);
  setUploadStatus("Uploading..."); // Indicate upload process has started

  const formData = new FormData();
  formData.append("file", selectedFile);

  try {
    const authToken = localStorage.getItem("authToken",data.access);
    
    if (!authToken) {
      setUploadStatus("Authentication token not found. Please log in again.");
      return;
    }

    const response = await fetch("http://127.0.0.1:8000/api/auth/documents/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`, // Include token for authentication
      },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      setUploadStatus("File uploaded successfully!");
      console.log("Uploaded file data:", data);

      // Optionally, add the uploaded file to the recent documents list
      setDocuments((prevDocs) => [data, ...prevDocs]);

      setFile(null); // Clear the file input
    } else {
      const errorData = await response.json();
      setUploadStatus(errorData.message || "Failed to upload file.");
      console.error("Upload failed:", errorData);
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    setUploadStatus("An error occurred while uploading the file.");
  }
};

// Function to fetch documents
const fetchDocuments = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/auth/viewDocuments/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken",data.access)}`, 
            },
    });

    if (response.ok) {
      const data = await response.json();
      setDocuments(data); // Update documents state with the fetched data
      setUploadedCount(data.length); // Total uploaded documents
      setStampedCount(data.filter((doc) => doc.stamped).length);
    } else {
      const errorData = await response.json();
      console.error("Failed to fetch documents:", errorData.message || response.statusText);
    }
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
};

// Call fetchDocuments when the component is mounted
useEffect(() => {
  fetchDocuments();
}, []);


 
  // Delete document handler
  const handleDelete = async (documentId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this document?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/auth/documents/${documentId}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken",data.access)}`,
          },
        });

        if (response.ok) {
          // fetchDocuments();
          setDeletedCount(deletedCount + 1); // Increment deleted count
        setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== documentId)); // Remove document from list
        } else {
          alert("Failed to delete document.");
        }
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
  };
  const handleStamp = async (documentId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/auth/documents/${documentId}/stamp/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken",data.access)}`,
          },
        }
      );
  
      if (response.ok) {
        alert("Document stamped successfully!");
        fetchDocuments(); // Refresh the document list to update the stamped status
      } else {
        alert("Failed to stamp document.");
      }
    } catch (error) {
      console.error("Error stamping document:", error);
    }
  };
  
  const handleView = async (documentId) => {
    navigate(`/document/${documentId}`);
};

 

    // Close viewer
    const closeViewer = () => {
      setSelectedDocument(null); // Clear the selected document
      setShowViewer(false); // Hide the viewer
    };
  

  return (
    <div className="dashboard">
      {/* Top Navigation */}
      <header className="dashboard-header">
        <h1>Document Stamping
        </h1>
        <nav>
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/documents")}>Documents</button>
          <button onClick={() => navigate("/templates")}>Templates</button>
          <input type="text" placeholder="Search any document" />
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      {/* Welcome Banner */}
      <section className="welcome-banner">
        <h2>Welcome Back, {savedUsername}!</h2>
        {/* <p>Get the power to take your Digidocs plan to the next level.</p>
        <button>Open Documentation</button>
        <button>Setup Details</button> */}
      </section>
      {/* Statistics Section */}
      <section className="stats">
      {/* <h3>Statistics</h3> */}
      
       <div>
    <h4>Uploaded Documents</h4>
    <p>{uploadedCount}</p>
      </div>
    <div>
    <h4>Deleted Documents</h4>
    <p>{deletedCount}</p>
  </div>
  <div>
    <h4>Stamped Documents</h4>
    <p>{stampedCount}</p>
  </div>
      </section>

      {/* File Upload Section */}
      <section className="file-upload">
        
        <h3>Upload File</h3>
       
         <div className="upload-box">
    <input
      id="fileInput"
      type="file"
      style={{ display: "none" }}
      onChange={handleUpload} // File upload starts immediately here
    />
    <button onClick={() => document.getElementById("fileInput").click()}>
      Drag and drop or click to upload
    </button>
    <p>Maximum file size: 50 MB</p>
    <p className={`upload-status ${uploadStatus.includes("success") ? "success" : "error"}`}>
  {uploadStatus}
</p>

    {/* {uploadStatus && <p>{uploadStatus}</p>} */}
  </div>
      </section>

      

      {/* Recent Documents Section */}
      <section className="recent-documents">
  <h3>Uploaded Documents</h3>
  {documents.length === 0 ? (
    <p>No documents available. Upload a document to get started.</p>
  ) : (
    <table>
      <thead>
        <tr>
          {/* <th>ID</th> */}
          <th>File Name</th>
          <th>Created At</th>
          {/* <th>Updated At</th> */}
          <th>Stamped</th>
          <th>Actions</th> {/* New column for actions */}
        </tr>
      </thead>
      <tbody>
        {documents.map((doc) => (
          <tr key={doc.id}>
            {/* <td>{doc.id}</td> */}
            <td>
              <a
                href={`http://127.0.0.1:8000${doc.file}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {doc.file.split("/").pop()}
              </a>
            </td>
            <td>{new Date(doc.created_at).toLocaleString()}</td>
            {/* <td>{new Date(doc.updated_at).toLocaleString()}</td> */}
            <td>{doc.stamped ? "True" : "False"}</td>
            <td>
              <button
                onClick={() => handleView(doc.id)}
                style={{ marginRight: "10px" }}
              >
                View
              </button>
              {/* <button
                onClick={() => handleStamp(doc.id)}
                style={{ marginRight: "10px" }}
              >
                Stamp
              </button> */}
              <button onClick={() => handleDelete(doc.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</section>
{/* Document Viewer */}
{showViewer && (
  <div className="document-viewer">
    <button onClick={() => setShowViewer(false)}>Close Viewer</button>

    {/* For Images */}
  
    {selectedDocument.endsWith(".jpg") || selectedDocument.endsWith(".png") || selectedDocument.endsWith(".jpeg") ? (
      <img src={selectedDocument} alt="Document Preview" style={{ width: "100%", height: "auto" }} />
    ) : (
      // For PDFs
      <iframe
        // src={selectedDocument}
        src={selectedDocument}
        title="Document Viewer"
        style={{ width: "100%", height: "80vh", border: "1px solid #ccc" }}
      ></iframe>
    )}
  </div>
)}





      {/* Promotional Banner */}
     {/* Promotional Banner */}
<footer className="promo-banner">
  <h3>Download Document Stamping App</h3>
  <div className="download-buttons">
    {/* Google Play */}
    <a
      href="https://play.google.com/store/apps" // Replace with your app link
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/c/cd/Get_it_on_Google_play.svg"
        alt="Get it on Google Play"
        style={{ width: "150px", margin: "10px" }}
      />
    </a>
    {/* App Store */}
    <a
      href="https://www.apple.com/app-store/" // Replace with your app link
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
        alt="Download on the App Store"
        style={{ width: "150px", margin: "10px" }}
      />
    </a>
  </div>
</footer>

    </div>
  );
};

 export default Dashboard;
