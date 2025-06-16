import { useRef, useState } from "react";
import type { ReportData, ContentItem, ResolvedGroupItem } from "./types";
import reportData from "./assets/data/1.report.json";
import JsonViewer from "./components/JsonViewer";
import PdfViewer from "./components/PdfViewer";

function App() {
  const report = reportData as ReportData;

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const pdfOverlaysRef = useRef<Record<string, HTMLDivElement | null>>({});
  const jsonItemsRef = useRef<Record<string, HTMLElement | null>>({});

  const findItemByRef = (refPath: string): ContentItem | null => {
    const [type, index] = refPath.replace("#/", "").split("/");

    switch (type) {
      case "texts":
        return report.texts[Number(index)];
      case "tables":
        return report.tables[Number(index)];
      case "pictures":
        return report.pictures[Number(index)];
      case "groups":
        return report.groups[Number(index)];
      default:
        return null;
    }
  };

  const resolveGroupChildren = (groupRef: string): ContentItem[] => {
    const group = findItemByRef(groupRef);
    if (!group || !("children" in group)) return [];

    const children = group.children as { $ref: string }[];
    return children
      .map((childRef) => findItemByRef(childRef.$ref) as ContentItem)
      .filter((item): item is ContentItem => item !== null);
  };

  const allContentItems = report.body.children
    .map((childRef) => {
      const refPath = childRef.$ref;
      const item = findItemByRef(refPath);

      if (item && "name" in item && item.name === "list") {
        return {
          ...item,
          resolvedChildren: resolveGroupChildren(item.self_ref),
        } as ResolvedGroupItem;
      }

      return item;
    })
    .filter((item): item is ContentItem => item !== null);

  return (
    <main className="flex h-dvh">
      <PdfViewer
        selectedItem={selectedItem}
        hoveredItem={hoveredItem}
        setHoveredItem={setHoveredItem}
        pdfOverlaysRef={pdfOverlaysRef}
        jsonItemsRef={jsonItemsRef}
        allContentItems={allContentItems}
      />
      <JsonViewer
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        hoveredItem={hoveredItem}
        pdfOverlaysRef={pdfOverlaysRef}
        jsonItemsRef={jsonItemsRef}
        allContentItems={allContentItems}
      />
    </main>
  );
}

export default App;
