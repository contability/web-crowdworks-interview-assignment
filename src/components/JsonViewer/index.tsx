import { useCallback, useMemo, type Dispatch, type RefObject } from "react";
import type { ContentItem, TextItem } from "../../types";
import {
  isTextItem,
  isTableItem,
  isPictureItem,
  isGroupItem,
} from "../../utils/typeGuards";

import Section from "./Section";
import TextRenderer from "./TextRenderer";
import TableRenderer from "./TableRenderer";
import ImageRenderer from "./ImageRenderer";
import GroupRenderer from "./GroupRenderer";

interface JsonViewerProps {
  selectedItem: string | null;
  hoveredItem: string | null;
  pdfOverlaysRef: RefObject<Record<string, HTMLDivElement | null>>;
  jsonItemsRef: RefObject<Record<string, HTMLElement | null>>;
  setSelectedItem: Dispatch<React.SetStateAction<string | null>>;
  allContentItems: ContentItem[];
}

/**
 * JSON 데이터를 시각적으로 표시하는 컴포넌트
 */
const JsonViewer = ({
  pdfOverlaysRef,
  jsonItemsRef,
  hoveredItem,
  selectedItem,
  setSelectedItem,
  allContentItems,
}: JsonViewerProps) => {
  // JSON 항목 클릭 시 PDF 영역에서 해당 항목 강조 및 스크롤
  const handleJsonItemClick = useCallback(
    (itemRef: string) => {
      setSelectedItem(itemRef);

      const overlayItem = pdfOverlaysRef.current[itemRef];
      if (overlayItem) {
        overlayItem.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },
    [pdfOverlaysRef, setSelectedItem]
  );

  // 섹션별로 콘텐츠 그룹화
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

      // 현재 섹션에 속하는 아이템들 (헤더 제외)
      const sectionItems = allContentItems.slice(
        currentHeaderIndex + 1,
        nextHeaderIndex
      );

      return {
        sectionHeaderItem: header,
        items: sectionItems,
      };
    });
  }, [allContentItems]);

  // 콘텐츠 타입에 따라 적절한 렌더러 컴포넌트 사용
  const renderContentItem = useCallback((item: ContentItem) => {
    if (isTextItem(item)) {
      return <TextRenderer key={`json-text__${item.self_ref}`} text={item} />;
    }

    if (isTableItem(item)) {
      return (
        <TableRenderer key={`json-table__${item.self_ref}`} table={item} />
      );
    }

    if (isPictureItem(item)) {
      return (
        <ImageRenderer key={`json-image__${item.self_ref}`} image={item} />
      );
    }

    if (isGroupItem(item)) {
      return (
        <GroupRenderer
          key={`json-group__${item.self_ref}`}
          group={item}
          renderContentItem={renderContentItem}
        />
      );
    }

    return null;
  }, []);

  return (
    <div className="overflow-y-auto p-4 border-l border-gray-300">
      <div className="flex flex-col gap-10">
        {sectionContent.map((content) => {
          const isHighlighted =
            hoveredItem === content.sectionHeaderItem.self_ref ||
            selectedItem === content.sectionHeaderItem.self_ref;

          return (
            <Section
              key={`json-section__${content.sectionHeaderItem.self_ref}`}
              sectionHeaderItem={content.sectionHeaderItem}
              items={content.items}
              isHighlighted={isHighlighted}
              onSectionClick={handleJsonItemClick}
              jsonItemsRef={jsonItemsRef}
              renderContentItem={renderContentItem}
            />
          );
        })}
      </div>
    </div>
  );
};

export default JsonViewer;
