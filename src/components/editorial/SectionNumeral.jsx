import "./SectionNumeral.css";

// Small numeral badge (e.g. "04") placed on every editorial card.
// `size` lets the intro card show a larger badge without a separate component.
export function SectionNumeral({ number, size = "default" }) {
  return (
    <span className={`numeral numeral--${size}`} aria-hidden="true">
      {number}
    </span>
  );
}
