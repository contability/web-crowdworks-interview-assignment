export const getContentStyle = (label: string, text: string): string => {
  if (label === "section_header") return "text-4xl font-bold";
  if (label === "list_item") {
    if (text.includes("•")) return "font-bold";
    if (text.includes("-")) return "pl-4";
    if (text.includes("*")) return "text-gray-500";
  }
  return "";
};
