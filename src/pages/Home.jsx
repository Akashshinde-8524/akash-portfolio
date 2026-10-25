import { EditorialGrid } from "../components/editorial/EditorialGrid";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { usePortfolioData } from "../context";

export function Home() {
  const { profile } = usePortfolioData();
  useDocumentTitle(`${profile.name} — Portfolio`);

  return (
    <main>
      <h1 className="visually-hidden">{profile.name} — Portfolio</h1>
      <EditorialGrid />
    </main>
  );
}
