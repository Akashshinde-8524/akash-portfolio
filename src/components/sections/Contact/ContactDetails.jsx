import { usePortfolioData } from "../../../context";
import { formatExternalUrl } from "../../../utils/formatUrl";
import "./ContactDetails.css";

// Reads dynamically from usePortfolioData — update your email, links or
// resume in the dashboard and this list follows automatically.
export function ContactDetails() {
  const { profile } = usePortfolioData();
  const items = [
    { label: "Email", value: profile.contact.email, href: profile.links.email },
    { label: "Phone", value: profile.contact.phone, href: `tel:${profile.contact.phone.replace(/\s+/g, "")}` },
    { label: "Location", value: profile.location },
    { label: "GitHub", value: "View profile", href: profile.links.github, isExternal: true },
    { label: "LinkedIn", value: "View profile", href: profile.links.linkedin, isExternal: true },
    { label: "Resume", value: "Download PDF", href: profile.links.resume, download: true },
  ];

  return (
    <dl className="contact-details">
      {items.map((item) => (
        <div className="contact-details__item" key={item.label}>
          <dt>{item.label}</dt>
          <dd>
            {item.href ? (
              <a
                href={item.isExternal ? formatExternalUrl(item.href) : item.href}
                target={item.isExternal ? "_blank" : undefined}
                rel={item.isExternal ? "noopener noreferrer" : undefined}
                download={item.download ? "Akash_Shinde_Resume.pdf" : undefined}
              >
                {item.value}
              </a>
            ) : (
              item.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
