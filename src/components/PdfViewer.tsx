import {
  useState,
  useCallback,
  useMemo,
  type Dispatch,
  type RefObject,
} from "react";
import { Document, Page, pdfjs } from "react-pdf";
// text layer의 위치를 잡아줌. 즉, OCR 적용된 것 처럼 만들어줌.
import "react-pdf/dist/Page/TextLayer.css";
import type { TextItem, ContentItem } from "../types";
import { isTextItem } from "../utils/typeGuards";

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

// 섹션 색상 매핑
const getSectionColor = (index: number): string => {
  const colors = [
    "rgba(219, 39, 119, 0.3)", // 핑크
    "rgba(59, 130, 246, 0.3)", // 파랑
    "rgba(16, 185, 129, 0.3)", // 초록
    "rgba(236, 72, 153, 0.3)", // 밝은 핑크
    "rgba(124, 58, 237, 0.3)", // 보라
    "rgba(245, 158, 11, 0.3)", // 주황
    "rgba(107, 114, 128, 0.3)", // 회색
  ];
  return colors[index % colors.length];
};

const PdfViewer = ({
  selectedItem,
  hoveredItem,
  pdfOverlaysRef,
  jsonItemsRef,
  setHoveredItem,
  allContentItems,
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

  // 섹션별로 콘텐츠 그룹화 - 섹션 헤더 기준 (JsonViewer와 동일한 방식)
  const sectionContent = useMemo(() => {
    // 섹션 헤더 아이템 찾기
    const sectionHeaders = allContentItems.filter(
      (item) => isTextItem(item) && item.label === "section_header"
    ) as TextItem[];

    // 섹션 헤더 기준으로 콘텐츠 그룹화
    return sectionHeaders.map((header, index) => {
      // 현재 섹션 헤더의 인덱스와 다음 섹션 헤더의 인덱스 찾기
      const currentHeaderIndex = allContentItems.findIndex(
        (item) => item.self_ref === header.self_ref
      );
      const nextHeaderIndex =
        index < sectionHeaders.length - 1
          ? allContentItems.findIndex(
              (item) => item.self_ref === sectionHeaders[index + 1].self_ref
            )
          : allContentItems.length;

      // 현재 섹션에 속하는 아이템들 (헤더 포함)
      const sectionItems = allContentItems.slice(
        currentHeaderIndex,
        nextHeaderIndex
      );

      return {
        sectionHeaderItem: header,
        items: sectionItems,
        color: getSectionColor(index),
      };
    });
  }, [allContentItems]);

  // 섹션별 오버레이 영역 계산
  const sectionsWithPageData = useMemo(() => {
    return sectionContent.map((section) => {
      const sectionItems = section.items;

      // 각 페이지별로 섹션의 텍스트 아이템 좌표 정보 저장
      const sectionTextItemsByPage = new Map<number, TextItem[]>();

      // 모든 아이템을 순회하며 텍스트 아이템만 필터링하여 페이지별로 그룹화
      sectionItems.forEach((item) => {
        if (
          isTextItem(item) &&
          item.prov &&
          item.prov.length > 0 &&
          Boolean(item.text)
        ) {
          const pageNo = item.prov[0].page_no;
          if (!sectionTextItemsByPage.has(pageNo)) {
            sectionTextItemsByPage.set(pageNo, []);
          }
          sectionTextItemsByPage.get(pageNo)?.push(item);
        }
      });

      // 페이지별 섹션 영역 반환
      return {
        sectionHeaderItem: section.sectionHeaderItem,
        sectionTextItemsByPage,
        color: section.color,
      };
    });
  }, [sectionContent]);

  // 섹션 전체 영역 계산 함수
  const calculateSectionBounds = (textItems: TextItem[], scale: number) => {
    if (textItems.length === 0) return null;

    const pageHeight = 841; // 일반적인 A4 PDF 높이

    // 모든 텍스트 아이템의 좌표를 사용하여 전체 영역 계산
    let minLeft = Infinity;
    let minTop = Infinity;
    let maxRight = -Infinity;
    let maxBottom = -Infinity;

    textItems.forEach((item) => {
      if (item.prov && item.prov.length > 0 && item.prov[0].bbox) {
        const bbox = item.prov[0].bbox;

        // 좌표 변환 (BOTTOMLEFT 기준을 TOP-LEFT 기준으로)
        const left = bbox.l;
        const top = pageHeight - bbox.t;
        const right = bbox.r;
        const bottom = pageHeight - bbox.b;

        minLeft = Math.min(minLeft, left);
        minTop = Math.min(minTop, top);
        maxRight = Math.max(maxRight, right);
        maxBottom = Math.max(maxBottom, bottom);
      }
    });

    return {
      left: minLeft * scale,
      top: minTop * scale,
      width: (maxRight - minLeft) * scale,
      height: (maxBottom - minTop) * scale,
    };
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-100">
      <div className="mx-auto w-fit overflow-auto p-4">
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

                {/* PDF 위에 섹션별로 그룹화된 오버레이 */}
                {sectionsWithPageData.map((section) => {
                  if (!section) return null;

                  const pageTextItems = section.sectionTextItemsByPage.get(
                    index + 1
                  );
                  if (!pageTextItems || pageTextItems.length === 0) return null;

                  // 섹션의 전체 영역 계산
                  const sectionBounds = calculateSectionBounds(
                    pageTextItems,
                    scale
                  );
                  if (!sectionBounds) return null;

                  const isHighlighted =
                    hoveredItem === section.sectionHeaderItem.self_ref;

                  // 섹션 전체를 감싸는 오버레이
                  return (
                    <div
                      key={`section-overlay__${
                        section.sectionHeaderItem.self_ref
                      }__${index + 1}`}
                      className={`absolute border-2 rounded-md z-10 transition-all duration-200 ${
                        isHighlighted
                          ? "opacity-70 border-black"
                          : "opacity-40 border-red-500"
                      }`}
                      style={{
                        left: `${sectionBounds.left - 10}px`,
                        top: `${sectionBounds.top - 10}px`,
                        width: `${sectionBounds.width + 20}px`,
                        height: `${sectionBounds.height + 20}px`,
                        backgroundColor: section.color,
                      }}
                      onMouseEnter={() => {
                        handleMouseEnterPdfItem(
                          section.sectionHeaderItem.self_ref
                        );
                      }}
                      onMouseLeave={handleMouseLeavePdfItem}
                      aria-label={`${section.sectionHeaderItem.text} 섹션`}
                      ref={(el) => {
                        if (el) {
                          pdfOverlaysRef.current[
                            section.sectionHeaderItem.self_ref
                          ] = el;
                        }
                      }}
                    >
                      {/* 섹션 제목 표시 */}
                      <div className="absolute top-0 left-0 bg-white px-2 py-1 text-sm font-bold border border-gray-300 rounded">
                        {section.sectionHeaderItem.text}
                      </div>
                    </div>
                  );
                })}

                {/* 선택된 항목에 대한 개별 하이라이트 */}
                {allContentItems
                  .filter(
                    (item): item is TextItem =>
                      isTextItem(item) &&
                      item.prov &&
                      item.prov.length > 0 &&
                      item.prov[0].page_no === index + 1
                  )
                  .map((item) => {
                    const isHighlighted =
                      hoveredItem === item.self_ref ||
                      selectedItem === item.self_ref;

                    if (!isHighlighted) return null;

                    const bbox = item.prov[0].bbox;

                    // 좌표 변환 (BOTTOMLEFT 기준을 TOP-LEFT 기준으로)
                    const pageHeight = 841; // 일반적인 A4 PDF 높이
                    const scaledLeft = bbox.l * scale;
                    const scaledTop = (pageHeight - bbox.t) * scale;
                    const scaledWidth = (bbox.r - bbox.l) * scale;
                    const scaledHeight = (bbox.t - bbox.b) * scale;

                    return (
                      <div
                        key={`text-highlight__${item.self_ref}`}
                        className="absolute border-2 border-black bg-blue-200 rounded-md z-20"
                        style={{
                          left: `${scaledLeft}px`,
                          top: `${scaledTop}px`,
                          width: `${scaledWidth}px`,
                          height: `${scaledHeight}px`,
                        }}
                      />
                    );
                  })}
              </div>
            ))}
          </Document>
        </div>
        <div className="mb-2 flex items-center gap-2 mx-auto w-fit">
          <button
            onClick={handleZoomOut}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-2xl"
            aria-label="축소"
          >
            -
          </button>
          <button
            onClick={handleZoomIn}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-2xl"
            aria-label="확대"
          >
            +
          </button>
          <span className="ml-2 text-lg">{Math.round(scale * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
