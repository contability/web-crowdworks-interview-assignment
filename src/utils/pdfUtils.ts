import type { ContentItem, TextItem } from "../types";

type BBox = {
  l: number;
  t: number;
  r: number;
  b: number;
  coord_origin: string;
};

type ItemWithProv = {
  prov: Array<{
    page_no: number;
    bbox: BBox;
  }>;
};

export const calculateSectionBounds = (
  items: ContentItem[],
  scale: number,
  headerItem: TextItem
) => {
  const pageHeight = 841;

  const headerBbox = headerItem.prov[0].bbox;
  let minLeft = headerBbox.l;
  let minTop = pageHeight - headerBbox.t;
  let maxRight = headerBbox.r;
  let maxBottom = pageHeight - headerBbox.b;

  const filteredItems = items.filter(
    (item) => item.self_ref !== headerItem.self_ref
  );

  if (filteredItems.length > 0) {
    const lastItem = filteredItems[filteredItems.length - 1];

    const findLastItemBbox = (
      item: ContentItem
    ): {
      bbox: BBox;
      pageNo: number;
    } | null => {
      if ("resolvedChildren" in item) {
        const groupItem = item as { resolvedChildren: ContentItem[] };
        if (
          Array.isArray(groupItem.resolvedChildren) &&
          groupItem.resolvedChildren.length > 0
        ) {
          for (let i = groupItem.resolvedChildren.length - 1; i >= 0; i--) {
            const child = groupItem.resolvedChildren[i] as ContentItem;
            const childBbox = findLastItemBbox(child);
            if (childBbox) {
              return childBbox;
            }
          }
        }
      }

      const prov = (item as ItemWithProv).prov[0];

      return {
        bbox: prov.bbox,
        pageNo: prov.page_no,
      };
    };

    const lastItemBbox = findLastItemBbox(lastItem);

    if (lastItemBbox) {
      const lastBbox = lastItemBbox.bbox;

      const lastLeft = lastBbox.l;
      const lastTop = pageHeight - lastBbox.t;
      const lastRight = lastBbox.r;
      const lastBottom = pageHeight - lastBbox.b;

      minLeft = Math.min(minLeft - 10, lastLeft);
      minTop = Math.min(minTop - 5, lastTop);
      maxRight = Math.max(maxRight, lastRight);
      maxBottom = Math.max(maxBottom, lastBottom);
    }
  }

  minLeft = Math.max(0, minLeft);
  minTop = Math.max(0, minTop);

  const width = Math.max((maxRight - minLeft + 10) * scale, 250);
  const height = Math.max((maxBottom - minTop + 10) * scale, 50);

  return {
    left: minLeft * scale,
    top: minTop * scale,
    width: width,
    height: height,
  };
};
