import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
// text layer의 위치를 잡아줌. 즉, OCR 적용된 것 처럼 만들어줌.
import "react-pdf/dist/Page/TextLayer.css";
import reportData from "./assets/data/1.report.json";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// 리포트 데이터 타입 정의
interface TextItem {
  self_ref: string;
  parent: { $ref: string };
  children: unknown[];
  content_layer: string;
  label: string;
  prov: {
    page_no: number;
    bbox: { l: number; t: number; r: number; b: number; coord_origin: string };
    charspan: number[];
  }[];
  orig: string;
  text: string;
  level?: number;
  enumerated?: boolean;
  marker?: string;
}

interface TableItem {
  self_ref: string;
  parent: { $ref: string };
  children: unknown[];
  content_layer: string;
  label: string;
  prov: unknown[];
  captions: unknown[];
  references: unknown[];
  footnotes: unknown[];
  data: {
    table_cells: unknown[];
    num_rows: number;
    num_cols: number;
    grid: unknown[][];
  };
}

interface PictureItem {
  self_ref: string;
  parent: { $ref: string };
  children: unknown[];
  content_layer: string;
  label: string;
  prov: unknown[];
  captions: unknown[];
  references: unknown[];
  footnotes: unknown[];
  image: {
    mimetype: string;
    dpi: number;
    size: { width: number; height: number };
    uri: string;
  };
}

interface GroupItem {
  self_ref: string;
  parent: { $ref: string };
  children: { $ref: string }[];
  content_layer: string;
  name: string;
  label: string;
}

interface ReportData {
  schema_name: string;
  version: string;
  name: string;
  origin: {
    mimetype: string;
    binary_hash: number;
    filename: string;
  };
  body: {
    self_ref: string;
    children: { $ref: string }[];
    content_layer: string;
    name: string;
    label: string;
  };
  texts: TextItem[];
  tables: TableItem[];
  pictures: PictureItem[];
  groups: GroupItem[];
}

const PdfViewer = () => {
  const [numPages, setNumPages] = useState(0);
  // 타입 단언으로 JSON 데이터 사용
  const report = reportData as ReportData;

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    // JSON 데이터 확인용 로그
    console.log("Report name:", report.name);
    console.log("Text items count:", report.texts?.length || 0);
    console.log("Table items count:", report.tables?.length || 0);

    // 섹션 헤더 텍스트 항목 찾기
    const sectionHeaders = report.texts.filter(
      (item) => item.label === "section_header"
    );
    console.log(
      "Section headers:",
      sectionHeaders.map((h) => h.text)
    );
  };

  return (
    <div className="relative w-fit">
      <div>
        <Document
          file="../public/reports/1.report.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {Array.from(new Array(numPages), (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderAnnotationLayer={false}
              className="!max-w-[200px]"
            />
          ))}
        </Document>
      </div>
      <button
        className="absolute cursor-pointer text-transparent bg-blue-950 z-10"
        style={{
          left: `${report.texts[0].prov[0].bbox.l}px`,
          top: `calc(${report.texts[0].prov[0].bbox.t}px - ${report.texts[0].prov[0].bbox.b}px)`,
        }}
      >
        {report.texts[0].text}
      </button>
    </div>
  );
};

export default PdfViewer;
