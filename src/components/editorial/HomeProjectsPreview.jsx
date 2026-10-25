import { useEffect, useState } from "react";
import { CardImage } from "../ui/CardImage";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { usePortfolioData } from "../../context";
import "./HomeProjectsPreview.css";

const ROTATE_MS = 3500;

// Homepage Projects card preview: auto-rotates through one thumbnail per
// project (crossfade), teasing the whole /projects page rather than just
// one static image. Sources its image list dynamically from usePortfolioData.
export function HomeProjectsPreview({ paused }) {
  const { projects } = usePortfolioData();
  const images = projects
    .filter((project) => project.status !== "draft")
    .map((project) => project.image)
    .filter(Boolean);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);

  const canRotate = images.length > 1 && !prefersReducedMotion;

  useEffect(() => {
    if (!canRotate || paused) return;
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [canRotate, paused, images.length]);

  if (images.length <= 1) {
    return (
      <CardImage src={images[0]} alt="" label="Projects image placeholder" loading="eager" />
    );
  }

  return (
    <div className="home-projects-preview">
      {images.map((src, i) => (
        <div key={src} className={`home-projects-preview__frame${i === index ? " is-visible" : ""}`}>
          {/* alt="" — decorative teaser; the same project info is fully
              available (with real alt text) on the Projects page itself. */}
          <CardImage src={src} alt="" loading={i === 0 ? "eager" : "lazy"} />
        </div>
      ))}
    </div>
  );
}
