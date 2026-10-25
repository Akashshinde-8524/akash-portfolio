import { Link } from "react-router-dom";
import { CardImage } from "../../ui/CardImage";
import { Tag } from "../../ui/Tag";
import "./ProjectCard.css";

// One reusable card per project. ProjectsPage maps this over data/projects.js
// — adding a project means adding an object there, never touching this file.
export function ProjectCard({ id, title, shortDescription, technologies, image, date }) {
  return (
    <Link to={`/projects/${id}`} className="project-card">
      <div className="project-card__image">
        <CardImage
          src={image}
          alt={image ? `${title} screenshot` : undefined}
          label={`${title} image placeholder`}
        />
      </div>

      <div className="project-card__body">
        {date && <p className="project-card__date">{date}</p>}
        <h2 className="project-card__title">{title}</h2>
        <p className="project-card__description">{shortDescription}</p>

        {technologies && technologies.length > 0 && (
          <div className="project-card__tags">
            {technologies.slice(0, 4).map((tech, idx) => (
              <Tag key={`${tech}-${idx}`}>{tech}</Tag>
            ))}
          </div>
        )}

        <span className="project-card__cta" aria-hidden="true">
          View case study →
        </span>
      </div>
    </Link>
  );
}
