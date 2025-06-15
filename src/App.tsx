import { useRef, useState } from "react";
import PdfViewer from "./components/PdfViewer";
import type { ReportData, ContentItem, ResolvedGroupItem } from "./types";
import reportData from "./assets/data/1.report.json";
import JsonViewer from "./components/JsonViewer";

function App() {
  const report = reportData as ReportData;

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const pdfOverlaysRef = useRef<Record<string, HTMLDivElement | null>>({});
  const jsonItemsRef = useRef<Record<string, HTMLElement | null>>({});

  // 참조 경로에서 아이템을 찾는 함수
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

  // 그룹 아이템의 모든 자식 요소를 재귀적으로 가져오는 함수
  const resolveGroupChildren = (groupRef: string): ContentItem[] => {
    const group = findItemByRef(groupRef);
    if (!group || !("children" in group)) return [];

    const children = group.children as { $ref: string }[];
    return children
      .map((childRef) => findItemByRef(childRef.$ref) as ContentItem)
      .filter((item): item is ContentItem => item !== null);
  };

  // PDF의 내용 순서대로 모든 콘텐츠를 가져오기 위해 body.children을 활용
  const allContentItems = report.body.children
    .map((childRef) => {
      const refPath = childRef.$ref;
      const item = findItemByRef(refPath);

      // 그룹 아이템인 경우 자식 요소들을 재귀적으로 가져옴
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
