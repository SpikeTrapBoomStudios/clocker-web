const PROJECTS_KEY = 'clocker_projects';
const LOGS_PREFIX = 'clocker_logs_';
const EFFECT_STRENGTH_KEY = 'clocker_effect_strength';
const INVERT_EFFECT_KEY = 'clocker_invert_effect';
const DELETE_PHRASE_KEY = 'clocker_delete_phrase';
const DEFAULT_DELETE_PHRASE = 'Cats are better than dogs.';

export const Storage = {
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

  deleteLog: (projectId, index) => {
    const logs = Storage.loadLogs(projectId);
    logs.splice(index, 1);
    Storage.saveLogs(projectId, logs);
  },

  getEffectStrength: () => {
    const value = localStorage.getItem(EFFECT_STRENGTH_KEY);
    return value ? parseFloat(value) : 5;
  },

  setEffectStrength: (strength) => {
    localStorage.setItem(EFFECT_STRENGTH_KEY, strength.toString());
  },

  getInvertEffect: () => {
    const value = localStorage.getItem(INVERT_EFFECT_KEY);
    return value ? JSON.parse(value) : true;
  },

  setInvertEffect: (inverted) => {
    localStorage.setItem(INVERT_EFFECT_KEY, JSON.stringify(inverted));
  },

  getDeletePhrase: () => {
    return localStorage.getItem(DELETE_PHRASE_KEY) || DEFAULT_DELETE_PHRASE;
  },

  setDeletePhrase: (phrase) => {
    localStorage.setItem(DELETE_PHRASE_KEY, phrase);
  },

  getDefaultDeletePhrase: () => DEFAULT_DELETE_PHRASE,
};
