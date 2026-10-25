import { useEffect } from "react";

// Sets document.title for whichever page is currently mounted. Each page
// calls this with its own full title, so titles stay correct across
// client-side route changes without needing a dependency like
// react-helmet for a site with only a handful of routes.
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
