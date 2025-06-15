import type {
  ContentItem,
  TextItem,
  ReportData,
  ResolvedGroupItem,
} from "../types";

/**
 * 콘텐츠 아이템이 텍스트 아이템인지 확인하는 타입 가드
 */
export const isTextItem = (item: ContentItem): item is TextItem =>
  "text" in item && typeof item.text === "string";

/**
 * 콘텐츠 아이템이 테이블 아이템인지 확인하는 타입 가드
 */
export const isTableItem = (
  item: ContentItem
): item is ReportData["tables"][0] =>
  "data" in item && "table_cells" in item.data;

/**
 * 콘텐츠 아이템이 이미지 아이템인지 확인하는 타입 가드
 */
export const isPictureItem = (
  item: ContentItem
): item is ReportData["pictures"][0] => "image" in item && "uri" in item.image;

/**
 * 콘텐츠 아이템이 그룹 아이템인지 확인하는 타입 가드
 */
export const isGroupItem = (item: ContentItem): item is ResolvedGroupItem =>
  "name" in item && item.name === "list" && "resolvedChildren" in item;
