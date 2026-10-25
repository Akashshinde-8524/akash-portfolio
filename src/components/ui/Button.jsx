import { Link } from "react-router-dom";
import "./Button.css";

// Reusable pill CTA with three modes:
// - as="link" (default when `to` is given): internal navigation via React
//   Router, keeps the Phase 4 page transition intact.
// - as="a": a plain external link (GitHub, resume download, mailto, etc).
// - as="button": an in-page action with no navigation.
export function Button({ children, variant = "primary", as = "a", to, href, ...rest }) {
  const className = `button button--${variant}`;

  if (as === "link" || to) {
    return (
      <Link className={className} to={to} {...rest}>
        {children}
      </Link>
    );
  }

  if (as === "a") {
    return (
      <a className={className} href={href} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button className={className} {...rest}>
      {children}
    </button>
  );
}
