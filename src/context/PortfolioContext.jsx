import { useState, useMemo, useEffect, useCallback } from "react";
import { profile as defaultProfile } from "../data/profile";
import { projects as defaultProjects } from "../data/projects";
import { experience as defaultExperience } from "../data/experience";
import { skills as defaultSkills } from "../data/skills";
import { generateHomeCards } from "../utils/generateHomeCards";
import { PortfolioContext } from "./PortfolioContextObject";
import { portfolioService } from "../services/portfolioService";

export function PortfolioProvider({ children }) {
  const [profile, setProfile] = useState(defaultProfile);
  const [projects, setProjects] = useState(defaultProjects);
  const [experience, setExperience] = useState(defaultExperience);
  const [skills, setSkills] = useState(defaultSkills);
  const [lastUpdated, setLastUpdated] = useState(() => new Date().toISOString());
  const [status, setStatus] = useState("live");
  const [isLoaded, setIsLoaded] = useState(false);
  const [dataSource, setDataSource] = useState("static");

  // Load initial data
  useEffect(() => {
    let isMounted = true;
    portfolioService
      .fetchAll()
      .then((data) => {
        if (!isMounted) return;
        if (data.profile) setProfile(data.profile);
        if (data.projects) setProjects(data.projects);
        if (data.experience) setExperience(data.experience);
        if (data.skills) setSkills(data.skills);
        if (data.source) setDataSource(data.source);
        if (data.lastUpdated) setLastUpdated(data.lastUpdated);
        setIsLoaded(true);
      })
      .catch((err) => {
        console.warn("Could not load initial portfolio data, using defaults:", err);
        if (isMounted) setIsLoaded(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Compute dynamic homecards whenever the underlying data changes
  const homeCards = useMemo(() => {
    return generateHomeCards({ profile, projects, experience, skills });
  }, [profile, projects, experience, skills]);

  // Persist helper
  const persist = useCallback(
    async (nextState) => {
      const now = new Date().toISOString();
      setLastUpdated(now);
      try {
        await portfolioService.saveAll({
          profile: nextState.profile ?? profile,
          projects: nextState.projects ?? projects,
          experience: nextState.experience ?? experience,
          skills: nextState.skills ?? skills,
        });
      } catch (err) {
        console.error("Failed to sync portfolio data:", err);
        throw err;
      }
    },
    [profile, projects, experience, skills]
  );

  const updateProfile = async (newProfile) => {
    setProfile(newProfile);
    await persist({ profile: newProfile });
    return newProfile;
  };

  const addProject = async (project) => {
    const enriched = {
      ...project,
      id: project.id || `proj_${Date.now()}`,
      status: project.status || "published",
      updatedAt: new Date().toISOString(),
    };
    const next = [enriched, ...projects];
    setProjects(next);
    await persist({ projects: next });
    return enriched;
  };

  const updateProject = async (id, updatedFields) => {
    let updatedItem = null;
    const next = projects.map((p) => {
      if (p.id === id) {
        updatedItem = { ...p, ...updatedFields, updatedAt: new Date().toISOString() };
        return updatedItem;
      }
      return p;
    });
    setProjects(next);
    if (updatedItem) {
      await persist({ projects: next });
    }
    return updatedItem;
  };

  const deleteProject = async (id) => {
    const next = projects.filter((p) => String(p.id) !== String(id));
    setProjects(next);
    await persist({ projects: next });
    return id;
  };

  const addExperience = async (entry) => {
    const enriched = {
      ...entry,
      id: entry.id || `exp_${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    const next = [enriched, ...experience];
    setExperience(next);
    await persist({ experience: next });
    return enriched;
  };

  const updateExperience = async (id, updatedFields) => {
    let updatedItem = null;
    const next = experience.map((item) => {
      if (String(item.id) === String(id)) {
        updatedItem = { ...item, ...updatedFields, updatedAt: new Date().toISOString() };
        return updatedItem;
      }
      return item;
    });
    setExperience(next);
    if (updatedItem) {
      await persist({ experience: next });
    }
    return updatedItem;
  };

  const deleteExperience = async (id) => {
    const next = experience.filter((item) => String(item.id) !== String(id));
    setExperience(next);
    await persist({ experience: next });
    return id;
  };

  const updateSkills = async (newSkills) => {
    setSkills(newSkills);
    await persist({ skills: newSkills });
    return newSkills;
  };

  const resetToDefaults = async () => {
    setProfile(defaultProfile);
    setProjects(defaultProjects);
    setExperience(defaultExperience);
    setSkills(defaultSkills);
    await portfolioService.resetToDefaults();
  };

  const uploadAsset = (file) => {
    return portfolioService.uploadAsset(file);
  };

  const value = {
    profile,
    projects,
    experience,
    skills,
    homeCards,
    lastUpdated,
    status,
    isLoaded,
    dataSource,
    setIsLoaded,
    setStatus,
    setProfile,
    setProjects,
    setExperience,
    setSkills,
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
  };

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}
