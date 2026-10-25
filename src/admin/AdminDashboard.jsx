import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, usePortfolioData } from "../context";
import { portfolioService } from "../services/portfolioService";
import "./AdminDashboard.css";

const EMPTY_PROJECT = {
  id: "",
  title: "",
  shortDescription: "",
  detailedDescription: "",
  date: "",
  status: "published",
  image: "",
  githubUrl: "",
  liveUrl: "",
  technologies: "",
  features: "",
};

const EMPTY_EXPERIENCE = {
  id: "",
  position: "",
  organization: "",
  date: "",
  description: "",
  responsibilities: "",
  technologies: "",
};

export function AdminDashboard() {
  const { logout } = useAuth();
  const {
    profile,
    projects,
    experience,
    skills,
    lastUpdated,
    updateProfile,
    addProject,
    updateProject,
    deleteProject,
    addExperience,
    updateExperience,
    deleteExperience,
    updateSkills,
    resetToDefaults,
    uploadAsset,
  } = usePortfolioData();

  const navigate = useNavigate();
  const isCloudConnected = portfolioService.isCloudConnected();

  const [activeTab, setActiveTab] = useState("profile");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { type, id, title }

  // Helper for quick toast
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3500);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  /* -------------------------------------------------------------
   * TAB 1: PROFILE & ABOUT STATE & HANDLERS
   * ----------------------------------------------------------- */
  const [profileForm, setProfileForm] = useState({
    name: profile.name || "",
    role: profile.role || "",
    statement: profile.statement || "",
    location: profile.location || "",
    introPhoto: profile.introPhoto || profile.photo || "/images/portrait.jpg",
    aboutPhoto: profile.aboutPhoto || profile.photo || "/images/portrait.jpg",
    photo: profile.photo || "/images/portrait.jpg",
    email: profile.contact?.email || "",
    phone: profile.contact?.phone || "",
    github: profile.links?.github || "",
    linkedin: profile.links?.linkedin || "",
    resume: profile.links?.resume || "/resume.pdf",
    currentlyLearning: profile.currentlyLearning || "",
    degree: profile.education?.degree || "",
    institution: profile.education?.institution || "",
    duration: profile.education?.duration || "",
    gpa: profile.education?.gpa || "",
    careerDirection: profile.about?.careerDirection || "",
    bio: profile.about?.bio?.join("\n\n") || "",
    strengths: profile.about?.strengths?.join(", ") || "",
  });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const bioArray = profileForm.bio
        .split("\n\n")
        .map((p) => p.trim())
        .filter(Boolean);

      const strengthsArray = profileForm.strengths
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const updated = {
        ...profile,
        name: profileForm.name.trim(),
        role: profileForm.role.trim(),
        statement: profileForm.statement.trim(),
        location: profileForm.location.trim(),
        introPhoto: profileForm.introPhoto.trim() || "/images/portrait.jpg",
        aboutPhoto: profileForm.aboutPhoto.trim() || "/images/portrait.jpg",
        photo: profileForm.introPhoto.trim() || profileForm.photo.trim() || "/images/portrait.jpg",
        currentlyLearning: profileForm.currentlyLearning.trim(),
        contact: {
          ...profile.contact,
          email: profileForm.email.trim(),
          phone: profileForm.phone.trim(),
        },
        links: {
          ...profile.links,
          github: profileForm.github.trim(),
          linkedin: profileForm.linkedin.trim(),
          email: `mailto:${profileForm.email.trim()}`,
          resume: profileForm.resume.trim(),
        },
        education: {
          degree: profileForm.degree.trim(),
          institution: profileForm.institution.trim(),
          duration: profileForm.duration.trim(),
          gpa: profileForm.gpa.trim(),
        },
        about: {
          ...profile.about,
          careerDirection: profileForm.careerDirection.trim(),
          bio: bioArray.length > 0 ? bioArray : profile.about?.bio || [],
          strengths: strengthsArray,
        },
      };

      await updateProfile(updated);
      showToast("Profile & About updated successfully!");
    } catch (err) {
      showToast(err.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------------------------------------------
   * TAB 2: PROJECTS STATE & HANDLERS
   * ----------------------------------------------------------- */
  const [projectEditorOpen, setProjectEditorOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectForm, setProjectForm] = useState(EMPTY_PROJECT);

  const openAddProject = () => {
    setEditingProjectId(null);
    setProjectForm(EMPTY_PROJECT);
    setProjectEditorOpen(true);
  };

  const openEditProject = (proj) => {
    setEditingProjectId(proj.id);
    setProjectForm({
      id: proj.id,
      title: proj.title || "",
      shortDescription: proj.shortDescription || "",
      detailedDescription: proj.detailedDescription || "",
      date: proj.date || "",
      status: proj.status || "published",
      image: proj.image || "",
      githubUrl: proj.githubUrl || "",
      liveUrl: proj.liveUrl || "",
      technologies: proj.technologies?.join(", ") || "",
      features: proj.features?.join("\n") || "",
    });
    setProjectEditorOpen(true);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const techArray = projectForm.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const featuresArray = projectForm.features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);

      const payload = {
        title: projectForm.title.trim(),
        shortDescription: projectForm.shortDescription.trim(),
        detailedDescription: projectForm.detailedDescription.trim(),
        date: projectForm.date.trim(),
        status: projectForm.status,
        image: projectForm.image.trim() || null,
        githubUrl: projectForm.githubUrl.trim(),
        liveUrl: projectForm.liveUrl.trim(),
        technologies: techArray,
        features: featuresArray,
      };

      if (editingProjectId) {
        await updateProject(editingProjectId, payload);
        showToast(`Updated project "${payload.title}"`);
      } else {
        await addProject(payload);
        showToast(`Created project "${payload.title}"`);
      }
      setProjectEditorOpen(false);
    } catch (err) {
      showToast(err.message || "Failed to save project", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleProjectStatus = async (proj) => {
    const nextStatus = proj.status === "draft" ? "published" : "draft";
    try {
      await updateProject(proj.id, { status: nextStatus });
      showToast(`Set "${proj.title}" to ${nextStatus}`);
    } catch {
      showToast("Failed to update project status", "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const { type, id, title } = deleteTarget;
    setDeleteTarget(null);

    if (type === "project") {
      try {
        await deleteProject(id);
        showToast(`Deleted project "${title}"`);
      } catch {
        showToast("Failed to delete project", "error");
      }
    } else if (type === "experience") {
      try {
        await deleteExperience(id);
        showToast(`Deleted experience entry "${title}"`);
      } catch {
        showToast("Failed to delete experience", "error");
      }
    } else if (type === "reset") {
      try {
        await resetToDefaults();
        showToast("Reset all portfolio content to defaults");
        setTimeout(() => window.location.reload(), 800);
      } catch {
        showToast("Failed to reset defaults", "error");
      }
    }
  };

  /* -------------------------------------------------------------
   * TAB 3: SKILLS & EXPERIENCE STATE & HANDLERS
   * ----------------------------------------------------------- */
  const [newSkillText, setNewSkillText] = useState({});
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleAddSkillTag = async (categoryName) => {
    const text = (newSkillText[categoryName] || "").trim();
    if (!text) return;

    const nextSkills = skills.map((cat) => {
      if (cat.category.toLowerCase() === categoryName.toLowerCase()) {
        if (!cat.items.includes(text)) {
          return { ...cat, items: [...cat.items, text] };
        }
      }
      return cat;
    });

    try {
      await updateSkills(nextSkills);
      setNewSkillText((prev) => ({ ...prev, [categoryName]: "" }));
      showToast(`Added "${text}" to ${categoryName}`);
    } catch {
      showToast("Failed to add skill", "error");
    }
  };

  const handleRemoveSkillTag = async (categoryName, skillItem) => {
    const nextSkills = skills.map((cat) => {
      if (cat.category.toLowerCase() === categoryName.toLowerCase()) {
        return { ...cat, items: cat.items.filter((i) => i !== skillItem) };
      }
      return cat;
    });

    try {
      await updateSkills(nextSkills);
      showToast(`Removed "${skillItem}"`);
    } catch {
      showToast("Failed to remove skill", "error");
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const name = newCategoryName.trim();
    if (!name) return;
    if (skills.some((c) => c.category.toLowerCase() === name.toLowerCase())) {
      showToast(`Category "${name}" already exists`, "error");
      return;
    }
    const nextSkills = [...skills, { category: name, items: [] }];
    try {
      await updateSkills(nextSkills);
      setNewCategoryName("");
      showToast(`Added category "${name}"`);
    } catch {
      showToast("Failed to create category", "error");
    }
  };

  // Experience Handlers
  const [expEditorOpen, setExpEditorOpen] = useState(false);
  const [editingExpId, setEditingExpId] = useState(null);
  const [expForm, setExpForm] = useState(EMPTY_EXPERIENCE);

  const openAddExp = () => {
    setEditingExpId(null);
    setExpForm(EMPTY_EXPERIENCE);
    setExpEditorOpen(true);
  };

  const openEditExp = (item) => {
    setEditingExpId(item.id);
    setExpForm({
      id: item.id,
      position: item.position || "",
      organization: item.organization || "",
      date: item.date || "",
      description: item.description || "",
      responsibilities: item.responsibilities?.join("\n") || "",
      technologies: item.technologies?.join(", ") || "",
    });
    setExpEditorOpen(true);
  };

  const handleExpSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const respArray = expForm.responsibilities
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean);

      const techArray = expForm.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        position: expForm.position.trim(),
        organization: expForm.organization.trim(),
        date: expForm.date.trim(),
        description: expForm.description.trim(),
        responsibilities: respArray,
        technologies: techArray,
      };

      if (editingExpId) {
        await updateExperience(editingExpId, payload);
        showToast(`Updated experience entry`);
      } else {
        await addExperience(payload);
        showToast(`Added experience entry`);
      }
      setExpEditorOpen(false);
    } catch {
      showToast("Failed to save experience entry", "error");
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------------------------------------------
   * TAB 4: SETTINGS & BACKUP HANDLERS
   * ----------------------------------------------------------- */
  const handleExportBackup = () => {
    const backupData = {
      profile,
      projects,
      experience,
      skills,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Backup JSON file downloaded!");
  };


  // Image Upload Handler
  const handleImageUpload = async (e, targetSetter) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showToast("Compressing & optimizing image…");
      const base64 = await uploadAsset(file);
      targetSetter(base64);
      showToast("Image ready!");
    } catch {
      showToast("Failed to process image", "error");
    }
  };

  const formattedDate = new Date(lastUpdated).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="admin-hub">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`admin-hub__toast admin-hub__toast--${toast.type}`}>
          <span>{toast.type === "success" ? "✓" : "⚠️"}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="admin-hub__topbar">
        <div className="admin-hub__topbar-brand">
          <span className="admin-hub__logo-dot" />
          <h1 className="admin-hub__logo-text">PORTFOLIO CMS</h1>
          <span className={`admin-hub__status-badge ${isCloudConnected ? "is-cloud" : "is-local"}`}>
            {isCloudConnected ? "UPSTASH CLOUD SYNC" : "LOCAL CMS MODE"}
          </span>
        </div>

        <div className="admin-hub__topbar-actions">
          <span className="admin-hub__last-updated">Synced: {formattedDate}</span>
          <Link to="/" target="_blank" rel="noreferrer" className="admin-hub__site-btn">
            View Live Portfolio ↗
          </Link>
          <button onClick={handleLogout} className="admin-hub__logout-btn" title="Sign out & lock admin">
            Lock Admin 🔒
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="admin-hub__body">
        {/* Navigation Tabs */}
        <nav className="admin-hub__tabs" aria-label="Admin Navigation Tabs">
          <button
            type="button"
            className={`admin-hub__tab ${activeTab === "profile" ? "is-active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <span>👤</span>
            <span>Profile & About</span>
          </button>

          <button
            type="button"
            className={`admin-hub__tab ${activeTab === "projects" ? "is-active" : ""}`}
            onClick={() => setActiveTab("projects")}
          >
            <span>🚀</span>
            <span>Projects ({projects.length})</span>
          </button>

          <button
            type="button"
            className={`admin-hub__tab ${activeTab === "skills" ? "is-active" : ""}`}
            onClick={() => setActiveTab("skills")}
          >
            <span>⚡</span>
            <span>Skills & Experience</span>
          </button>

          <button
            type="button"
            className={`admin-hub__tab ${activeTab === "settings" ? "is-active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <span>⚙️</span>
            <span>Cloud & Backup</span>
          </button>
        </nav>

        {/* Tab 1: Profile & About */}
        {activeTab === "profile" && (
          <form className="admin-hub__panel" onSubmit={handleProfileSave}>
            <div className="admin-hub__panel-header">
              <div>
                <h2 className="admin-hub__panel-title">Identity & About Bio</h2>
                <p className="admin-hub__panel-desc">Manage your bio, contact channels, portrait photo, and education.</p>
              </div>
              <button type="submit" className="admin-hub__primary-btn" disabled={saving}>
                {saving ? "Saving…" : "Save Profile Changes"}
              </button>
            </div>

            <div className="admin-hub__grid-2">
              <div className="admin-hub__card">
                <h3 className="admin-hub__card-title">Basic Information</h3>
                
                <div className="admin-hub__field">
                  <label htmlFor="p-name">Full Name</label>
                  <input
                    id="p-name"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-hub__field">
                  <label htmlFor="p-role">Professional Title / Role</label>
                  <input
                    id="p-role"
                    value={profileForm.role}
                    onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-hub__field">
                  <label htmlFor="p-statement">Hero Statement / Elevator Pitch</label>
                  <textarea
                    id="p-statement"
                    rows={3}
                    value={profileForm.statement}
                    onChange={(e) => setProfileForm({ ...profileForm, statement: e.target.value })}
                  />
                </div>

                <div className="admin-hub__field">
                  <label htmlFor="p-location">Location</label>
                  <input
                    id="p-location"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-hub__card">
                <h3 className="admin-hub__card-title">Contact Channels & Links</h3>

                <div className="admin-hub__field">
                  <label htmlFor="p-email">Public Email</label>
                  <input
                    id="p-email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  />
                </div>

                <div className="admin-hub__field">
                  <label htmlFor="p-phone">Phone Number</label>
                  <input
                    id="p-phone"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  />
                </div>

                <div className="admin-hub__field">
                  <label htmlFor="p-github">GitHub Profile URL</label>
                  <input
                    id="p-github"
                    value={profileForm.github}
                    onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>

                <div className="admin-hub__field">
                  <label htmlFor="p-linkedin">LinkedIn Profile URL</label>
                  <input
                    id="p-linkedin"
                    value={profileForm.linkedin}
                    onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div className="admin-hub__field">
                  <label htmlFor="p-resume">Resume PDF Link or Path</label>
                  <input
                    id="p-resume"
                    value={profileForm.resume}
                    onChange={(e) => setProfileForm({ ...profileForm, resume: e.target.value })}
                    placeholder="/resume.pdf"
                  />
                </div>
              </div>
            </div>

            {/* Dedicated Card & Page Imagery Control */}
            <div className="admin-hub__card" style={{ marginTop: "1rem" }}>
              <div className="admin-hub__card-header-row">
                <div>
                  <h3 className="admin-hub__card-title" style={{ marginBottom: "0.25rem" }}>
                    Card & Page Imagery
                  </h3>
                  <p className="admin-hub__panel-desc">
                    Separate image controls for your Intro card/page and About card/page.
                  </p>
                </div>
              </div>

              <div className="admin-hub__grid-2" style={{ marginTop: "1rem" }}>
                {/* Intro Card & Page Image */}
                <div className="admin-hub__field">
                  <label htmlFor="p-intro-photo" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Intro Card & Page Image</span>
                    <span className="admin-hub__field-tag">Card 01 & /intro</span>
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      id="p-intro-photo"
                      value={profileForm.introPhoto}
                      onChange={(e) => setProfileForm({ ...profileForm, introPhoto: e.target.value })}
                      placeholder="/images/portrait.jpg"
                    />
                    <label className="admin-hub__file-btn">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) =>
                          handleImageUpload(e, (url) =>
                            setProfileForm((prev) => ({ ...prev, introPhoto: url }))
                          )
                        }
                      />
                    </label>
                  </div>
                  {profileForm.introPhoto && (
                    <div className="admin-hub__image-preview-box">
                      <img
                        src={profileForm.introPhoto}
                        alt="Intro preview"
                        className="admin-hub__image-preview-thumb"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      <div className="admin-hub__image-preview-info">
                        <span className="admin-hub__image-preview-status">Active Intro Image</span>
                        <button
                          type="button"
                          className="admin-hub__image-preview-reset"
                          onClick={() => setProfileForm((prev) => ({ ...prev, introPhoto: "/images/portrait.jpg" }))}
                        >
                          Reset to default
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* About Card & Page Image */}
                <div className="admin-hub__field">
                  <label htmlFor="p-about-photo" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>About Me Card & Page Image</span>
                    <span className="admin-hub__field-tag">Card 02 & /about</span>
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      id="p-about-photo"
                      value={profileForm.aboutPhoto}
                      onChange={(e) => setProfileForm({ ...profileForm, aboutPhoto: e.target.value })}
                      placeholder="/images/portrait.jpg"
                    />
                    <label className="admin-hub__file-btn">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) =>
                          handleImageUpload(e, (url) =>
                            setProfileForm((prev) => ({ ...prev, aboutPhoto: url }))
                          )
                        }
                      />
                    </label>
                  </div>
                  {profileForm.aboutPhoto && (
                    <div className="admin-hub__image-preview-box">
                      <img
                        src={profileForm.aboutPhoto}
                        alt="About preview"
                        className="admin-hub__image-preview-thumb"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      <div className="admin-hub__image-preview-info">
                        <span className="admin-hub__image-preview-status">Active About Image</span>
                        <button
                          type="button"
                          className="admin-hub__image-preview-reset"
                          onClick={() => setProfileForm((prev) => ({ ...prev, aboutPhoto: "/images/portrait.jpg" }))}
                        >
                          Reset to default
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="admin-hub__card" style={{ marginTop: "1rem" }}>
              <h3 className="admin-hub__card-title">About Story & Education</h3>

              <div className="admin-hub__field">
                <label htmlFor="p-bio">Bio Story (Separate multiple paragraphs with a blank line)</label>
                <textarea
                  id="p-bio"
                  rows={4}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  placeholder="First paragraph...&#10;&#10;Second paragraph..."
                />
              </div>

              <div className="admin-hub__field">
                <label htmlFor="p-direction">Career Direction Statement</label>
                <input
                  id="p-direction"
                  value={profileForm.careerDirection}
                  onChange={(e) => setProfileForm({ ...profileForm, careerDirection: e.target.value })}
                />
              </div>

              <div className="admin-hub__field">
                <label htmlFor="p-strengths">Strengths (Comma separated)</label>
                <input
                  id="p-strengths"
                  value={profileForm.strengths}
                  onChange={(e) => setProfileForm({ ...profileForm, strengths: e.target.value })}
                  placeholder="Quick learner, Problem solver, Good communication"
                />
              </div>

              <div className="admin-hub__grid-2" style={{ marginTop: "0.5rem" }}>
                <div className="admin-hub__field">
                  <label htmlFor="p-degree">Degree</label>
                  <input
                    id="p-degree"
                    value={profileForm.degree}
                    onChange={(e) => setProfileForm({ ...profileForm, degree: e.target.value })}
                  />
                </div>
                <div className="admin-hub__field">
                  <label htmlFor="p-inst">Institution</label>
                  <input
                    id="p-inst"
                    value={profileForm.institution}
                    onChange={(e) => setProfileForm({ ...profileForm, institution: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: Projects */}
        {activeTab === "projects" && (
          <div className="admin-hub__panel">
            <div className="admin-hub__panel-header">
              <div>
                <h2 className="admin-hub__panel-title">Projects Showcase</h2>
                <p className="admin-hub__panel-desc">Add, edit, or toggle published status for your portfolio projects.</p>
              </div>
              <button
                type="button"
                className="admin-hub__primary-btn"
                onClick={openAddProject}
              >
                + Add New Project
              </button>
            </div>

            {/* Project Editor Modal / Expandable Form */}
            {projectEditorOpen && (
              <form className="admin-hub__editor-box" onSubmit={handleProjectSubmit}>
                <div className="admin-hub__editor-header">
                  <h3>{editingProjectId ? "Edit Project" : "Add New Project"}</h3>
                  <button type="button" className="admin-hub__close-btn" onClick={() => setProjectEditorOpen(false)}>
                    ✕
                  </button>
                </div>

                <div className="admin-hub__grid-2">
                  <div className="admin-hub__field">
                    <label htmlFor="proj-title">Project Title</label>
                    <input
                      id="proj-title"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      placeholder="e.g. Typography Web"
                      required
                    />
                  </div>

                  <div className="admin-hub__field">
                    <label htmlFor="proj-date">Date / Year</label>
                    <input
                      id="proj-date"
                      value={projectForm.date}
                      onChange={(e) => setProjectForm({ ...projectForm, date: e.target.value })}
                      placeholder="e.g. 2025"
                    />
                  </div>
                </div>

                <div className="admin-hub__field">
                  <label htmlFor="proj-short">Short Summary (Shown on project card)</label>
                  <input
                    id="proj-short"
                    value={projectForm.shortDescription}
                    onChange={(e) => setProjectForm({ ...projectForm, shortDescription: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-hub__field">
                  <label htmlFor="proj-detailed">Detailed Description (Shown on project page)</label>
                  <textarea
                    id="proj-detailed"
                    rows={3}
                    value={projectForm.detailedDescription}
                    onChange={(e) => setProjectForm({ ...projectForm, detailedDescription: e.target.value })}
                  />
                </div>

                <div className="admin-hub__field">
                  <label htmlFor="proj-tech">Technologies (Comma separated)</label>
                  <input
                    id="proj-tech"
                    value={projectForm.technologies}
                    onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                    placeholder="React, CSS, JavaScript"
                  />
                </div>

                <div className="admin-hub__field">
                  <label htmlFor="proj-features">Key Features (One feature per line)</label>
                  <textarea
                    id="proj-features"
                    rows={3}
                    value={projectForm.features}
                    onChange={(e) => setProjectForm({ ...projectForm, features: e.target.value })}
                    placeholder="Real-time performance tracking&#10;Animated keyboard&#10;Dark mode theme"
                  />
                </div>

                <div className="admin-hub__grid-2">
                  <div className="admin-hub__field">
                    <label htmlFor="proj-github">GitHub Repository Link</label>
                    <input
                      id="proj-github"
                      value={projectForm.githubUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                      placeholder="https://github.com/..."
                    />
                  </div>

                  <div className="admin-hub__field">
                    <label htmlFor="proj-live">Live Demo Link</label>
                    <input
                      id="proj-live"
                      value={projectForm.liveUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="admin-hub__field">
                  <label htmlFor="proj-img">Screenshot Image (Path, URL, or upload)</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      id="proj-img"
                      value={projectForm.image}
                      onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                      placeholder="/images/projects/preview.png"
                    />
                    <label className="admin-hub__file-btn">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleImageUpload(e, (url) => setProjectForm((prev) => ({ ...prev, image: url })))}
                      />
                    </label>
                  </div>
                </div>

                <div className="admin-hub__field">
                  <label htmlFor="proj-status">Publication Status</label>
                  <select
                    id="proj-status"
                    value={projectForm.status}
                    onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                  >
                    <option value="published">Published (Visible to everyone)</option>
                    <option value="draft">Draft (Hidden from visitors)</option>
                  </select>
                </div>

                <div className="admin-hub__editor-actions">
                  <button type="submit" className="admin-hub__primary-btn" disabled={saving}>
                    {saving ? "Saving…" : "Save Project"}
                  </button>
                  <button type="button" className="admin-hub__secondary-btn" onClick={() => setProjectEditorOpen(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Projects List */}
            <div className="admin-hub__project-list">
              {projects.length === 0 ? (
                <p className="admin-hub__empty">No projects added yet. Click "+ Add New Project" above.</p>
              ) : (
                projects.map((proj) => (
                  <div key={proj.id} className="admin-hub__project-row">
                    <div className="admin-hub__project-info">
                      <div className="admin-hub__project-header">
                        <h4 className="admin-hub__project-title">{proj.title}</h4>
                        <span className={`admin-hub__pill ${proj.status === "draft" ? "is-draft" : "is-published"}`}>
                          {proj.status === "draft" ? "Draft" : "Published"}
                        </span>
                        {proj.date && <span className="admin-hub__project-date">{proj.date}</span>}
                      </div>
                      <p className="admin-hub__project-desc">{proj.shortDescription}</p>
                      {proj.technologies && (
                        <div className="admin-hub__tags-row">
                          {proj.technologies.slice(0, 4).map((t, idx) => (
                            <span key={`${t}-${idx}`} className="admin-hub__tag">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="admin-hub__project-actions">
                      <button
                        type="button"
                        onClick={() => handleToggleProjectStatus(proj)}
                        className="admin-hub__icon-btn"
                        title={proj.status === "draft" ? "Publish project" : "Move to draft"}
                      >
                        {proj.status === "draft" ? "Publish" : "Draft"}
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditProject(proj)}
                        className="admin-hub__icon-btn"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget({ type: "project", id: proj.id, title: proj.title })}
                        className="admin-hub__icon-btn is-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Skills & Experience */}
        {activeTab === "skills" && (
          <div className="admin-hub__panel">
            <div className="admin-hub__panel-header">
              <div>
                <h2 className="admin-hub__panel-title">Skills & Experience Timeline</h2>
                <p className="admin-hub__panel-desc">Manage your categorized technical skills and career history.</p>
              </div>
            </div>

            {/* Skills Section */}
            <div className="admin-hub__card" style={{ marginBottom: "1.5rem" }}>
              <h3 className="admin-hub__card-title">Technical Skills Categories</h3>

              <div className="admin-hub__skills-grid">
                {skills.map((category) => (
                  <div key={category.category} className="admin-hub__skill-category">
                    <h4 className="admin-hub__category-title">{category.category}</h4>
                    <div className="admin-hub__skill-tags">
                      {category.items.map((skill) => (
                        <span key={skill} className="admin-hub__skill-tag">
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkillTag(category.category, skill)}
                            title={`Remove ${skill}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="admin-hub__add-tag-box">
                      <input
                        placeholder={`+ Add to ${category.category}…`}
                        value={newSkillText[category.category] || ""}
                        onChange={(e) => setNewSkillText({ ...newSkillText, [category.category]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSkillTag(category.category);
                          }
                        }}
                      />
                      <button type="button" onClick={() => handleAddSkillTag(category.category)}>
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Category */}
              <form onSubmit={handleAddCategory} className="admin-hub__new-cat-form">
                <input
                  placeholder="New category name (e.g. Tools, DevOps)…"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <button type="submit" className="admin-hub__secondary-btn">
                  + Create Category
                </button>
              </form>
            </div>

            {/* Experience Section */}
            <div className="admin-hub__card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 className="admin-hub__card-title" style={{ margin: 0 }}>Career Experience Entries</h3>
                <button type="button" className="admin-hub__primary-btn" onClick={openAddExp}>
                  + Add Role / Experience
                </button>
              </div>

              {/* Experience Editor */}
              {expEditorOpen && (
                <form className="admin-hub__editor-box" onSubmit={handleExpSubmit} style={{ marginBottom: "1.25rem" }}>
                  <div className="admin-hub__editor-header">
                    <h4>{editingExpId ? "Edit Role" : "Add New Role"}</h4>
                    <button type="button" className="admin-hub__close-btn" onClick={() => setExpEditorOpen(false)}>
                      ✕
                    </button>
                  </div>

                  <div className="admin-hub__grid-2">
                    <div className="admin-hub__field">
                      <label htmlFor="exp-pos">Job Title / Position</label>
                      <input
                        id="exp-pos"
                        value={expForm.position}
                        onChange={(e) => setExpForm({ ...expForm, position: e.target.value })}
                        required
                      />
                    </div>
                    <div className="admin-hub__field">
                      <label htmlFor="exp-org">Company / Organization</label>
                      <input
                        id="exp-org"
                        value={expForm.organization}
                        onChange={(e) => setExpForm({ ...expForm, organization: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="admin-hub__field">
                    <label htmlFor="exp-date">Date Period</label>
                    <input
                      id="exp-date"
                      value={expForm.date}
                      onChange={(e) => setExpForm({ ...expForm, date: e.target.value })}
                      placeholder="e.g. Jan 2025 – Present"
                    />
                  </div>

                  <div className="admin-hub__field">
                    <label htmlFor="exp-desc">Summary</label>
                    <input
                      id="exp-desc"
                      value={expForm.description}
                      onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                    />
                  </div>

                  <div className="admin-hub__field">
                    <label htmlFor="exp-resp">Responsibilities (One per line)</label>
                    <textarea
                      id="exp-resp"
                      rows={3}
                      value={expForm.responsibilities}
                      onChange={(e) => setExpForm({ ...expForm, responsibilities: e.target.value })}
                    />
                  </div>

                  <div className="admin-hub__editor-actions">
                    <button type="submit" className="admin-hub__primary-btn" disabled={saving}>
                      Save Role
                    </button>
                    <button type="button" className="admin-hub__secondary-btn" onClick={() => setExpEditorOpen(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Experience List */}
              <div className="admin-hub__exp-list">
                {experience.length === 0 ? (
                  <p className="admin-hub__empty">No experience entries listed.</p>
                ) : (
                  experience.map((item) => (
                    <div key={item.id} className="admin-hub__exp-row">
                      <div>
                        <h4 className="admin-hub__exp-title">
                          {item.position} <span className="admin-hub__exp-org">@ {item.organization}</span>
                        </h4>
                        <span className="admin-hub__exp-date">{item.date}</span>
                        <p className="admin-hub__exp-desc">{item.description}</p>
                      </div>
                      <div className="admin-hub__project-actions">
                        <button type="button" className="admin-hub__icon-btn" onClick={() => openEditExp(item)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="admin-hub__icon-btn is-danger"
                          onClick={() => setDeleteTarget({ type: "experience", id: item.id, title: item.position })}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Settings & Backup */}
        {activeTab === "settings" && (
          <div className="admin-hub__panel">
            <div className="admin-hub__panel-header">
              <div>
                <h2 className="admin-hub__panel-title">Cloud Synchronization & Backup</h2>
                <p className="admin-hub__panel-desc">Status of your Upstash Redis cloud store, data exports, and emergency reset.</p>
              </div>
            </div>

            <div className="admin-hub__card" style={{ marginBottom: "1.5rem" }}>
              <h3 className="admin-hub__card-title">Storage Engine Status</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <span className={`admin-hub__pill ${isCloudConnected ? "is-published" : "is-draft"}`}>
                  {isCloudConnected ? "Upstash Cloud Connected" : "Local Mode (Offline/Dev)"}
                </span>
                <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted, #55503f)" }}>
                  {isCloudConnected
                    ? "Changes are automatically saved to your Upstash Redis database 24/7."
                    : "Running locally via localStorage. Add your Upstash credentials to .env to enable 24/7 cloud sync."}
                </span>
              </div>

              {!isCloudConnected && (
                <div className="admin-hub__callout">
                  <strong>How to connect Upstash Redis (100% Free):</strong>
                  <ol style={{ margin: "0.5rem 0 0 1.25rem", padding: 0 }}>
                    <li>Create a free database at <a href="https://upstash.com" target="_blank" rel="noreferrer">upstash.com</a>.</li>
                    <li>Click on your database and scroll down to <strong>"REST API"</strong>.</li>
                    <li>Copy <code>UPSTASH_REDIS_REST_URL</code> and <code>UPSTASH_REDIS_REST_TOKEN</code>.</li>
                    <li>Add them to your <code>.env</code> file as <code>VITE_UPSTASH_REDIS_REST_URL</code> and <code>VITE_UPSTASH_REDIS_REST_TOKEN</code>.</li>
                  </ol>
                </div>
              )}
            </div>

            <div className="admin-hub__card">
              <h3 className="admin-hub__card-title">Data Safety & Tools</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted, #55503f)", margin: "0 0 1.25rem 0" }}>
                Download a complete JSON snapshot of your portfolio content anytime for safety, or reset back to source files if needed.
              </p>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <button type="button" onClick={handleExportBackup} className="admin-hub__primary-btn">
                  Download Full JSON Backup 💾
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget({ type: "reset", title: "all customized content" })}
                  className="admin-hub__secondary-btn is-danger"
                >
                  Reset to Defaults ↺
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* In-App Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="admin-hub__modal-backdrop" onClick={() => setDeleteTarget(null)}>
          <div className="admin-hub__modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-hub__modal-header">
              <h3 style={{ margin: 0, color: "var(--color-text, #191712)", fontSize: "1.2rem", fontFamily: "var(--font-display)" }}>
                {deleteTarget.type === "reset" ? "Reset to Defaults?" : "Confirm Delete"}
              </h3>
              <button
                type="button"
                className="admin-hub__close-btn"
                onClick={() => setDeleteTarget(null)}
              >
                ✕
              </button>
            </div>
            <p style={{ color: "var(--color-text-muted, #55503f)", fontSize: "0.92rem", margin: "1rem 0", lineHeight: 1.5 }}>
              Are you sure you want to {deleteTarget.type === "reset" ? "reset" : "permanently delete"}{" "}
              <strong style={{ color: "#b91c1c" }}>"{deleteTarget.title}"</strong>?
              {deleteTarget.type === "reset"
                ? " This will revert all your customized portfolio data back to code defaults."
                : " This action cannot be undone."}
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
              <button
                type="button"
                className="admin-hub__secondary-btn"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-hub__primary-btn is-danger"
                onClick={handleConfirmDelete}
              >
                {deleteTarget.type === "reset" ? "Yes, Reset Everything" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
