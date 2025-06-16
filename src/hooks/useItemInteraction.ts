import { useCallback, type RefObject } from "react";

export const useItemInteraction = (
  pdfOverlaysRef: RefObject<Record<string, HTMLDivElement | null>>,
  jsonItemsRef: RefObject<Record<string, HTMLElement | null>>,
  setHoveredItem: React.Dispatch<React.SetStateAction<string | null>>,
  setSelectedItem?: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const handleMouseEnterPdfItem = useCallback(
    (itemRef: string) => {
      setHoveredItem(itemRef);

      const jsonItem = jsonItemsRef.current[itemRef];
      if (jsonItem) {
        jsonItem.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },
    [jsonItemsRef, setHoveredItem]
  );

  const handleMouseLeavePdfItem = useCallback(() => {
    setHoveredItem(null);
  }, [setHoveredItem]);

  const handleJsonItemClick = useCallback(
    (itemRef: string) => {
      if (setSelectedItem) {
        setSelectedItem(itemRef);
      }

      const overlayItem = pdfOverlaysRef.current[itemRef];
      if (overlayItem) {
        overlayItem.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },
    [pdfOverlaysRef, setSelectedItem]
  );

  return {
    handleMouseEnterPdfItem,
    handleMouseLeavePdfItem,
    handleJsonItemClick,
  };
};
