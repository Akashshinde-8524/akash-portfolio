import { Header } from "./Header";
import "./PageShell.css";

// Shared chrome for every inner page: back-to-index header, section
// eyebrow + numeral, and a title. `children` is the actual page content —
// each page (About, Experience, ...) supplies its own, so this component
// never needs to change as real content gets added in later phases.
export function PageShell({ number, label, title, children }) {
  return (
    <>
      <Header />
      <main className="page-shell">
        <p className="page-shell__eyebrow">
          <span className="page-shell__number">{number}</span>
          {label}
        </p>
        <h1 className="page-shell__title">{title}</h1>
        <div className="page-shell__content">{children}</div>
      </main>
    </>
  );
}
