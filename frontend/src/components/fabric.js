import React, { useEffect } from "react";
import { fabric } from "fabric";

const StampingCanvas = () => {
  useEffect(() => {
    const canvas = new fabric.Canvas("canvas");

    // Add a simple stamp
    const addStamp = () => {
      const stamp = new fabric.Text("Approved", {
        left: 100,
        top: 100,
        fontSize: 24,
        fill: "red",
        fontWeight: "bold",
        selectable: true, // Allow moving
      });
      canvas.add(stamp);
    };

    // Add a button to trigger stamp creation
    document.getElementById("addStampButton").onclick = addStamp;
  }, []);

  return (
    <div>
      <canvas id="canvas" width="800" height="600" />
      <button id="addStampButton">Add Stamp</button>
    </div>
  );
};

export default StampingCanvas;
