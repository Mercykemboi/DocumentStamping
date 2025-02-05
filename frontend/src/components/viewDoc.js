import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf";

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
  const [stampConfig, setStampConfig] = useState({
    // text: "STAMP",
    // fontSize: 20,
    // fontColor: "#ffffff",
    // backgroundColor: "rgba(255, 0, 0, 0.5)",
    // borderColor: "#ff0000",
  });

  const [stampPosition, setStampPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [stampsOnDocument, setStampsOnDocument] = useState([]); // Holds placed stamps
  const [draggingStampIndex, setDraggingStampIndex] = useState(null); // Tracks which stamp is being dragged

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

  const drawStamp = useCallback((ctx, stamp, x, y) => {
    const { text, fontSize, fontColor, backgroundColor, borderColor } = stampConfig;
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
  }, [stampConfig]);

  const renderPNG = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.crossOrigin = "anonymous";
    img.src = documentUrl;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Draw all stamps
      stampsOnDocument.forEach((stamp) => {
        const { x, y } = stamp;
        drawStamp(ctx, stamp, x, y);
      });
    };
  }, [documentUrl, drawStamp, stampsOnDocument]);

  const renderPDF = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const ctx = canvas.getContext('2d');
  
    try {
      console.log("Fetching PDF document...");
      const pdf = await pdfjs.getDocument(documentUrl).promise;
      console.log("PDF loaded successfully.");
  
      const page = await pdf.getPage(1);  // Fetch the first page of the PDF
      const viewport = page.getViewport({ scale: 1 });  // Set scale to 1 for no zoom
  
      canvas.width = viewport.width;
      canvas.height = viewport.height;
  
      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      };
  
      // Render the page to the canvas using await to ensure the page is rendered properly
      await page.render(renderContext).promise;
  
      // After the page is rendered, draw the stamps on the document
      stampsOnDocument.forEach((stamp) => {
        const { x, y } = stamp;
        drawStamp(ctx, stamp, x, y);
      });
    } catch (error) {
      console.error("Error rendering the PDF:", error);
    }
  }, [documentUrl, drawStamp, stampsOnDocument]);
  

     useEffect(() => {
      if (fileType === "png" && documentUrl) {
        renderPNG();
      } else if (fileType === "pdf" && documentUrl) {
        renderPDF();
      }
    }, [documentUrl, fileType, renderPNG, renderPDF]);
  
  const handleMouseDown = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Check if click is within bounds of any stamp
    for (let i = 0; i < stampsOnDocument.length; i++) {
      const stamp = stampsOnDocument[i];
      if (
        mouseX >= stamp.x &&
        mouseX <= stamp.x + 200 && // Adjust size as needed
        mouseY >= stamp.y &&
        mouseY <= stamp.y + 80 // Adjust size as needed
      ) {
        setDraggingStampIndex(i);
        setDragOffset({ x: mouseX - stamp.x, y: mouseY - stamp.y });
        console.log(`Started dragging stamp at index: ${i}`);
        break;
      }
    }
  };

  const handleMouseMove = (event) => {
    if (draggingStampIndex === null) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const newX = mouseX - dragOffset.x;
    const newY = mouseY - dragOffset.y;

    // Update the stamp position
    const updatedStamps = [...stampsOnDocument];
    updatedStamps[draggingStampIndex] = {
      ...updatedStamps[draggingStampIndex],
      x: newX,
      y: newY,
    };

    // Log the updated position
    console.log(`Updated stamp position: ${newX}, ${newY}`);

    // Update the state with the new stamp positions
    setStampsOnDocument(updatedStamps);
  };

  const handleMouseUp = () => {
    console.log("Mouse up, dragging finished");
    setDraggingStampIndex(null);
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;
    const stampedImage = canvas.toDataURL("image/png");

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
        const data = await response.json();
        const stampedFileUrl = data.file_url;

        const downloadLink = document.createElement("a");
        downloadLink.href = `http://127.0.0.1:8000${stampedFileUrl}`;
        downloadLink.download = "stamped_document.pdf";
        downloadLink.click();

        navigate("/dashboard");
      } else {
        console.error("Failed to save stamped document");
      }
    } catch (error) {
      console.error("Error saving stamped document:", error);
    }
  };

  const applyStamp = (stampUrl) => {
    const newStamp = {
      url: stampUrl,
      x: stampPosition.x,
      y: stampPosition.y,
      width: 150,
      height: 150,
    };

    setStampsOnDocument((prevStamps) => [...prevStamps, newStamp]);
  };

  useEffect(() => {
    const fetchStamps = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/stamps/", {
          headers: {
            "Authorization": `Bearer ${storage}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
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
        <div className="stamp-designer">
          <h2>Stamp Designer</h2>
          <button className="save-button" onClick={handleSave}>
            Save Stamped Document
          </button>
          <button className="save-button" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
        <div className="saved-stamps">
          <h3>All Created Stamps</h3>
          <div className="stamps-list">
            {savedStamps.map((stamp, index) => (
              <div key={index} className="stamp-thumbnail">
                <img
                  src={stamp.image}
                  alt={stamp.name}
                  onClick={() => applyStamp(stamp.image)}
                />
                <p>{stamp.name}</p>
              </div>
            ))}
          </div>
        </div>

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
