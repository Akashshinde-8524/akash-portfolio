import { profile as defaultProfile } from "../data/profile";
import { projects as defaultProjects } from "../data/projects";
import { experience as defaultExperience } from "../data/experience";
import { skills as defaultSkills } from "../data/skills";

const STORAGE_KEY = "portfolio_cms_unified_data";
const UPSTASH_DOC_KEY = "portfolio_data";

export const portfolioService = {
  getUpstashConfig() {
    const url = import.meta.env.VITE_UPSTASH_REDIS_REST_URL;
    const token = import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN;
    return {
      url: url ? url.trim().replace(/\/$/, "") : "",
      token: token ? token.trim() : "",
      isConfigured: Boolean(url && token),
    };
  },

  isCloudConnected() {
    return this.getUpstashConfig().isConfigured;
  },

  /**
   * Fetch all portfolio content.
   * Prioritizes Upstash Redis Cloud; falls back to localStorage or default files.
   */
  async fetchAll() {
    const { url, token, isConfigured } = this.getUpstashConfig();

    if (isConfigured) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(["GET", UPSTASH_DOC_KEY]),
        });

        if (response.ok) {
          const json = await response.json();
          if (json.result) {
            const cloudData = typeof json.result === "string" ? JSON.parse(json.result) : json.result;
            // Cache to local storage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
            return {
              profile: cloudData.profile || defaultProfile,
              projects: Array.isArray(cloudData.projects) ? cloudData.projects : defaultProjects,
              experience: Array.isArray(cloudData.experience) ? cloudData.experience : defaultExperience,
              skills: Array.isArray(cloudData.skills) ? cloudData.skills : defaultSkills,
              source: "upstash",
              lastUpdated: cloudData.lastUpdated || new Date().toISOString(),
            };
          }
        }
      } catch (err) {
        console.warn("Could not reach Upstash Cloud, falling back to local cache:", err);
      }
    }

    // Local / Offline Fallback
    try {
      const localStr = localStorage.getItem(STORAGE_KEY);
      if (localStr) {
        const localData = JSON.parse(localStr);
        return {
          profile: localData.profile || defaultProfile,
          projects: Array.isArray(localData.projects) ? localData.projects : defaultProjects,
          experience: Array.isArray(localData.experience) ? localData.experience : defaultExperience,
          skills: Array.isArray(localData.skills) ? localData.skills : defaultSkills,
          source: "local",
          lastUpdated: localData.lastUpdated || new Date().toISOString(),
        };
      }
    } catch (e) {
      console.warn("Error reading local storage cache:", e);
    }

    // Static default fallback
    return {
      profile: defaultProfile,
      projects: defaultProjects,
      experience: defaultExperience,
      skills: defaultSkills,
      source: "static",
      lastUpdated: new Date().toISOString(),
    };
  },

  /**
   * Save the complete unified data state to Upstash Redis and LocalStorage
   */
  async saveAll(data) {
    const payload = {
      profile: data.profile,
      projects: data.projects,
      experience: data.experience,
      skills: data.skills,
      lastUpdated: new Date().toISOString(),
    };

    // Always mirror to localStorage immediately for instant UI response & offline availability
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

    const { url, token, isConfigured } = this.getUpstashConfig();
    if (isConfigured) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(["SET", UPSTASH_DOC_KEY, JSON.stringify(payload)]),
        });

        if (!response.ok) {
          throw new Error(`Upstash save failed with HTTP status ${response.status}`);
        }
      } catch (err) {
        console.error("Failed to sync to Upstash Cloud:", err);
        throw err;
      }
    }

    return payload;
  },

  /**
   * Save updated profile
   */
  async saveProfile(newProfile, currentAllData) {
    return this.saveAll({
      ...currentAllData,
      profile: newProfile,
    });
  },

  /**
   * Save or update a project
   */
  async saveProject(project, currentAllData) {
    const projectId = project.id || `proj_${Date.now()}`;
    const payload = { ...project, id: projectId, updatedAt: new Date().toISOString() };
    const list = [...(currentAllData.projects || [])];
    const index = list.findIndex((p) => p.id === projectId);

    if (index >= 0) {
      list[index] = payload;
    } else {
      list.unshift(payload);
    }

    await this.saveAll({
      ...currentAllData,
      projects: list,
    });
    return payload;
  },

  /**
   * Delete a project
   */
  async deleteProject(projectId, currentAllData) {
    const filtered = (currentAllData.projects || []).filter((p) => p.id !== projectId);
    await this.saveAll({
      ...currentAllData,
      projects: filtered,
    });
    return projectId;
  },

  /**
   * Save or update experience
   */
  async saveExperience(entry, currentAllData) {
    const expId = entry.id || `exp_${Date.now()}`;
    const payload = { ...entry, id: expId, updatedAt: new Date().toISOString() };
    const list = [...(currentAllData.experience || [])];
    const index = list.findIndex((e) => e.id === expId);

    if (index >= 0) {
      list[index] = payload;
    } else {
      list.unshift(payload);
    }

    await this.saveAll({
      ...currentAllData,
      experience: list,
    });
    return payload;
  },

  /**
   * Delete experience entry
   */
  async deleteExperience(expId, currentAllData) {
    const filtered = (currentAllData.experience || []).filter((e) => e.id !== expId);
    await this.saveAll({
      ...currentAllData,
      experience: filtered,
    });
    return expId;
  },

  /**
   * Save skills array
   */
  async saveSkills(newSkills, currentAllData) {
    return this.saveAll({
      ...currentAllData,
      skills: newSkills,
    });
  },

  /**
   * Reset all data back to original defaults
   */
  async resetToDefaults() {
    const defaults = {
      profile: defaultProfile,
      projects: defaultProjects,
      experience: defaultExperience,
      skills: defaultSkills,
    };
    return this.saveAll(defaults);
  },

  /**
   * Helper to convert an uploaded image file to an optimized Base64 data URL
   * with automatic client-side resizing to keep cloud storage lightweight.
   */
  async uploadAsset(file, maxDimension = 1200) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        img.onerror = () => resolve(e.target.result); // Fallback to raw dataUrl
        img.src = e.target.result;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  },
};
