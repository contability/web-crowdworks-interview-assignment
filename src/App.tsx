import { useRef, useState } from "react";
import PdfViewer from "./components/PdfViewer";
import type { ReportData } from "./types";
import reportData from "./assets/data/1.report.json";
import JsonViewer from "./components/JsonViewer";

function App() {
  const report = reportData as ReportData;

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const pdfOverlaysRef = useRef<Record<string, HTMLDivElement | null>>({});
  const jsonItemsRef = useRef<Record<string, HTMLDivElement | null>>({});

  const displayableTextItems = report.texts.filter(
    (item) =>
      item.prov &&
      item.prov.length > 0 &&
      item.text &&
      ["section_header", "paragraph", "list_item"].includes(item.label)
  );

  return (
    <main className="flex h-dvh">
      <PdfViewer
        displayableTextItems={displayableTextItems}
        selectedItem={selectedItem}
        hoveredItem={hoveredItem}
        setHoveredItem={setHoveredItem}
        pdfOverlaysRef={pdfOverlaysRef}
        jsonItemsRef={jsonItemsRef}
      />
      <JsonViewer
        displayableTextItems={displayableTextItems}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        hoveredItem={hoveredItem}
        pdfOverlaysRef={pdfOverlaysRef}
        jsonItemsRef={jsonItemsRef}
      />
    </main>
  );
}

export default App;
