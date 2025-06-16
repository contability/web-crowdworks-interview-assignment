import { useState, type Dispatch, type RefObject } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/TextLayer.css";
import type { ContentItem } from "../../types";
import { useZoom } from "../../hooks/useZoom";
import { useItemInteraction } from "../../hooks/useItemInteraction";
import { useSectionContent } from "../../hooks/useSectionContent";
import PdfSectionOverlay from "./PdfSectionOverlay";
import ZoomControls from "./ZoomControls";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PdfViewerProps {
  selectedItem: string | null;
  hoveredItem: string | null;
  pdfOverlaysRef: RefObject<Record<string, HTMLDivElement | null>>;
  jsonItemsRef: RefObject<Record<string, HTMLElement | null>>;
  setHoveredItem: Dispatch<React.SetStateAction<string | null>>;
  allContentItems: ContentItem[];
}

const PdfViewer = ({
  selectedItem,
  hoveredItem,
  pdfOverlaysRef,
  jsonItemsRef,
  setHoveredItem,
  allContentItems,
}: PdfViewerProps) => {
  const [numPages, setNumPages] = useState(0);
  const { scale, zoomIn, zoomOut } = useZoom();
  const { handleMouseEnterPdfItem, handleMouseLeavePdfItem } =
    useItemInteraction(pdfOverlaysRef, jsonItemsRef, setHoveredItem);

  const sectionContent = useSectionContent(allContentItems);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <section className="flex-1 overflow-auto bg-gray-100" aria-label="PDF 뷰어">
      <article className="mx-auto w-fit overflow-auto p-4">
        <figure>
          <Document
            file="/reports/1.report.pdf"
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

                {sectionContent.map((section) => (
                  <PdfSectionOverlay
                    key={`section-overlay__${
                      section.sectionHeaderItem.self_ref
                    }-${index + 1}`}
                    section={section}
                    scale={scale}
                    isHighlighted={
                      hoveredItem === section.sectionHeaderItem.self_ref ||
                      selectedItem === section.sectionHeaderItem.self_ref
                    }
                    pdfOverlaysRef={pdfOverlaysRef}
                    onMouseEnter={handleMouseEnterPdfItem}
                    onMouseLeave={handleMouseLeavePdfItem}
                  />
                ))}
              </div>
            ))}
          </Document>
        </figure>
        <footer>
          <ZoomControls scale={scale} onZoomIn={zoomIn} onZoomOut={zoomOut} />
        </footer>
      </article>
    </section>
  );
};

export default PdfViewer;
