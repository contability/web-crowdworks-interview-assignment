/**
 * 텍스트 아이템의 레이블과 내용에 따라 적절한 스타일 클래스를 반환
 * @param label 텍스트 아이템의 레이블
 * @param text 텍스트 아이템의 내용
 * @returns 적용할 CSS 클래스 문자열
 */
export const getContentStyle = (label: string, text: string): string => {
  if (label === "section_header") return "text-4xl font-bold";
  if (label === "list_item") {
    if (text.includes("•")) return "font-bold";
    if (text.includes("-")) return "pl-4";
    if (text.includes("*")) return "text-gray-500";
  }
  return "";
};
