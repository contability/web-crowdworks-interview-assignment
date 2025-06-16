import type { ReportData } from "../../types";

interface ImageRendererProps {
  image: ReportData["pictures"][0];
}

const ImageRenderer = ({ image }: ImageRendererProps) => {
  return (
    <div className="my-4">
      <div className="p-2 text-center">
        {image.image.uri.startsWith("data:") ? (
          <img
            src={image.image.uri}
            alt="PDF 이미지"
            className="max-w-full h-auto mx-auto"
            style={{ maxHeight: "300px" }}
          />
        ) : (
          <div>[이미지: {image.image.mimetype}]</div>
        )}
      </div>
      {image.captions && image.captions.length > 0 && (
        <p className="text-sm text-center mt-2 italic">
          {JSON.stringify(image.captions)}
        </p>
      )}
    </div>
  );
};

export default ImageRenderer;
