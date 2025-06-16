import type { TextItem } from "../../types";
import { getContentStyle } from "../../utils/styleHelpers";

interface TextRendererProps {
  text: TextItem;
}

const TextRenderer = ({ text }: TextRendererProps) => {
  // 텍스트 유형에 따라 적절한 태그 선택
  if (text.label === "section_header") {
    return (
      <h4 className={getContentStyle(text.label, text.text)}>{text.text}</h4>
    );
  }

  if (text.label === "list_item" || text.text.length > 100) {
    return (
      <p className={getContentStyle(text.label, text.text)}>{text.text}</p>
    );
  }

  return (
    <span className={getContentStyle(text.label, text.text)}>{text.text}</span>
  );
};

export default TextRenderer;
