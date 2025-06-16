import { useState, useCallback } from "react";

export const useZoom = (
  initialScale = 1.0,
  minScale = 0.5,
  maxScale = 2.0,
  step = 0.1
) => {
  const [scale, setScale] = useState(initialScale);

  const zoomIn = useCallback(() => {
    setScale((prevScale) => Math.min(prevScale + step, maxScale));
  }, [step, maxScale]);

  const zoomOut = useCallback(() => {
    setScale((prevScale) => Math.max(prevScale - step, minScale));
  }, [step, minScale]);

  return {
    scale,
    zoomIn,
    zoomOut,
    setScale,
  };
};
