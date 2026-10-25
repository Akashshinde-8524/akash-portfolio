// Edit this file to update your personal info. No component code needs to
// change when you update these values — they flow through automatically.
//
// Populated from the resume you uploaded (Akash_Shinde_Resume.pdf). A few
// fields aren't in that resume yet — those are still PLACEHOLDER and safe
// to search-and-replace once you have them.

export const profile = {
  name: "Akash Shinde",
  role: "Frontend Developer / Full Stack Development Learner",

  // Short statement shown on the homepage intro card + Introduction page.
  // Taken from the "Profile" section of your resume.
  statement:
    "A web developer with a strong interest in projects that require both conceptual and analytical thinking.",

  education: {
    degree: "Bachelor of Science in Computer Science",
    institution: "Dr. Babasaheb Ambedkar Marathwada University, Sambhajinagar",
    duration: "2023 – 2026",
    gpa: "CGPA: 7.47",
  },

  currentlyLearning: "Full Stack Development",

  location: "Pune District, Maharashtra, India",

  // Separate imagery for Intro and About cards & pages.
  introPhoto: "/images/portrait.jpg",
  aboutPhoto: "/images/portrait.jpg",
  photo: "/images/portrait.jpg", // Fallback for backwards compatibility

  contact: {
    email: "akashshinde0854@gmail.com",
    phone: "+91 8767703203",
  },

  links: {
    github: "PLACEHOLDER_GITHUB_URL", // not in the resume yet
    linkedin: "www.linkedin.com/in/akash-r-shinde", // not in the resume yet
    email: "mailto:akashshinde0854@gmail.com",
    resume: "/resume.pdf", // drop the actual resume PDF into /public as resume.pdf
  },

  // Used by the About page.
  about: {
    // Each array entry renders as its own paragraph. Only the first is
    // from the resume ("Profile" section) — add a second once you've
    // written one; the layout already supports more than one paragraph.
    bio: [
      "A web developer with a strong interest in projects that require both conceptual and analytical thinking.",
      "PLACEHOLDER — a second paragraph on what you're focused on now and the kind of team or role you're aiming for.",
    ],
    careerDirection:
      "To Start my career as a Frontend Developer Trainee, applying my skills in HTML, CSS, JavaScript, and React to.",
    // From the resume's "Strengths" section.
    strengths: [
      "Excellent knowledge of core subjects",
      "Quick learner and adaptable",
      "Good problem-solving skills",
    ],
  },
};
