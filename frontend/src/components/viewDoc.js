import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf";
import "./documentViewer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const DocumentViewer = () => {
  const storage = localStorage.getItem("authToken");
  const { id } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [savedStamps, setSavedStamps] = useState([]);
  const [documentUrl, setDocumentUrl] = useState("");
  const [fileType, setFileType] = useState("");
  const [stampsOnDocument, setStampsOnDocument] = useState([]);
  const [draggingStampIndex, setDraggingStampIndex] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedStampId, setSelectedStampId] = useState(null);

  // OTP state
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/auth/documents/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const fileUrl = data.file_url;
          setDocumentUrl(`http://127.0.0.1:8000${fileUrl}`);
          setFileType(fileUrl.split(".").pop().toLowerCase());
        } else {
          console.error("Failed to fetch document");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchDocument();
  }, [id]);

  const drawStamp = useCallback((ctx, stamp) => {
    const img = new Image();
    img.src = stamp.url;
    img.onload = () => {
      ctx.drawImage(img, stamp.x, stamp.y, stamp.width, stamp.height);
    };
  }, []);

  const renderDocument = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    if (fileType === "png") {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = documentUrl;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        stampsOnDocument.forEach((stamp) => drawStamp(ctx, stamp));
      };
    } else if (fileType === "pdf") {
      pdfjs.getDocument(documentUrl).promise.then((pdf) => {
        pdf.getPage(1).then((page) => {
          const viewport = page.getViewport({ scale: 1 });
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const renderContext = { canvasContext: ctx, viewport };
          page.render(renderContext).promise.then(() => {
            stampsOnDocument.forEach((stamp) => drawStamp(ctx, stamp));
          });
        });
      });
    }
  }, [documentUrl, fileType, drawStamp, stampsOnDocument]);

  useEffect(() => {
    if (documentUrl) renderDocument();
  }, [documentUrl, fileType, stampsOnDocument, renderDocument]);

  const handleMouseDown = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    for (let i = 0; i < stampsOnDocument.length; i++) {
      const stamp = stampsOnDocument[i];
      if (
        mouseX >= stamp.x &&
        mouseX <= stamp.x + stamp.width &&
        mouseY >= stamp.y &&
        mouseY <= stamp.y + stamp.height
      ) {
        setDraggingStampIndex(i);
        setDragOffset({ x: mouseX - stamp.x, y: mouseY - stamp.y });
        break;
      }
    }
  };

  const handleMouseMove = (event) => {
    if (draggingStampIndex === null) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const updatedStamps = [...stampsOnDocument];
    updatedStamps[draggingStampIndex] = {
      ...updatedStamps[draggingStampIndex],
      x: mouseX - dragOffset.x,
      y: mouseY - dragOffset.y,
    };

    setStampsOnDocument(updatedStamps);
  };

  const handleMouseUp = () => {
    setDraggingStampIndex(null);
  };

  // const handleSave = async () => {
  //   const canvas = canvasRef.current;
  //   const stampedImage = canvas.toDataURL("image/png");

  //   const formData = new FormData();
  //   formData.append("file", stampedImage);

  //   try {
  //     const response = await fetch(
  //       `http://127.0.0.1:8000/api/auth/documents/${id}/stamp/`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  //         },
  //         body: formData,
  //       }
  //     );

  //     if (response.ok) {
  //       alert("Document stamped and saved successfully!");
  //       const data = await response.json();
  //       const stampedFileUrl = data.file_url;

  //       const downloadLink = document.createElement("a");
  //       downloadLink.href = `http://127.0.0.1:8000${stampedFileUrl}`;
  //       downloadLink.download = "stamped_document.pdf";
  //       downloadLink.click();

  //       navigate("/dashboard");
  //     } else {
  //       console.error("Failed to save stamped document");
  //     }
  //   } catch (error) {
  //     console.error("Error saving stamped document:", error);
  //   }
  // }; 
  const requestOTP = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/auth/generate/`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${storage}`,
          },
        }
      );

      if (response.ok) {
        alert("OTP sent to your registered email.");
        setShowOtpInput(true);
      } else {
        console.error("Failed to generate OTP");
      }
    } catch (error) {
      console.error("Error generating OTP:", error);
    }
  };
  console.log(storage)

  const verifyOtp = async () => {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/verify/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify({ otp }),
        });

        const data = await response.json();
        if (response.ok) {
            alert("OTP verified successfully! Now you can stamp.");
        } else {
            alert(data.error || "OTP verification failed.");
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
    }
};

const stampDocument = async () => {
  try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/stamp/", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${storage}`,
          },
          body: JSON.stringify({
              stamp_id: selectedStampId,
              document_url: documentUrl,
              // x: 150,
              // y: 200,
          }),
      });

      const data = await response.json();
      if (response.ok) {
          alert("Stamp applied successfully!");
          console.log("Stamped Document URL:", data.stamped_url);
          navigate("/dashboard")
        const downloadLink = document.createElement('a');
        downloadLink.href = data.stamped_url;
        downloadLink.download = data.stamped_url.split('/').pop();  // Optional: set filename from URL
        downloadLink.click(); 
      } else {
          alert(data.error || "Error stamping document");
      }
  } catch (error) {
      console.error("Error stamping document:", error);
  }
};


const handleStampSelection = (stampId) => {
  setSelectedStampId(stampId);
};


  const handleSave = () => {
    stampDocument();
   };
   const handleOtpChange = (event) => {
    setOtp(event.target.value);
  };


  const applyStamp = (stampUrl, stampId) => {
    if (!stampId) {
        alert("Stamp ID is missing!");
        return;
    }
    
    const newStamp = {
        url: stampUrl,
        id: stampId,  // Ensure stamp ID is stored
        x: 100,
        y: 100,
        width: 150,
        height: 150,
    };

    setStampsOnDocument((prevStamps) => [...prevStamps, newStamp]);
    setSelectedStampId(stampId); // Store the selected stamp ID
};


useEffect(() => {
  const fetchStamps = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/stamps/", {
        headers: { Authorization: `Bearer ${storage}` },
      });

      if (response.ok) {
        const data = await response.json();
        // console.log("Fetched Stamps Data:", data); // ✅ Debugging
        setSavedStamps(data);
      } else {
        console.error("Failed to fetch stamps");
      }
    } catch (error) {
      console.error("Error fetching stamps:", error);
    }
  };

  fetchStamps();
}, []);


  return (
    <div className="document-viewer-card">
      <div className="document-viewer-container">
        <h2>Stamp Designer</h2>
        
        <button onClick={handleSave}>Save Stamped Document</button>
        <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>

        {/* OTP Section */}
        <div className="otp-section">
  <h3>Enter OTP</h3>
  <div className="otp-input-container">
    <input
      type="text"
      placeholder="Enter OTP"
      value={otp}
      onChange={handleOtpChange}
      className="otp-input"
    />
    <button onClick={verifyOtp} className="otp-verify-btn">Verify OTP</button>
  </div>
  
  <div className="otp-request-section">
    <button onClick={requestOTP} className="otp-request-btn">Send OTP</button>
  </div>
</div>



        <div className="saved-stamps">
  <h3>All Created Stamps</h3>
  <div className="stamps-list">
    {savedStamps.map((stamp, index) => {
      console.log("Stamp Data:", stamp); // ✅ Debugging: Check if stamp has an ID

      return (
        <div key={index} className="stamp-thumbnail">
          <img
            src={stamp.image}  
            alt={stamp.name}
            onClick={() => applyStamp(stamp.image, stamp.id)} // ✅ Pass correct ID
          />
          <p>{stamp.name} (ID: {stamp.id})</p> {/* ✅ Display ID */}
        </div>
      );
    })}
  </div>
</div>




        <div ref={containerRef} className="canvas-container" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
          <canvas ref={canvasRef} className="document-canvas"></canvas>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
