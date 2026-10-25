import "./CardImage.css";

// Renders a real <img> when `src` is provided; otherwise falls back to the
// clearly-marked placeholder pattern. This means swapping in a real photo
// is just a matter of adding a path in the data layer (e.g. profile.photo)
// — no component code needs to change.
//
// `loading` defaults to "lazy" (the safe default for images that might be
// below the fold, like the projects grid). Pass loading="eager" for images
// that are always visible immediately on page load (portraits, homepage
// cards) — lazy-loading those can actually delay how soon they appear.
export function CardImage({ src, alt, label = "Image placeholder", loading = "lazy" }) {
  if (src) {
    return <img className="card-image" src={src} alt={alt || ""} loading={loading} />;
  }

  return (
    <div className="card-image-placeholder" role="img" aria-label={label}>
      <span>{label}</span>
    </div>
  );
}
