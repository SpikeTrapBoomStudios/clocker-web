export const ICON_IDS = [
  'clock', 'code', 'wrench', 'folder', 'chart',
  'game', 'bookmark', 'terminal', 'graduation', 'pencil',
  'backpack', 'book', 'exercise', 'money', 'swimming',
] as const;

export type IconId = (typeof ICON_IDS)[number];

export interface Project {
  id: string;
  name: string;
  description: string;
  icon: IconId;
  active: boolean;
  starred: boolean;
}

export interface ProjectFormData {
  id?: string;
  name: string;
  description: string;
  icon: IconId;
}

export interface TimeLog {
  date: Date;
  startTime: Date;
  endTime: Date | null;
}
