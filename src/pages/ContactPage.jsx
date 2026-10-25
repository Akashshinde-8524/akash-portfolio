import { PageShell } from "../components/layout/PageShell";
import { ContactDetails } from "../components/sections/Contact/ContactDetails";
import { ContactForm } from "../components/sections/Contact/ContactForm";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { usePortfolioData } from "../context";
import "./ContactPage.css";

export function ContactPage() {
  const { profile } = usePortfolioData();
  useDocumentTitle(`Contact — ${profile.name}`);

  return (
    <PageShell number="06" label="Contact" title="Get in touch">
      <div className="contact-page__layout">
        <ContactDetails />
        <ContactForm />
      </div>
    </PageShell>
  );
}
