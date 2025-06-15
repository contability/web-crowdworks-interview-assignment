import type { TextItem } from "../../types";
import { getContentStyle } from "../../utils/styleHelpers";

interface TextRendererProps {
  text: TextItem;
}

const TextRenderer = ({ text }: TextRendererProps) => {
  return <p className={getContentStyle(text.label, text.text)}>{text.text}</p>;
};

export default TextRenderer;
