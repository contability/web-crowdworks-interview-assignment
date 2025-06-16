import { useMemo } from "react";
import type { ContentItem, TextItem } from "../types";
import { isTextItem } from "../utils/typeGuards";

export const useSectionContent = (allContentItems: ContentItem[]) => {
  return useMemo(() => {
    const sectionHeaders = allContentItems.filter(
      (item) => isTextItem(item) && item.label === "section_header"
    ) as TextItem[];

    return sectionHeaders.map((header, index) => {
      const currentHeaderIndex = allContentItems.findIndex(
        (item) => item.self_ref === header.self_ref
      );
      const nextHeaderIndex =
        index < sectionHeaders.length - 1
          ? allContentItems.findIndex(
              (item) => item.self_ref === sectionHeaders[index + 1].self_ref
            )
          : allContentItems.length;

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
};
