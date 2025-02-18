import React, { useState } from "react";
import axios from "axios";

const VerifyDocument = () => {
  const [file, setFile] = useState(null);
  const [verificationResult, setVerificationResult] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleVerify = async () => {
    if (!file) {
      alert("Please select a document to verify.");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/verify-document/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setVerificationResult(response.data.status);
    } catch (error) {
      setVerificationResult("Error verifying document.");
    }
  };

  return (
    <div>
      <h2>Verify Stamped Document</h2>
      <input type="file" onChange={handleFileChange} accept=".pdf,.png,.jpg" />
      <button onClick={handleVerify}>Verify</button>

      {verificationResult && (
        <div>
          <h3>Verification Result:</h3>
          <p>{verificationResult}</p>
        </div>
      )}
    </div>
  );
};

export default VerifyDocument;
