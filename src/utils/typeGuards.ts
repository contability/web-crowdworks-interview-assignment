import type {
  ContentItem,
  TextItem,
  ReportData,
  ResolvedGroupItem,
} from "../types";

export const isTextItem = (item: ContentItem): item is TextItem =>
  "text" in item && typeof item.text === "string";

export const isTableItem = (
  item: ContentItem
): item is ReportData["tables"][0] =>
  "data" in item && "table_cells" in item.data;

export const isPictureItem = (
  item: ContentItem
): item is ReportData["pictures"][0] => "image" in item && "uri" in item.image;

export const isGroupItem = (item: ContentItem): item is ResolvedGroupItem =>
  "name" in item && item.name === "list" && "resolvedChildren" in item;
