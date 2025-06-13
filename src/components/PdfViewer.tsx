import { useState, useCallback, type Dispatch, type RefObject } from "react";
import { Document, Page, pdfjs } from "react-pdf";
// text layer의 위치를 잡아줌. 즉, OCR 적용된 것 처럼 만들어줌.
import "react-pdf/dist/Page/TextLayer.css";
import type { ReportData } from "../types";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PdfViewerProps {
  displayableTextItems: ReportData["texts"];
  selectedItem: string | null;
  hoveredItem: string | null;
  pdfOverlaysRef: RefObject<Record<string, HTMLDivElement | null>>;
  jsonItemsRef: RefObject<Record<string, HTMLDivElement | null>>;
  setHoveredItem: Dispatch<React.SetStateAction<string | null>>;
}

const PdfViewer = ({
  displayableTextItems,
  selectedItem,
  hoveredItem,
  pdfOverlaysRef,
  jsonItemsRef,
  setHoveredItem,
}: PdfViewerProps) => {
  const [numPages, setNumPages] = useState(0);

  const [scale, setScale] = useState(1.0);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  // PDF 영역에 마우스를 올렸을 때 해당 텍스트 항목 강조 (메모이제이션 적용)
  const handleMouseEnterPdfItem = useCallback(
    (itemRef: string) => {
      setHoveredItem(itemRef);

      // 오른쪽 JSON 영역에서 해당 항목으로 스크롤
      const jsonItem = jsonItemsRef.current[itemRef];
      if (jsonItem) {
        jsonItem.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },
    [jsonItemsRef, setHoveredItem]
  );

  // PDF 영역에서 마우스가 벗어났을 때 (메모이제이션 적용)
  const handleMouseLeavePdfItem = useCallback(() => {
    setHoveredItem(null);
  }, [setHoveredItem]);

  // 확대/축소 기능 추가 (메모이제이션 적용)
  const handleZoomIn = useCallback(() => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 2.0));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
  }, []);

  return (
    <div className="flex-1 overflow-auto bg-gray-100">
      <div className="mx-auto w-fit overflow-auto p-4">
        <div className="mb-2 flex gap-2">
          <button
            onClick={handleZoomOut}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            aria-label="축소"
          >
            -
          </button>
          <button
            onClick={handleZoomIn}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            aria-label="확대"
          >
            +
          </button>
          <span className="ml-2 text-sm">{Math.round(scale * 100)}%</span>
        </div>
        <div>
          <Document
            file="/public/reports/1.report.pdf"
            onLoadSuccess={onDocumentLoadSuccess}
          >
            {Array.from(new Array(numPages), (_, index) => (
              <div
                key={`page-container__${index + 1}`}
                className="relative mb-4"
              >
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  renderAnnotationLayer={false}
                  scale={scale}
                />

                {/* PDF 위에 텍스트 항목 오버레이 */}
                {displayableTextItems
                  .filter((item) => item.prov[0]?.page_no === index + 1)
                  .map((item) => {
                    const bbox = item.prov[0].bbox;
                    const isHighlighted =
                      hoveredItem === item.self_ref ||
                      selectedItem === item.self_ref;
                    // 좌표 변환 (BOTTOMLEFT 기준을 TOP-LEFT 기준으로)
                    const pageHeight = 841; // 일반적인 A4 PDF 높이
                    const scaledLeft = bbox.l * scale;
                    const scaledTop = (pageHeight - bbox.t) * scale;
                    const scaledWidth = (bbox.r - bbox.l) * scale;
                    const scaledHeight = (bbox.t - bbox.b) * scale;

                    return (
                      <div
                        key={`text-overlay__${item.self_ref}`}
                        className={`p-4 absolute rounded-md cursor-pointer z-10 border border-transparent opacity-50 ${
                          isHighlighted && "!border-black bg-blue-200"
                        }`}
                        style={{
                          left: `${scaledLeft}px`,
                          top: `${scaledTop}px`,
                          width: `${scaledWidth}px`,
                          height: `${scaledHeight}px`,
                        }}
                        onMouseEnter={() =>
                          handleMouseEnterPdfItem(item.self_ref)
                        }
                        onMouseLeave={handleMouseLeavePdfItem}
                        aria-label={item.text}
                        ref={(el) => {
                          pdfOverlaysRef.current[item.self_ref] = el;
                        }}
                      />
                    );
                  })}
              </div>
            ))}
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
