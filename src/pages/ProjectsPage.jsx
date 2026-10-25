import { PageShell } from "../components/layout/PageShell";
import { ProjectCard } from "../components/sections/Projects/ProjectCard";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { usePortfolioData } from "../context";
import "./ProjectsPage.css";

export function ProjectsPage() {
  const { projects, profile } = usePortfolioData();
  useDocumentTitle(`Projects — ${profile.name}`);

  // Display published projects for visitors
  const publicProjects = projects.filter((project) => project.status !== "draft");

  return (
    <PageShell number="04" label="Projects" title="Selected projects">
      {publicProjects.length === 0 ? (
        <p style={{ color: "var(--color-text-muted)" }}>No projects listed yet — check back soon.</p>
      ) : (
        <div className="projects-grid">
          {publicProjects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
