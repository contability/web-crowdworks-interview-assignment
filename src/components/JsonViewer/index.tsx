import { useCallback, type Dispatch, type RefObject } from "react";
import type { ContentItem } from "../../types";
import {
  isTextItem,
  isTableItem,
  isPictureItem,
  isGroupItem,
} from "../../utils/typeGuards";

import { useSectionContent } from "../../hooks/useSectionContent";
import { useItemInteraction } from "../../hooks/useItemInteraction";
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

const JsonViewer = ({
  pdfOverlaysRef,
  jsonItemsRef,
  hoveredItem,
  selectedItem,
  setSelectedItem,
  allContentItems,
}: JsonViewerProps) => {
  const { handleJsonItemClick } = useItemInteraction(
    pdfOverlaysRef,
    jsonItemsRef,
    setSelectedItem,
    setSelectedItem
  );

  const sectionContent = useSectionContent(allContentItems);

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
    <aside
      className="overflow-y-auto p-4 border-l border-gray-300"
      aria-label="JSON 콘텐츠 뷰어"
    >
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
    </aside>
  );
};

export default JsonViewer;
