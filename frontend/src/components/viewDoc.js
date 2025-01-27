import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, data } from "react-router-dom";
import StampDesigner from "./stamp";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const DocumentViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const containerRef = useRef(null); // Reference to the scrollable container
  const [documentUrl, setDocumentUrl] = useState("");
  const [fileType, setFileType] = useState("");
  const [stampConfig, setStampConfig] = useState({
    text: "STAMP",
    fontSize: 20,
    fontColor: "#ffffff",
    backgroundColor: "rgba(255, 0, 0, 0.5)",
    borderColor: "#ff0000",
  });

  const [stampPosition, setStampPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Offset for smooth dragging

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

  useEffect(() => {
    if (fileType === "png" && documentUrl) {
      renderPNG();
    } else if (fileType === "pdf" && documentUrl) {
      renderPDF();
    }
  }, [documentUrl, fileType, stampConfig, stampPosition]);

  const renderPNG = () => {
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
  };

  const renderPDF = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const pdf = await pdfjs.getDocument(documentUrl).promise;
    const page = await pdf.getPage(1); // Render the first page
    const viewport = page.getViewport({ scale: 1 });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    // Draw the stamp
    drawStamp(ctx, stampPosition.x, stampPosition.y);
  };

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
      setDragOffset({ x: mouseX - x, y: mouseY - y }); // Save the offset
    }
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // Calculate new position with boundary constraints
      const newX = Math.max(0, Math.min(mouseX - dragOffset.x, canvasRef.current.width - 200));
      const newY = Math.max(0, Math.min(mouseY - dragOffset.y, canvasRef.current.height - 80));

      setStampPosition({ x: newX, y: newY });
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
              Authorization: `Bearer ${localStorage.getItem("authToken",data.access)}`,
            },
            body: formData,
          }
        );

        if (response.ok) {
          alert("Document stamped and saved successfully!");
          const data = await response.json();
          const stampedFileUrl = data.file_url; // Assuming the API returns the URL of the stamped document
          console.log(stampedFileUrl)
          // Create a link to download the file
          const downloadLink = document.createElement("a");
          downloadLink.href = `http://127.0.0.1:8000${stampedFileUrl}`;  // Assuming the URL is relative
          downloadLink.download = "stamped_document.pdf";  // You can dynamically generate the filename if needed
          downloadLink.click();  // Trigger the download
          
          
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
    <div className="document-viewer-card">
      <div className="document-viewer-container">
        {/* Sidebar for Stamp Designer */}
        <div className="stamp-designer">
          <h2>Stamp Designer</h2>
          <StampDesigner onDesignUpdate={setStampConfig} />

          <button className="save-button" onClick={handleSave}>
            Save Stamped Document
          </button>
          <button
            className="save-button"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>

        {/* Scrollable Container */}
        <div
          ref={containerRef}
          className="canvas-container scrollable"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <canvas ref={canvasRef} className="document-canvas"></canvas>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
