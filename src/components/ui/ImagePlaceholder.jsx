import "./ImagePlaceholder.css";

// Clearly-marked placeholder standing in for a real photo/screenshot.
// Swap in a real <img> (with meaningful alt text) once assets are available —
// this component's job is to make it obvious this is a stand-in, not a bug.
export function ImagePlaceholder({ label = "Image placeholder" }) {
  return (
    <div className="image-placeholder" role="img" aria-label={label}>
      <span>{label}</span>
    </div>
  );
}
