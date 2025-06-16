interface ZoomControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const ZoomControls = ({ scale, onZoomIn, onZoomOut }: ZoomControlsProps) => {
  const percentage = Math.round(scale * 100);

  return (
    <div
      className="mb-2 flex items-center gap-2 mx-auto w-fit"
      role="toolbar"
      aria-label="확대/축소 컨트롤"
    >
      <button
        onClick={onZoomOut}
        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-2xl"
        aria-label="축소"
      >
        -
      </button>
      <button
        onClick={onZoomIn}
        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-2xl"
        aria-label="확대"
      >
        +
      </button>
      <span className="ml-2 text-lg" role="status" aria-live="polite">
        {percentage}%
      </span>
    </div>
  );
};

export default ZoomControls;
