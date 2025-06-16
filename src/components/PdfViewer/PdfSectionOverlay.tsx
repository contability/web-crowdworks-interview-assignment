import { type RefObject } from "react";
import type { ContentItem, TextItem } from "../../types";
import { calculateSectionBounds } from "../../utils/pdfUtils";

interface PdfSectionOverlayProps {
  section: {
    sectionHeaderItem: TextItem;
    items: ContentItem[];
  };
  scale: number;
  isHighlighted: boolean;
  pdfOverlaysRef: RefObject<Record<string, HTMLDivElement | null>>;
  onMouseEnter: (itemRef: string) => void;
  onMouseLeave: () => void;
}

const PdfSectionOverlay = ({
  section,
  scale,
  isHighlighted,
  pdfOverlaysRef,
  onMouseEnter,
  onMouseLeave,
}: PdfSectionOverlayProps) => {
  const sectionBounds = calculateSectionBounds(
    section.items,
    scale,
    section.sectionHeaderItem
  );

  if (!sectionBounds) return null;

  return (
    <div
      className={`absolute border-2 border-transparent rounded-md z-10 transition-all duration-200 cursor-pointer ${
        isHighlighted && "opacity-30 !border-black bg-blue-200"
      }`}
      style={{
        left: `${sectionBounds.left}px`,
        top: `${sectionBounds.top}px`,
        width: `${sectionBounds.width}px`,
        height: `${sectionBounds.height}px`,
      }}
      onMouseEnter={() => onMouseEnter(section.sectionHeaderItem.self_ref)}
      onMouseLeave={onMouseLeave}
      aria-label={`${section.sectionHeaderItem.text} 섹션`}
      ref={(el) => {
        if (el) {
          pdfOverlaysRef.current[section.sectionHeaderItem.self_ref] = el;
        }
      }}
    />
  );
};

export default PdfSectionOverlay;
