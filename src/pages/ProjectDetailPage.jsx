import { useParams, Link, Navigate } from "react-router-dom";
import { PageShell } from "../components/layout/PageShell";
import { CardImage } from "../components/ui/CardImage";
import { Tag } from "../components/ui/Tag";
import { Button } from "../components/ui/Button";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { usePortfolioData } from "../context";
import "./ProjectDetailPage.css";

export function ProjectDetailPage() {
  const { id } = useParams();
  const { projects, profile } = usePortfolioData();
  const project = projects.find((item) => item.id === id);

  // Hooks can't be called conditionally, so this runs before the early
  // return below, with a sensible fallback title if the project isn't found.
  useDocumentTitle(project ? `${project.title} — ${profile.name}` : `Project not found — ${profile.name}`);

  // Someone hit a bad/old project URL — send them back to the list rather
  // than showing a broken page.
  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <PageShell number="04" label="Projects" title={project.title}>
      <div className="project-detail__image">
        <CardImage
          src={project.image}
          alt={project.image ? `${project.title} screenshot` : undefined}
          label={`${project.title} image placeholder`}
          loading="eager"
        />
      </div>

      {project.date && <p className="project-detail__date">{project.date}</p>}

      <p className="project-detail__description">{project.detailedDescription}</p>

      {project.features && project.features.length > 0 && (
        <div className="project-detail__block">
          <p className="project-detail__label">Features</p>
          <ul className="project-detail__features">
            {project.features.map((feature, idx) => (
              <li key={`${feature}-${idx}`}>{feature}</li>
            ))}
          </ul>
        </div>
      )}

      {project.technologies && project.technologies.length > 0 && (
        <div className="project-detail__block">
          <p className="project-detail__label">Technologies</p>
          <div className="project-detail__tags">
            {project.technologies.map((tech, idx) => (
              <Tag key={`${tech}-${idx}`}>{tech}</Tag>
            ))}
          </div>
        </div>
      )}

      <div className="project-detail__actions">
        {project.githubUrl && (
          <Button as="a" href={project.githubUrl} variant="secondary">
            GitHub
          </Button>
        )}
        {project.liveUrl && (
          <Button as="a" href={project.liveUrl} variant="primary">
            Live demo
          </Button>
        )}
      </div>

      <Link to="/projects" className="project-detail__back">
        ← Back to projects
      </Link>
    </PageShell>
  );
}
