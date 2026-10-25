import { PageShell } from "../components/layout/PageShell";
import { Tag } from "../components/ui/Tag";
import { CardImage } from "../components/ui/CardImage";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { usePortfolioData } from "../context";
import "./AboutPage.css";

export function AboutPage() {
  const { profile } = usePortfolioData();
  useDocumentTitle(`About — ${profile.name}`);

  return (
    <PageShell number="02" label="About me" title="About">
      <div className="about-page__intro">
        <div className="about-page__portrait">
          <CardImage src={profile.aboutPhoto || profile.photo} alt={`Portrait of ${profile.name}`} loading="eager" />
        </div>

        <div className="about-page__bio">
          {profile.about.bio.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      <dl className="about-page__facts">
        <div className="about-page__fact">
          <dt>Education</dt>
          <dd>
            {profile.education.degree}
            <br />
            {profile.education.institution}
            <br />
            {profile.education.duration} · {profile.education.gpa}
          </dd>
        </div>

        <div className="about-page__fact">
          <dt>Currently learning</dt>
          <dd>{profile.currentlyLearning}</dd>
        </div>

        <div className="about-page__fact">
          <dt>Career direction</dt>
          <dd>{profile.about.careerDirection}</dd>
        </div>
      </dl>

      <div className="about-page__strengths">
        <p className="about-page__strengths-label">Strengths</p>
        <div className="about-page__tags">
          {profile.about.strengths.map((strength) => (
            <Tag key={strength}>{strength}</Tag>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
