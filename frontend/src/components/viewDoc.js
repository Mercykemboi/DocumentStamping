import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

  const [stampPosition, setStampPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);

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

      img.crossOrigin = "anonymous";
      img.src = documentUrl;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        drawStamp(ctx, stampPosition.x, stampPosition.y);
      };
    }
  }, [documentUrl, stampConfig, stampPosition]);

  const drawStamp = (ctx, x, y) => {
    const { text, fontSize, fontColor, backgroundColor, borderColor } =
      stampConfig;
    const stampWidth = 200;
    const stampHeight = 80;

    ctx.fillStyle = backgroundColor;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.rect(x, y, stampWidth, stampHeight);
    ctx.fill();
    ctx.stroke();

    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = fontColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x + stampWidth / 2, y + stampHeight / 2);
  };

  const handleMouseDown = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const { x, y } = stampPosition;
    const stampWidth = 200;
    const stampHeight = 80;

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

      setStampPosition({ x: mouseX - 100, y: mouseY - 40 });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const stampedImage = canvas.toDataURL("image/png");

    const saveStampedDocument = async () => {
      const formData = new FormData();
      formData.append("file", stampedImage);

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/auth/documents/${id}/stamp/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: formData,
          }
        );

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
    
    <div className="document-viewer-container">
      <div className="sidebar">
      <h1>Stamp Designer</h1>
        <StampDesigner onDesignUpdate={setStampConfig} />
        <button className="save-button" onClick={handleSave}>
          Save Stamped Document
        </button>
        <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
      </div>
      <div
        className="canvas-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas ref={canvasRef} className="document-canvas"></canvas>
      </div>
    </div>
  );
};

export default DocumentViewer;
