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
    <div style={{ marginBottom: "20px", textAlign: "center" }}>
      <h3>Design Your Stamp</h3>
      <label>
        Text:{" "}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </label>
      <br />
      <label>
        Font Size:{" "}
        <input
          type="number"
          value={fontSize}
          onChange={(e) => setFontSize(parseInt(e.target.value))}
          min="10"
        />
      </label>
      <br />
      <label>
        Font Color:{" "}
        <input
          type="color"
          value={fontColor}
          onChange={(e) => setFontColor(e.target.value)}
        />
      </label>
      <br />
      <label>
        Background Color:{" "}
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
        />
      </label>
      <br />
      <label>
        Border Color:{" "}
        <input
          type="color"
          value={borderColor}
          onChange={(e) => setBorderColor(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleUpdate}>Apply Design</button>
    </div>
  );
};

export default StampDesigner;
