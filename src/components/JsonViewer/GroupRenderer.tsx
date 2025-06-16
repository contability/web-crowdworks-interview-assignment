import type { ReactNode } from "react";
import type { ContentItem, ResolvedGroupItem } from "../../types";
import { isTextItem } from "../../utils/typeGuards";
import { getContentStyle } from "../../utils/styleHelpers";

interface GroupRendererProps {
  group: ResolvedGroupItem;
  renderContentItem: (item: ContentItem) => ReactNode;
}

const GroupRenderer = ({ group, renderContentItem }: GroupRendererProps) => {
  if (!group.resolvedChildren || group.resolvedChildren.length === 0) {
    return <p className="text-sm text-gray-500">비어있는 그룹</p>;
  }

  return (
    <div>
      {group.resolvedChildren.map((item) => {
        if (isTextItem(item)) {
          return (
            <div key={`group-item-${item.self_ref}`} className="mb-2">
              <p className={getContentStyle(item.label, item.text)}>
                {item.text}
              </p>
            </div>
          );
        }
        return renderContentItem(item);
      })}
    </div>
  );
};

export default GroupRenderer;
