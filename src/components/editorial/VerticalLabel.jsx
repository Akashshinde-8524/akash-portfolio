import "./VerticalLabel.css";

// Decorative rotated text, used only on the intro card to echo the
// magazine reference's vertical "Portfolio." treatment.
// aria-hidden because the same information (the section label) is already
// present as real, readable text elsewhere in the card — this is a visual
// flourish, not the accessible name for anything.
export function VerticalLabel({ text }) {
  return (
    <span className="vertical-label" aria-hidden="true">
      {text}
    </span>
  );
}
