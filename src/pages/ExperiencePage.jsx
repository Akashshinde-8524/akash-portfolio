import { PageShell } from "../components/layout/PageShell";
import { ExperienceEntry } from "../components/sections/Experience/ExperienceEntry";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { usePortfolioData } from "../context";

export function ExperiencePage() {
  const { experience, profile } = usePortfolioData();
  useDocumentTitle(`Experience — ${profile.name}`);

  return (
    <PageShell number="03" label="Experience" title="Experience">
      {experience.length === 0 ? (
        <p style={{ color: "var(--color-text-muted)" }}>
          No experience listed yet — check back soon.
        </p>
      ) : (
        <div>
          {experience.map((entry) => (
            <ExperienceEntry key={entry.id} {...entry} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
