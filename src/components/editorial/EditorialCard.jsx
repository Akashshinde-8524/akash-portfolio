import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SectionNumeral } from "./SectionNumeral";
import { VerticalLabel } from "./VerticalLabel";
import { CardImage } from "../ui/CardImage";
import { HomeProjectsPreview } from "./HomeProjectsPreview";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { navigateWithTransition } from "../../utils/navigateWithTransition";
import "./EditorialCard.css";

// One reusable card that renders all six homepage panels. Its visual
// composition changes based on `variant` and the optional content props
// (hasImage, meta, verticalLabel) — there is no separate IntroCard,
// AboutCard, etc.
//
// HOVER (Phase 3): isActive/isDimmed come from the parent EditorialGrid,
// which tracks which single card is hovered/focused across the whole set.
// Cursor position drives a small lift + tilt, switched off under
// prefers-reduced-motion.
//
// CLICK / NAVIGATION (Phase 4):
// - Mouse or keyboard: hover/focus already shows the preview, so a single
//   click/Enter navigates straight away.
// - Touch: there's no hover step on touch devices, so the first tap
//   reveals the preview (title glow, CTA, dimmed siblings) instead of
//   navigating immediately; a second tap on the same card follows through.
//   This mirrors how the desktop hover→click sequence feels, adapted for
//   a device with no hover.
export function EditorialCard({
  number,
  label,
  title,
  description,
  variant,
  meta,
  hasImage,
  image,
  verticalLabel,
  gridArea,
  path,
  isActive,
  isDimmed,
  onHoverStart,
  onHoverEnd,
}) {
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [lifted, setLifted] = useState(false);
  const [touchRevealed, setTouchRevealed] = useState(false);

  // If some other card becomes active (or nothing is), this card is no
  // longer "revealed" for touch purposes — keeps the tap state in sync
  // with whichever card the person is actually looking at. Adjusted
  // during render (React's documented pattern for "reset state when a
  // prop changes") rather than in an effect, which would cause an extra
  // render after every mount.
  const [prevIsActive, setPrevIsActive] = useState(isActive);
  if (isActive !== prevIsActive) {
    setPrevIsActive(isActive);
    if (!isActive) setTouchRevealed(false);
  }

  const showCta = variant !== "contact"; // contact already shows a static arrow next to its title

  function handleMouseEnter() {
    onHoverStart();
    setLifted(true);
  }

  function handleMouseMove(event) {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width;
    const relY = (event.clientY - rect.top) / rect.height;
    setTilt({
      rotateY: (relX - 0.5) * 2 * MAX_TILT_DEG,
      rotateX: -(relY - 0.5) * 2 * MAX_TILT_DEG,
    });
  }

  function handleMouseLeave() {
    onHoverEnd();
    setLifted(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  }

  // Keyboard focus mirrors hover for accessibility, but with no tilt
  // (there's no cursor position to track) — just the lift and active state.
  function handleFocus() {
    onHoverStart();
    setLifted(true);
  }

  function handleBlur() {
    onHoverEnd();
    setLifted(false);
  }

  function handleClick(event) {
    event.preventDefault();

    const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (isTouchDevice && !touchRevealed) {
      setTouchRevealed(true);
      onHoverStart();
      return;
    }

    navigateWithTransition(navigate, path, prefersReducedMotion);
  }

  const transform = prefersReducedMotion
    ? undefined
    : `perspective(900px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateY(${
        lifted ? -LIFT_PX : 0
      }px)`;

  return (
    <Link
      to={path}
      ref={cardRef}
      aria-label={`Go to ${label} section`}
      className={[
        "editorial-card",
        `editorial-card--${variant}`,
        isActive && "is-active",
        isDimmed && "is-dimmed",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ gridArea, transform }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
    >
      {verticalLabel && <VerticalLabel text={verticalLabel} />}

      <header className="editorial-card__header">
        <p className="editorial-card__label">{label}</p>
        <SectionNumeral number={number} size={variant === "intro" ? "large" : "default"} />
      </header>

      {hasImage && (
        <div className="editorial-card__image">
          {variant === "projects" ? (
            <HomeProjectsPreview paused={isActive} />
          ) : (
            <CardImage
              src={image}
              alt={image ? `${label} photo` : undefined}
              label={`${label} image placeholder`}
              loading="eager"
            />
          )}
        </div>
      )}

      <div className="editorial-card__body">
        <h2 className="editorial-card__title">{title}</h2>
        <p className="editorial-card__description">{description}</p>

        {meta && (
          <ul className="editorial-card__meta">
            {meta.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}

        {showCta && (
          <span className="editorial-card__cta" aria-hidden="true">
            View {label.toLowerCase()} →
          </span>
        )}
      </div>
    </Link>
  );
}

const MAX_TILT_DEG = 6;
const LIFT_PX = 8;
