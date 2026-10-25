import { Tag } from "../../ui/Tag";
import "./ExperienceEntry.css";

// One reusable entry for the Experience page. The page maps this over
// data/experience.js — adding a new job means adding an object there,
// never touching this component.
export function ExperienceEntry({ position, organization, date, description, responsibilities, technologies }) {
  return (
    <article className="experience-entry">
      <header className="experience-entry__header">
        <div>
          <h2 className="experience-entry__position">{position}</h2>
          <p className="experience-entry__organization">{organization}</p>
        </div>
        <p className="experience-entry__date">{date}</p>
      </header>

      <p className="experience-entry__description">{description}</p>

      {responsibilities && responsibilities.length > 0 && (
        <ul className="experience-entry__responsibilities">
          {responsibilities.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      )}

      {technologies && technologies.length > 0 && (
        <div className="experience-entry__tags">
          {technologies.map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>
      )}
    </article>
  );
}
