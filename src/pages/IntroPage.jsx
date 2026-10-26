import { PageShell } from "../components/layout/PageShell";
import { Button } from "../components/ui/Button";
import { CardImage } from "../components/ui/CardImage";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { usePortfolioData } from "../context";
import { formatExternalUrl } from "../utils/formatUrl";
import "./IntroPage.css";

export function IntroPage() {
  const { profile } = usePortfolioData();
  useDocumentTitle(`Introduction — ${profile.name}`);

  return (
    <PageShell number="01" label="Intro" title="Introduction">
      <div className="intro-page__layout">
        <div className="intro-page__text">
          <p className="intro-page__name">{profile.name}</p>
          <p className="intro-page__role">{profile.role}</p>

          <p className="intro-page__statement">{profile.statement}</p>

          <p className="intro-page__learning">
            Currently learning: <strong>{profile.currentlyLearning}</strong>
          </p>

          <div className="intro-page__actions">
            <Button to="/projects" variant="primary">
              View projects
            </Button>
            <Button as="a" href={profile.links.resume} variant="secondary" download="Akash_Shinde_Resume.pdf">
              Download resume
            </Button>
          </div>

          <ul className="intro-page__links">
            <li>
              <a
                href={formatExternalUrl(profile.links.github)}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href={formatExternalUrl(profile.links.linkedin)}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a href={profile.links.email}>Email</a>
            </li>
          </ul>
        </div>

        <div className="intro-page__portrait">
          <CardImage src={profile.introPhoto || profile.photo} alt={`Portrait of ${profile.name}`} loading="eager" />
        </div>
      </div>
    </PageShell>
  );
}
