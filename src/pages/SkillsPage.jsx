import { PageShell } from "../components/layout/PageShell";
import { SkillCategory } from "../components/sections/Skills/SkillCategory";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { usePortfolioData } from "../context";

export function SkillsPage() {
  const { skills, profile } = usePortfolioData();
  useDocumentTitle(`Skills — ${profile.name}`);

  return (
    <PageShell number="05" label="Skills" title="Skills">
      {skills.length === 0 ? (
        <p style={{ color: "var(--color-text-muted)" }}>No skills listed yet — check back soon.</p>
      ) : (
        <div>
          {skills.map((group) => (
            <SkillCategory key={group.category} {...group} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
