import { IconId, Project, Tag, TimeLog } from '../types';
import { DEFAULT_DELETE_PHRASE, DEFAULT_INVERT_ORBIT, DEFAULT_ORBIT_STRENGTH, DEFAULT_SORT_METHOD } from './SettingsDefaults';

const PROJECTS_KEY = 'clocker_projects';
const LOGS_PREFIX = 'clocker_logs_';
const DELETE_PHRASE_KEY = 'clocker_delete_phrase';
const ORBIT_STRENGTH_KEY = 'clocker_orbit_strength';
const INVERT_ORBIT_KEY = 'clocker_invert_orbit';
const SORT_METHOD_KEY = 'clocker_sort_method';

interface SerializedTimeLog {
  date: string;
  startTime: string;
  endTime: string | null;
  tagId?: string;
}

interface StoredProject {
  id: string;
  name: string;
  description: string;
  icon: IconId;
  active?: boolean;
  starred?: boolean;
  tags?: Tag[];
}

export const LocalStorage = {
  loadProjects(): Project[] {
    const serializedProjects = localStorage.getItem(PROJECTS_KEY);
    if (!serializedProjects) return [];
    return (JSON.parse(serializedProjects) as StoredProject[]).map(project => ({
      ...project,
      active: project.active ?? false,
      starred: project.starred ?? false,
      tags: project.tags ?? [],
    }));
  },

  saveProjects(projects: Project[]): void {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  },

  loadLogs(projectId: string): TimeLog[] {
    const serializedLogs = localStorage.getItem(LOGS_PREFIX + projectId);
    if (!serializedLogs) return [];
    return (JSON.parse(serializedLogs) as SerializedTimeLog[]).map(log => ({
      date: new Date(log.date),
      startTime: new Date(log.startTime),
      endTime: log.endTime ? new Date(log.endTime) : null,
      tagId: log.tagId,
    }));
  },

  saveLogs(projectId: string, logs: TimeLog[]): void {
    localStorage.setItem(LOGS_PREFIX + projectId, JSON.stringify(logs));
  },

  getDeletePhrase(): string {
    return localStorage.getItem(DELETE_PHRASE_KEY) ?? DEFAULT_DELETE_PHRASE;
  },

  setDeletePhrase(phrase: string): void {
    localStorage.setItem(DELETE_PHRASE_KEY, phrase);
  },

  getOrbitStrength(): number {
    const storedValue = localStorage.getItem(ORBIT_STRENGTH_KEY);
    return storedValue !== null ? parseFloat(storedValue) : DEFAULT_ORBIT_STRENGTH;
  },

  setOrbitStrength(strength: number): void {
    localStorage.setItem(ORBIT_STRENGTH_KEY, String(strength));
  },

  getInvertOrbit(): boolean {
    const storedValue = localStorage.getItem(INVERT_ORBIT_KEY);
    return storedValue !== null ? storedValue === 'true' : DEFAULT_INVERT_ORBIT;
  },

  setInvertOrbit(invert: boolean): void {
    localStorage.setItem(INVERT_ORBIT_KEY, String(invert));
  },

  getSortMethod(): string {
    return localStorage.getItem(SORT_METHOD_KEY) ?? DEFAULT_SORT_METHOD;
  },

  setSortMethod(method: string): void {
    localStorage.setItem(SORT_METHOD_KEY, method);
  },
};
