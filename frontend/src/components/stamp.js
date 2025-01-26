import React, { useState } from "react";
import "./StampPage.css";

const StampDesigner = ({ onDesignUpdate }) => {
  const [text, setText] = useState("APPROVED");
  const [fontSize, setFontSize] = useState(20);
  const [fontColor, setFontColor] = useState("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState("rgba(255, 0, 0, 0.5)");
  const [borderColor, setBorderColor] = useState("#ff0000");

  const handleUpdate = () => {
    onDesignUpdate({ text, fontSize, fontColor, backgroundColor, borderColor });
  };

  return (
    <div className="stamp-designer">
      <h2>Design Your Stamp</h2>
      <div className="stamp-form-group">
        <label>Text:</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div className="stamp-form-group">
        <label>Font Size:</label>
        <input
          type="number"
          value={fontSize}
          onChange={(e) => setFontSize(parseInt(e.target.value))}
          min="10"
        />
      </div>
      <div className="stamp-form-group">
        <label>
          Font Color:{" "}
          <span
            className="color-preview"
            style={{ backgroundColor: fontColor }}
          ></span>
        </label>
        <input
          type="color"
          value={fontColor}
          onChange={(e) => setFontColor(e.target.value)}
        />
      </div>
      <div className="stamp-form-group">
        <label>
          Background Color:{" "}
          <span
            className="color-preview"
            style={{ backgroundColor: backgroundColor }}
          ></span>
        </label>
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
        />
      </div>
      <div className="stamp-form-group">
        <label>
          Border Color:{" "}
          <span
            className="color-preview"
            style={{ backgroundColor: borderColor }}
          ></span>
        </label>
        <input
          type="color"
          value={borderColor}
          onChange={(e) => setBorderColor(e.target.value)}
        />
      </div>
      <button className="stamp-button" onClick={handleUpdate}>
        Apply Design
      </button>
    </div>
  );
};

export default StampDesigner;
