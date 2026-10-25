import { useState } from "react";
import { Button } from "../../ui/Button";
import { usePortfolioData } from "../../../context";
import "./ContactForm.css";

export function ContactForm() {
  const { profile } = usePortfolioData();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const subject = encodeURIComponent(`Portfolio contact from ${name || "a visitor"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${profile.contact.email}?subject=${subject}&body=${body}`;
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form__field">
        <label htmlFor="contact-name">Name</label>
        <input id="contact-name" type="text" value={name} onChange={(event) => setName(event.target.value)} required />
      </div>

      <div className="contact-form__field">
        <label htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div className="contact-form__field">
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
        />
      </div>

      <Button as="button" type="submit" variant="primary">
        Send message
      </Button>

      <p className="contact-form__note">Submitting opens your email client with this message pre-filled.</p>
    </form>
  );
}
