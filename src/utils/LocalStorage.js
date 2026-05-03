const PROJECTS_KEY = 'clocker_projects';
const LOGS_PREFIX = 'clocker_logs_';
const DELETE_PHRASE_KEY = 'clocker_delete_phrase';
const DEFAULT_DELETE_PHRASE = 'Cats are better than dogs.';
const ORBIT_STRENGTH_KEY = 'clocker_orbit_strength';
const INVERT_ORBIT_KEY = 'clocker_invert_orbit';
const DEFAULT_ORBIT_STRENGTH = 5;
const DEFAULT_INVERT_ORBIT = true;
const SORT_METHOD_KEY = 'clocker_sort_method';
const DEFAULT_SORT_METHOD = 'most-time';

export const LocalStorage = {
  loadProjects: () => {
    const data = localStorage.getItem(PROJECTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveProjects: (projects) => {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  },

  loadLogs: (projectId) => {
    const data = localStorage.getItem(LOGS_PREFIX + projectId);
    if (!data) return [];
    return JSON.parse(data).map(log => ({
      ...log,
      date: new Date(log.date),
      startTime: log.startTime ? new Date(log.startTime) : null,
      endTime: log.endTime ? new Date(log.endTime) : null,
    }));
  },

  saveLogs: (projectId, logs) => {
    localStorage.setItem(LOGS_PREFIX + projectId, JSON.stringify(logs));
  },

  getDeletePhrase: () => {
    return localStorage.getItem(DELETE_PHRASE_KEY) || DEFAULT_DELETE_PHRASE;
  },

  setDeletePhrase: (phrase) => {
    localStorage.setItem(DELETE_PHRASE_KEY, phrase);
  },

  getDefaultDeletePhrase: () => DEFAULT_DELETE_PHRASE,

  getOrbitStrength: () => {
    const val = localStorage.getItem(ORBIT_STRENGTH_KEY);
    return val !== null ? parseFloat(val) : DEFAULT_ORBIT_STRENGTH;
  },

  setOrbitStrength: (strength) => {
    localStorage.setItem(ORBIT_STRENGTH_KEY, String(strength));
  },

  getInvertOrbit: () => {
    const val = localStorage.getItem(INVERT_ORBIT_KEY);
    return val !== null ? val === 'true' : DEFAULT_INVERT_ORBIT;
  },

  setInvertOrbit: (invert) => {
    localStorage.setItem(INVERT_ORBIT_KEY, String(invert));
  },

  getDefaultOrbitStrength: () => DEFAULT_ORBIT_STRENGTH,
  getDefaultInvertOrbit: () => DEFAULT_INVERT_ORBIT,

  getSortMethod: () => localStorage.getItem(SORT_METHOD_KEY) || DEFAULT_SORT_METHOD,
  setSortMethod: (method) => localStorage.setItem(SORT_METHOD_KEY, method),
};
