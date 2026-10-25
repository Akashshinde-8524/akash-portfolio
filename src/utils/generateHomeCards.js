// Helper to generate the 6 homepage editorial cards dynamically
// so they stay 100% in sync with the current portfolio data.
export function generateHomeCards({ profile, projects, experience, skills }) {
  // Only public/published projects should appear on the homepage card
  const publicProjects = projects.filter((p) => p.status !== "draft");
  const firstProject = publicProjects[0] || projects[0];

  return [
    {
      id: "intro",
      number: "01",
      label: "Intro",
      variant: "intro",
      gridArea: "intro",
      path: "/intro",
      title: profile.name,
      description: profile.statement,
      verticalLabel: "PORTFOLIO",
      hasImage: true,
      image: profile.introPhoto || profile.photo,
    },
    {
      id: "about",
      number: "02",
      label: "About me",
      variant: "about",
      gridArea: "about",
      path: "/about",
      title: "About",
      description: "A short read on background, education and what drives the work.",
      hasImage: true,
      image: profile.aboutPhoto || profile.photo,
    },
    {
      id: "experience",
      number: "03",
      label: "Experience",
      variant: "experience",
      gridArea: "experience",
      path: "/experience",
      title: "Experience",
      description: experience[0]
        ? `${experience[0].position} at ${experience[0].organization}`
        : "Recent roles and responsibilities.",
      meta: experience.slice(0, 2).map((entry) => entry.position),
      hasImage: false,
    },
    {
      id: "projects",
      number: "04",
      label: "Projects",
      variant: "projects",
      gridArea: "projects",
      path: "/projects",
      title: "Selected projects",
      description: firstProject?.shortDescription ?? "A closer look at recent work — case studies, not just links.",
      hasImage: true,
    },
    {
      id: "skills",
      number: "05",
      label: "Skills",
      variant: "skills",
      gridArea: "skills",
      path: "/skills",
      title: "Skills",
      description: "Tools and technologies in active use.",
      meta: skills.map((group) => group.category),
      hasImage: false,
    },
    {
      id: "contact",
      number: "06",
      label: "Contact",
      variant: "contact",
      gridArea: "contact",
      path: "/contact",
      title: "Get in touch",
      description: "Open to opportunities and conversations.",
      hasImage: false,
    },
  ];
}
