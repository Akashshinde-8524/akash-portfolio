import "./Tag.css";

// Small pill tag. Used on the About page for strengths/interests, and
// designed to be reused as-is for the Skills page in Phase 8.
export function Tag({ children }) {
  return <span className="tag">{children}</span>;
}
