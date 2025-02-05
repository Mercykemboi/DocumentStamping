
import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import QRCode from "qrcode";
import "./StampEditor.css";
import { useNavigate } from "react-router-dom";

const StampPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [shapeSettings, setShapeSettings] = useState({
    shape: "circle",
    color: "#ff0000",
    borderThickness: 4,
  });
  const [textSettings, setTextSettings] = useState({
    text: "Sample Text",
    fontSize: 24,
    color: "#000000",
    fontFamily: "Arial",
  });
  const [qrText, setQrText] = useState("Scan Me");
  const [savedStamps, setSavedStamps] = useState([]);

  useEffect(() => {
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: 400,
      height: 400,
      backgroundColor: "#ffffff",
    });
    setCanvas(newCanvas);
    return () => newCanvas.dispose();
  }, []);

  const addShape = () => {
    if (!canvas) return;
    canvas.clear();

    let shape;
    switch (shapeSettings.shape) {
      case "circle":
        shape = new fabric.Circle({
          radius: 100,
          fill: shapeSettings.color,
          stroke: "black",
          strokeWidth: shapeSettings.borderThickness,
          left: 100,
          top: 100,
        });
        break;
      case "rectangle":
        shape = new fabric.Rect({
          width: 200,
          height: 100,
          fill: shapeSettings.color,
          stroke: "black",
          strokeWidth: shapeSettings.borderThickness,
          left: 100,
          top: 100,
        });
        break;
      default:
        return;
    }
    canvas.add(shape);
    canvas.renderAll();
  };

  const addText = () => {
    if (!canvas) return;
    const text = new fabric.Textbox(textSettings.text, {
      left: 120,
      top: 150,
      fontSize: textSettings.fontSize,
      fontFamily: textSettings.fontFamily,
      fill: textSettings.color,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const addQRCode = () => {
    if (!canvas) return;

    QRCode.toDataURL(qrText, { width: 100, margin: 1 }, (err, url) => {
      if (err) {
        console.error("Error generating QR code:", err);
        return;
      }

      fabric.Image.fromURL(url, (img) => {
        img.set({
          left: 150,
          top: 200,
          scaleX: 1,
          scaleY: 1,
        });

        canvas.add(img);
        canvas.renderAll();
      });
    });
  };

    const saveStamp = async () => {
      if (!canvas) return;
    
      // Convert the canvas to a base64 image (PNG format)
      const base64Image = canvas.toDataURL("image/png");
    
      try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/stamps/save/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ image: base64Image }),
        });
    
        if (response.ok) {
          console.log("Stamp saved successfully!");
          fetchStamps(); // Refresh stamp list after saving
        } else {
          console.error("Failed to save stamp.");
        }
      } catch (error) {
        console.error("Error saving stamp:", error);
      }
    };

    const fetchStamps = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/stamps/all/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
    
        if (response.ok) {
          const data = await response.json();
          setSavedStamps(data);
        } else {
          console.error("Failed to fetch stamps.");
        }
      } catch (error) {
        console.error("Error fetching stamps:", error);
      }
    };
    
    // Fetch stamps when the component mounts
    // useEffect(() => {
    //   fetchStamps();
    // }, []);
    
    
  
  //Load stamps from backend
  useEffect(() => {
    fetch("http://localhost:8000/api/auth/stamps/")
      .then((res) => res.json())
      .then((data) => setSavedStamps(data))
      .catch((err) => console.error("Error fetching stamps:", err));
  }, []);
  
  
  //Load saved stamps on component mount
  // useEffect(() => {
  //   const storedStamps = JSON.parse(localStorage.getItem("stamps")) || [];
  //   setSavedStamps(storedStamps);
  // }, []);
  
  const handleDashboard = () =>
  {
    navigate("/dashboard");
  }

  return (
    <div className="stamp-editor-container">
      <h2>Create Your Custom Digital Stamp</h2>
      <div className="control-panel">
        <div className="control-group">
          <label>Shape:</label>
          <select
            value={shapeSettings.shape}
            onChange={(e) =>
              setShapeSettings({ ...shapeSettings, shape: e.target.value })
            }
          >
            <option value="circle">Circle</option>
            <option value="rectangle">Rectangle</option>
          </select>

          <label>Shape Color:</label>
          <input
            type="color"
            value={shapeSettings.color}
            onChange={(e) =>
              setShapeSettings({ ...shapeSettings, color: e.target.value })
            }
          />

          <button onClick={addShape}>Add Shape</button>
        </div>

        <div className="control-group">
          <label>Text:</label>
          <input
            type="text"
            value={textSettings.text}
            onChange={(e) =>
              setTextSettings({ ...textSettings, text: e.target.value })
            }
          />

          <label>Font Size:</label>
          <input
            type="number"
            value={textSettings.fontSize}
            onChange={(e) =>
              setTextSettings({ ...textSettings, fontSize: parseInt(e.target.value) })
            }
          />

          <label>Text Color:</label>
          <input
            type="color"
            value={textSettings.color}
            onChange={(e) =>
              setTextSettings({ ...textSettings, color: e.target.value })
            }
          />

          <button onClick={addText}>Add Text</button>
        </div>

        <div className="control-group">
          <label>QR Code Text:</label>
          <input
            type="text"
            value={qrText}
            onChange={(e) => setQrText(e.target.value)}
          />
          <button onClick={addQRCode}>Add QR Code</button>
        </div>
      </div>

      <div className="canvas-container">
        <canvas ref={canvasRef} id="stamp-canvas"></canvas>
      </div>

      <button className="save-btn" onClick={saveStamp}>Save Stamp</button>
     <button className="save-btn" onClick={handleDashboard}>Return To Dashboard</button> 

      <div className="saved-stamps">
        <h3>All Created Stamps</h3>
        <div className="stamps-list">
          {savedStamps.map((stamp, index) => (
            <div key={index} className="stamp-thumbnail">
              <img src={stamp} alt={`Stamp ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StampPage;

