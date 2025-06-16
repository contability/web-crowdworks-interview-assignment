import type { ReactNode } from "react";
import type { ContentItem, TextItem } from "../../types";

interface SectionProps {
  sectionHeaderItem: TextItem;
  items: ContentItem[];
  isHighlighted: boolean;
  onSectionClick: (itemRef: string) => void;
  jsonItemsRef: React.RefObject<Record<string, HTMLElement | null>>;
  renderContentItem: (item: ContentItem) => ReactNode;
}

const Section = ({
  sectionHeaderItem,
  items,
  isHighlighted,
  onSectionClick,
  jsonItemsRef,
  renderContentItem,
}: SectionProps) => {
  return (
    <section
      className={`mb-8 rounded-md cursor-pointer transition-colors duration-200 p-2 ${
        isHighlighted ? "bg-yellow-200" : "hover:bg-gray-100"
      }`}
      ref={(el) => {
        if (el) jsonItemsRef.current[sectionHeaderItem.self_ref] = el;
      }}
      onClick={() => onSectionClick(sectionHeaderItem.self_ref)}
    >
      <h3 className="text-3xl font-bold">{sectionHeaderItem.text}</h3>
      <div className="mt-4 space-y-3 pl-4">
        {items.map((item) => renderContentItem(item))}
      </div>
    </section>
  );
};

export default Section;
