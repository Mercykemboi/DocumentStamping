import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

const Dashboard = () => {
  const storage = localStorage.getItem("authToken");
  const savedUsername = localStorage.getItem("username");
  const [uploadedCount, setUploadedCount] = useState(0);
  const [deletedCount, setDeletedCount] = useState(0);
  const [stampedCount, setStampedCount] = useState(0);
  const [documents, setDocuments] = useState([]);
  const [verificationResult, setVerificationResult] = useState(null);
  const navigate = useNavigate();
  const [uploadStatus, setUploadStatus] = useState("");
  
  const fetchDocuments = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/viewDocuments/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
        setUploadedCount(data.length);
        setStampedCount(data.filter((doc) => doc.stamped).length);
      } else {
        console.error("Failed to fetch documents.");
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const handleUpload = async (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      setUploadStatus("No file selected.");
      return;
    }

    setUploadStatus("Uploading...");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/documents/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadStatus("File uploaded successfully!");
        setDocuments((prevDocs) => [data, ...prevDocs]);
      } else {
        setUploadStatus("Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("An error occurred while uploading the file.");
    }
  };

  const handleDelete = async (documentId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/auth/documents/${documentId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.ok) {
        setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== documentId));
        setDeletedCount((prev) => prev + 1);
      } else {
        console.error("Failed to delete document.");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleView = (documentId) => {
    navigate(`/document/${documentId}`);
  };

  const [extractedSerial, setExtractedSerial] = useState(""); // Store extracted serial
  const [extractedQr, setExtractedQr] = useState(""); // Store extracted QR
  
  const handleVerify = async (event) => {
      const selectedFile = event.target.files[0];
  
      if (!selectedFile) {
          setUploadStatus("No file selected.");
          return;
      }
  
      const formData = new FormData();
      formData.append("document", selectedFile);
      console.log(selectedFile);
  
      const token = storage; // Retrieve token from localStorage
  
      if (!token) {
          alert("❌ Authentication error: No token found. Please log in again.");
          return;
      }
  
      try {
          const response = await fetch("http://127.0.0.1:8000/api/auth/verifyDocument/", {
              method: "POST",
              headers: {
                  Authorization: `Bearer ${token}`,  // Add Authorization header
              },
              body: formData,
          });
  
          const data = await response.json();
          console.log(data);
  
          if (!response.ok) {
              console.error("Verification Error:", data);
              alert(`❌ Verification Failed: ${data.message || "Something went wrong."}`);
              return;
          }
  
          // ✅ Set extracted serial number & QR code
          setExtractedSerial(data.serial_number || "No serial number found");
          setExtractedQr(data.qr_code || "No QR code found");
  
          alert(`✅ Verification Successful`);
      } catch (error) {
          console.error("❌ Error verifying document:", error);
          alert("❌ Verification failed due to a network or server error.");
      }
  };
  


  

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">Digital Stamping System</div>
        <nav className="menu">
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button onClick={fetchDocuments}>Documents</button>
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate("/stamp")}>Create Stamp</button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <div>
            <p>Hello, {savedUsername}!</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </header>

        <section className="stats-section">
          <div className="stat-card">
            <h3>Uploaded Documents</h3>
            <p>{uploadedCount}</p>
          </div>
          <div className="stat-card">
            <h3>Deleted Documents</h3>
            <p>{deletedCount}</p>
          </div>
          <div className="stat-card">
            <h3>Stamped Documents</h3>
            <p>{stampedCount}</p>
          </div>
        </section>

        <section className="documents-section">
          <div className="section-header">
            <h2>My Documents</h2>
            <label className="upload-btn">
              Upload New
              <input type="file" onChange={handleUpload} hidden />
            </label>
          </div>

          {documents.length === 0 ? (
            <p>No documents found.</p>
          ) : (
            <table className="documents-table">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.file.split("/").pop()}</td>
                    <td>{new Date(doc.created_at).toLocaleString()}</td>
                    <td>
                      <button onClick={() => handleView(doc.id)} style={{ marginRight: "10px" }}>
                        View
                      </button>
                      
                      <button onClick={() => handleDelete(doc.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="verify-section">
          <h2>Verify Document</h2>
          <label className="verify-btn">
            Choose File to Verify
            <input type="file" onChange={handleVerify} hidden />
          </label>
          {verificationResult && <p className="verification-status">{verificationResult}</p>}
          <div className="extracted-data mt-3">
        <p><strong>Extracted Serial Number:</strong> {extractedSerial}</p>
        <p><strong>Extracted QR Code:</strong> {extractedQr}</p>
    </div>
        </section>
        
      </main>
    </div>
  );
};

export default Dashboard;
