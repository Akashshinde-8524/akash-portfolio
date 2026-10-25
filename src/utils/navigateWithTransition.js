import { flushSync } from "react-dom";

// Wraps a react-router `navigate` call in the native browser View
// Transitions API when it's available (and the user hasn't asked for
// reduced motion), so route changes get a soft fade/scale instead of an
// abrupt swap. Falls back to a plain instant navigation everywhere else —
// this is progressive enhancement, not a dependency (no animation library
// involved).
export function navigateWithTransition(navigate, path, prefersReducedMotion) {
  const supportsViewTransitions =
    typeof document !== "undefined" && typeof document.startViewTransition === "function";

  if (!supportsViewTransitions || prefersReducedMotion) {
    navigate(path);
    return;
  }

  document.startViewTransition(() => {
    // flushSync forces the route change to apply synchronously inside the
    // transition callback, which the View Transitions API needs in order
    // to capture an accurate "after" snapshot.
    flushSync(() => navigate(path));
  });
}
