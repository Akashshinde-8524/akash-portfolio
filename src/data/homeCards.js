import { profile } from "./profile";
import { experience } from "./experience";
import { skills } from "./skills";
import { projects } from "./projects";

// Configuration for the six homepage editorial cards.
// EditorialGrid maps over this array and renders one EditorialCard per entry —
// nothing here is hardcoded into the layout components. To change what a
// card says, edit its object below. To change how a variant LOOKS, edit
// EditorialCard.jsx's variant logic instead.
//
// `gridArea` must match a name used in EditorialGrid.css's
// grid-template-areas — that's what positions each card in the composition.

export const homeCards = [
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
    description: "PLACEHOLDER — recent roles and responsibilities.",
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
    description: projects[0]?.shortDescription ?? "A closer look at recent work — case studies, not just links.",
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
