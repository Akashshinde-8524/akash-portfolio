import { usePortfolioData } from "../../../context";
import "./ContactDetails.css";

// Reads dynamically from usePortfolioData — update your email, links or
// resume in the dashboard and this list follows automatically.
export function ContactDetails() {
  const { profile } = usePortfolioData();
  const items = [
    { label: "Email", value: profile.contact.email, href: profile.links.email },
    { label: "Phone", value: profile.contact.phone, href: `tel:${profile.contact.phone.replace(/\s+/g, "")}` },
    { label: "Location", value: profile.location },
    { label: "GitHub", value: "View profile", href: profile.links.github },
    { label: "LinkedIn", value: "View profile", href: profile.links.linkedin },
    { label: "Resume", value: "Download PDF", href: profile.links.resume },
  ];

  return (
    <dl className="contact-details">
      {items.map((item) => (
        <div className="contact-details__item" key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.href ? <a href={item.href}>{item.value}</a> : item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
