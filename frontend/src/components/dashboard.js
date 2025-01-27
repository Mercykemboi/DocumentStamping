import React, { useState, useEffect } from "react";
import { data, useNavigate } from "react-router-dom";
import "./dashboard.css";

const Dashboard = () => {
  const savedUsername = localStorage.getItem("username");
  const [uploadedCount, setUploadedCount] = useState(0);
  const [deletedCount, setDeletedCount] = useState(0);
  const [stampedCount, setStampedCount] = useState(0);
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();
  const [uploadStatus, setUploadStatus] = useState("");

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
    localStorage.removeItem("authToken",data.access);
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
          Authorization: `Bearer ${localStorage.getItem("authToken",data.access)}`,
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
            Authorization: `Bearer ${localStorage.getItem("authToken",data.access)}`,
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
  const handleView = async (documentId) => {
    navigate(`/document/${documentId}`);
};
const handleStamp  = () => {
  navigate(`/stamp/`);
};

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">Digital Stamping System</div>
        <nav className="menu">
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button  onClick={fetchDocuments}>
          Documents
        </button>
          <button  onClick={handleStamp}>
          Create Stamp
        </button>
          <button onClick={() => navigate("/document-set")}>Document Set</button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
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
                  <th>Stamped</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.file.split("/").pop()}</td>
                    <td>{new Date(doc.created_at).toLocaleString()}</td>
                    <td>{doc.stamped ? "Yes" : "No"}</td>
                    <td>
                    <button
                onClick={() => handleView(doc.id)}
                style={{ marginRight: "10px" }}
              >
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
      </main>
    </div>
  );
};

export default Dashboard;