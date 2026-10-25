import { Tag } from "../../ui/Tag";
import "./SkillCategory.css";

// One reusable category block. SkillsPage maps this over data/skills.js —
// adding a category or a skill means editing that data file, never this
// component.
export function SkillCategory({ category, items }) {
  return (
    <div className="skill-category">
      <p className="skill-category__label">{category}</p>
      <div className="skill-category__tags">
        {items.map((item) => (
          <Tag key={item}>{item}</Tag>
        ))}
      </div>
    </div>
  );
}
