import { Link, NavLink, useNavigate } from "react-router-dom";
import { usePortfolioData } from "../../context";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { navigateWithTransition } from "../../utils/navigateWithTransition";
import "./Header.css";

export function Header() {
  const { homeCards } = usePortfolioData();
  const navigate = useNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Routed the same way as the homepage cards' clicks (Phase 4), so moving
  // between pages via either nav gets the same soft page transition.
  function handleNavClick(event, path) {
    event.preventDefault();
    navigateWithTransition(navigate, path, prefersReducedMotion);
  }

  return (
    <>
      <header className="site-header">
        <Link to="/" className="site-header__brand" onClick={(event) => handleNavClick(event, "/")}>
          ← Home
        </Link>

        <nav className="site-header__nav" aria-label="Sections">
          <ul>
            {homeCards.map((card) => (
              <li key={card.id}>
                <NavLink
                  to={card.path}
                  onClick={(event) => handleNavClick(event, card.path)}
                  className={({ isActive }) => (isActive ? "is-active" : undefined)}
                >
                  <span className="site-header__nav-number">{card.number}</span>
                  {card.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Mobile only (see Header.css) — fixed bottom tab bar. Reuses the
          same accent numeral badge as the "icon" for each tab rather than
          introducing a separate icon set, matching the homepage cards. */}
      <nav className="mobile-tab-bar" aria-label="Sections">
        {homeCards.map((card) => (
          <NavLink
            key={card.id}
            to={card.path}
            onClick={(event) => handleNavClick(event, card.path)}
            className={({ isActive }) => `mobile-tab-bar__item${isActive ? " is-active" : ""}`}
          >
            <span className="mobile-tab-bar__numeral">{card.number}</span>
            <span className="mobile-tab-bar__label">{card.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
