import { useCallback, type Dispatch, type RefObject } from "react";
import type { ReportData } from "../types";

interface JsonViewerProps {
  displayableTextItems: ReportData["texts"];
  selectedItem: string | null;
  hoveredItem: string | null;
  pdfOverlaysRef: RefObject<Record<string, HTMLDivElement | null>>;
  jsonItemsRef: RefObject<Record<string, HTMLDivElement | null>>;
  setSelectedItem: Dispatch<React.SetStateAction<string | null>>;
}

const JsonViewer = ({
  displayableTextItems,
  pdfOverlaysRef,
  jsonItemsRef,
  hoveredItem,
  selectedItem,
  setSelectedItem,
}: JsonViewerProps) => {
  // JSON 항목 클릭 시 PDF 영역에서 해당 항목 강조 및 스크롤 (메모이제이션 적용)
  const handleJsonItemClick = useCallback(
    (itemRef: string) => {
      setSelectedItem(itemRef);

      const overlayItem = pdfOverlaysRef.current[itemRef];
      if (overlayItem)
        overlayItem.scrollIntoView({ behavior: "smooth", block: "center" });
    },
    [pdfOverlaysRef, setSelectedItem]
  );

  return (
    <div className="overflow-y-auto p-4 border-l border-gray-300">
      <h2 className="text-xl font-bold mb-4">문서 구조</h2>

      <div className="flex flex-col gap-10">
        {displayableTextItems.map((item) => {
          const isHighlighted =
            hoveredItem === item.self_ref || selectedItem === item.self_ref;

          return (
            <div
              key={item.self_ref}
              ref={(el) => {
                jsonItemsRef.current[item.self_ref] = el;
              }}
              className={`p-2 rounded-md cursor-pointer transition-colors duration-200 ${
                isHighlighted ? "bg-yellow-200" : "hover:bg-gray-100"
              }`}
              onClick={() => handleJsonItemClick(item.self_ref)}
            >
              <p className="mt-1">{item.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JsonViewer;
